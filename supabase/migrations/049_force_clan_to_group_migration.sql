-- Force complete clan to groups migration
-- This is a direct, non-conditional approach to ensure all renames happen

-- Step 1: Drop all problematic RLS policies first
DROP POLICY IF EXISTS "Everyone can view public events" ON events;
DROP POLICY IF EXISTS "Members can view group events" ON events;
DROP POLICY IF EXISTS "Clan members and public can view events" ON events;
DROP POLICY IF EXISTS "Officers can create events" ON events;
DROP POLICY IF EXISTS "Officers can update events" ON events;
DROP POLICY IF EXISTS "Officers can delete events" ON events;

DROP POLICY IF EXISTS "Everyone can view RSVPs for public events" ON event_rsvps;
DROP POLICY IF EXISTS "Clan members can view RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Members can view group event RSVPs" ON event_rsvps;
DROP POLICY IF EXISTS "Members can RSVP" ON event_rsvps;
DROP POLICY IF EXISTS "Allied clan members can RSVP to events" ON event_rsvps;

DROP POLICY IF EXISTS "Members can view guest RSVPs" ON guest_event_rsvps;
DROP POLICY IF EXISTS "Allied members can view guest RSVPs" ON guest_event_rsvps;

DROP POLICY IF EXISTS "Public announcements are visible to all" ON announcements;
DROP POLICY IF EXISTS "Officers can create announcements" ON announcements;

-- Step 2: Drop the functions that reference old tables
DROP FUNCTION IF EXISTS user_in_clan_or_allied_clan(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS check_groups_allied(UUID, UUID) CASCADE;

-- Step 3: Rename tables
ALTER TABLE IF EXISTS clans RENAME TO groups;
ALTER TABLE IF EXISTS clan_members RENAME TO group_members;
ALTER TABLE IF EXISTS clan_achievements RENAME TO group_achievements;

-- Step 4: Rename columns in groups table (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'guild_icon_url') THEN
    ALTER TABLE groups RENAME COLUMN guild_icon_url TO group_icon_url;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'discord_webhook_url') THEN
    ALTER TABLE groups RENAME COLUMN discord_webhook_url TO group_webhook_url;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'discord_welcome_webhook_url') THEN
    ALTER TABLE groups RENAME COLUMN discord_welcome_webhook_url TO group_welcome_webhook_url;
  END IF;
END $$;

-- Step 5: Rename foreign key columns (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_members' AND column_name = 'clan_id') THEN
    ALTER TABLE group_members RENAME COLUMN clan_id TO group_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'clan_id') THEN
    ALTER TABLE members RENAME COLUMN clan_id TO group_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_achievements' AND column_name = 'clan_id') THEN
    ALTER TABLE group_achievements RENAME COLUMN clan_id TO group_id;
  END IF;
END $$;

-- Step 6: Rename columns in other tables (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'clan_id') THEN
    ALTER TABLE events RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'parties' AND column_name = 'clan_id') THEN
    ALTER TABLE parties RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freeholds' AND column_name = 'clan_id') THEN
    ALTER TABLE freeholds RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guild_banks' AND column_name = 'clan_id') THEN
    ALTER TABLE guild_banks RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'caravan_events' AND column_name = 'clan_id') THEN
    ALTER TABLE caravan_events RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_log' AND column_name = 'clan_id') THEN
    ALTER TABLE activity_log RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'clan_id') THEN
    ALTER TABLE announcements RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alliance_members' AND column_name = 'clan_id') THEN
    ALTER TABLE alliance_members RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alliances' AND column_name = 'leader_clan_id') THEN
    ALTER TABLE alliances RENAME COLUMN leader_clan_id TO leader_group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'loot_systems' AND column_name = 'clan_id') THEN
    ALTER TABLE loot_systems RENAME COLUMN clan_id TO group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guest_event_rsvps' AND column_name = 'allied_clan_id') THEN
    ALTER TABLE guest_event_rsvps RENAME COLUMN allied_clan_id TO allied_group_id;
  END IF;
END $$;

-- Step 7: Rename table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clan_permission_overrides') THEN
    ALTER TABLE clan_permission_overrides RENAME TO group_permission_overrides;
  END IF;
END $$;

-- Step 8: Rename indexes (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clans_game') THEN
    ALTER INDEX idx_clans_game RENAME TO idx_groups_game;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clan_members_user_id') THEN
    ALTER INDEX idx_clan_members_user_id RENAME TO idx_group_members_user_id;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clan_members_clan_id') THEN
    ALTER INDEX idx_clan_members_clan_id RENAME TO idx_group_members_group_id;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clan_achievements_clan') THEN
    ALTER INDEX idx_clan_achievements_clan RENAME TO idx_group_achievements_group;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_members_clan_id') THEN
    ALTER INDEX idx_members_clan_id RENAME TO idx_members_group_id;
  END IF;
END $$;

-- Step 9: Rename constraints (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'groups' AND constraint_name = 'valid_game') THEN
    ALTER TABLE groups RENAME CONSTRAINT valid_game TO groups_valid_game;
  END IF;
END $$;

-- Step 10: Handle foreign key constraint for guest_event_rsvps
ALTER TABLE guest_event_rsvps DROP CONSTRAINT IF EXISTS guest_event_rsvps_allied_clan_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'guest_event_rsvps' AND constraint_name = 'guest_event_rsvps_allied_group_id_fkey') THEN
    ALTER TABLE guest_event_rsvps 
      ADD CONSTRAINT guest_event_rsvps_allied_group_id_fkey 
      FOREIGN KEY (allied_group_id) REFERENCES groups(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 11: Recreate the user_in_clan_or_allied_clan function
CREATE OR REPLACE FUNCTION user_in_clan_or_allied_clan(group_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM group_members
    WHERE group_id = $1 AND user_id = $2
  )
  OR EXISTS(
    SELECT 1 FROM alliances a
    JOIN alliance_members am1 ON a.id = am1.alliance_id AND am1.group_id = $1
    JOIN alliance_members am2 ON a.id = am2.alliance_id AND am2.group_id IN (
      SELECT group_id FROM group_members WHERE user_id = $2
    )
    WHERE am1.status = 'active' AND am2.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Step 12: Recreate the check_groups_allied function
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

-- Step 13: Recreate RLS policies on events table
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

-- Step 14: Recreate RLS policies on event_rsvps table
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

-- Step 15: Recreate RLS policies on guest_event_rsvps
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

-- Step 16: Recreate RLS policies on announcements table
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

INSERT INTO migration_history (filename) VALUES ('049_force_clan_to_group_migration.sql');
