-- Update RLS policies and functions to use group_id instead of clan_id
-- Note: This migration assumes migration 046 (rename_clans_to_groups) has been applied

-- 1. Drop function with CASCADE to handle dependent policies
DROP FUNCTION IF EXISTS user_in_clan_or_allied_clan(UUID, UUID) CASCADE;

-- 2. Recreate the user_in_clan_or_allied_clan function to use group terminology
CREATE OR REPLACE FUNCTION user_in_clan_or_allied_clan(group_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    -- User is a member of the group
    SELECT 1 FROM group_members
    WHERE group_id = $1 AND user_id = $2
  )
  OR EXISTS(
    -- User is in an allied group
    SELECT 1 FROM alliances a
    JOIN alliance_members am1 ON a.id = am1.alliance_id AND am1.group_id = $1
    JOIN alliance_members am2 ON a.id = am2.alliance_id AND am2.group_id IN (
      SELECT group_id FROM group_members WHERE user_id = $2
    )
    WHERE am1.status = 'active' AND am2.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2b. Recreate check_groups_allied function if it exists
DROP FUNCTION IF EXISTS check_groups_allied(UUID, UUID) CASCADE;
CREATE OR REPLACE FUNCTION check_groups_allied(group_a UUID, group_b UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM alliance_members am1
    JOIN alliance_members am2 ON am1.alliance_id = am2.alliance_id
    WHERE am1.group_id = group_a
    AND am2.group_id = group_b
    AND am1.status = 'active'
    AND am2.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Recreate RLS policies on events table
CREATE POLICY "Everyone can view public events" ON events
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Clan members and public can view events" ON events
  FOR SELECT
  USING (
    is_public = true
    OR EXISTS(
      SELECT 1 FROM group_members 
      WHERE group_id = events.group_id AND user_id = auth.uid()
    )
    OR user_in_clan_or_allied_clan(group_id, auth.uid())
  );

CREATE POLICY "Officers can create events" ON events
  FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM group_members
      WHERE group_id = events.group_id 
      AND user_id = auth.uid()
      AND role IN ('officer', 'admin')
    )
  );

CREATE POLICY "Officers can update events" ON events
  FOR UPDATE
  USING (
    EXISTS(
      SELECT 1 FROM group_members
      WHERE group_id = events.group_id 
      AND user_id = auth.uid()
      AND role IN ('officer', 'admin')
    )
  );

CREATE POLICY "Officers can delete events" ON events
  FOR DELETE
  USING (
    EXISTS(
      SELECT 1 FROM group_members
      WHERE group_id = events.group_id 
      AND user_id = auth.uid()
      AND role IN ('officer', 'admin')
    )
  );

-- 4. Recreate RLS policies on event_rsvps table
CREATE POLICY "Everyone can view RSVPs for public events" ON event_rsvps
  FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM events WHERE events.id = event_rsvps.event_id AND events.is_public = true
    )
  );

CREATE POLICY "Clan members can view RSVPs" ON event_rsvps
  FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM events e
      WHERE e.id = event_rsvps.event_id
      AND (
        EXISTS(SELECT 1 FROM group_members WHERE group_id = e.group_id AND user_id = auth.uid())
        OR user_in_clan_or_allied_clan(e.group_id, auth.uid())
      )
    )
  );

CREATE POLICY "Members can RSVP" ON event_rsvps
  FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM events e
      WHERE e.id = event_rsvps.event_id
      AND (
        EXISTS(SELECT 1 FROM group_members WHERE group_id = e.group_id AND user_id = auth.uid())
        OR user_in_clan_or_allied_clan(e.group_id, auth.uid())
      )
    )
  );

CREATE POLICY "Allied clan members can RSVP to events" ON event_rsvps
  FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM events e
      WHERE e.id = event_rsvps.event_id
      AND user_in_clan_or_allied_clan(e.group_id, auth.uid())
    )
  );

CREATE POLICY "Members can view guest RSVPs" ON guest_event_rsvps
  FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM events e
      WHERE e.id = guest_event_rsvps.event_id
      AND EXISTS(SELECT 1 FROM group_members WHERE group_id = e.group_id AND user_id = auth.uid())
    )
  );

CREATE POLICY "Allied members can view guest RSVPs" ON guest_event_rsvps
  FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM events e
      WHERE e.id = guest_event_rsvps.event_id
      AND user_in_clan_or_allied_clan(e.group_id, auth.uid())
    )
  );

-- 5. Recreate RLS policies on announcements table
CREATE POLICY "Public announcements are visible to all" ON announcements
  FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM group_members 
      WHERE group_id = announcements.group_id AND user_id = auth.uid()
    )
    OR user_in_clan_or_allied_clan(announcements.group_id, auth.uid())
  );

CREATE POLICY "Officers can create announcements" ON announcements
  FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM group_members
      WHERE group_id = announcements.group_id 
      AND user_id = auth.uid()
      AND role IN ('officer', 'admin')
    )
  );

INSERT INTO migration_history (filename) VALUES ('047_update_rls_policies_for_groups.sql');
