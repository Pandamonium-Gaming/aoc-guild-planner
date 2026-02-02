-- Recreate all RLS policies with defensive approach to identify errors
-- Starting with core policies first, then building up

-- ===== GROUPS TABLE =====
CREATE POLICY "Admin can update groups" ON groups
  FOR UPDATE USING (
    user_has_clan_role(id, auth.uid(), ARRAY['admin'::text])
  );

-- ===== MEMBERS TABLE =====
CREATE POLICY "Approved members can add characters" ON members
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Approved members can view members" ON members
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Members can update own characters" ON members
  FOR UPDATE USING (
    (user_id = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text])
  );

CREATE POLICY "Members can delete own characters" ON members
  FOR DELETE USING (
    (user_id = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text])
  );

-- ===== MEMBER_PROFESSIONS TABLE =====
CREATE POLICY "View professions if can view member" ON member_professions
  FOR SELECT USING (
    user_has_clan_role((SELECT group_id FROM members WHERE id = member_id), auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Members can modify own character professions" ON member_professions
  FOR UPDATE USING (
    (SELECT user_id FROM members WHERE id = member_id) = auth.uid()
  );

-- ===== EVENTS TABLE =====
CREATE POLICY "Officers+ can create events" ON events
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers+ can update events" ON events
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers+ can delete events" ON events
  FOR DELETE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== ANNOUNCEMENTS TABLE =====
CREATE POLICY "Clan members can view announcements" ON announcements
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers+ can create announcements" ON announcements
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers+ can update announcements" ON announcements
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers+ can delete announcements" ON announcements
  FOR DELETE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== GROUP_MEMBERS TABLE =====
CREATE POLICY "group_members_update" ON group_members
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text])
  );

CREATE POLICY "group_members_delete" ON group_members
  FOR DELETE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text])
  );

-- ===== PARTIES TABLE =====
CREATE POLICY "Clan members can view parties" ON parties
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage parties" ON parties
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== PARTY_ROSTER TABLE =====
CREATE POLICY "Clan members can view roster" ON party_roster
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage roster" ON party_roster
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== RECRUITMENT_APPLICATIONS TABLE =====
CREATE POLICY "Officers can manage applications" ON recruitment_applications
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers can update applications" ON recruitment_applications
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== NODE_CITIZENSHIPS TABLE =====
CREATE POLICY "Clan members can view citizenships" ON node_citizenships
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage clan citizenships" ON node_citizenships
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== SIEGE_EVENTS TABLE =====
CREATE POLICY "Clan members can view sieges" ON siege_events
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage sieges" ON siege_events
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== SIEGE_ROSTER TABLE =====
CREATE POLICY "Clan members can view siege roster" ON siege_roster
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Members can withdraw or officers manage siege roster" ON siege_roster
  FOR UPDATE USING (
    (user_id = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== LOOT_SYSTEMS TABLE =====
CREATE POLICY "Clan members can view loot systems" ON loot_systems
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage loot systems" ON loot_systems
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== DKP_POINTS TABLE =====
CREATE POLICY "Clan members can view DKP" ON dkp_points
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage DKP" ON dkp_points
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== LOOT_HISTORY TABLE =====
CREATE POLICY "Clan members can view loot history" ON loot_history
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage loot history" ON loot_history
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== DKP_TRANSACTIONS TABLE =====
CREATE POLICY "Clan members can view transactions" ON dkp_transactions
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage transactions" ON dkp_transactions
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== GUILD_BANKS TABLE =====
CREATE POLICY "Clan members can view bank" ON guild_banks
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage bank" ON guild_banks
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== BANK_INVENTORY TABLE =====
CREATE POLICY "Clan members can view inventory" ON bank_inventory
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage inventory" ON bank_inventory
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== BANK_TRANSACTIONS TABLE =====
CREATE POLICY "Clan members can view bank transactions" ON bank_transactions
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Members can create bank transactions" ON bank_transactions
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

-- ===== RESOURCE_REQUESTS TABLE =====
CREATE POLICY "Users can view own requests or officers all" ON resource_requests
  FOR SELECT USING (
    (user_id = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Members can create requests" ON resource_requests
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can review requests" ON resource_requests
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== FREEHOLDS TABLE =====
CREATE POLICY "Clan members can view freeholds" ON freeholds
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Officers can manage all freeholds" ON freeholds
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== FREEHOLD_BUILDINGS TABLE =====
CREATE POLICY "Clan members can view buildings" ON freehold_buildings
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

-- ===== FREEHOLD_SCHEDULES TABLE =====
CREATE POLICY "Clan members can view schedules" ON freehold_schedules
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

-- ===== CARAVAN_EVENTS TABLE =====
CREATE POLICY "Clan members can view caravans" ON caravan_events
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Members can create caravans" ON caravan_events
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Creators and officers can update caravans" ON caravan_events
  FOR UPDATE USING (
    (created_by = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Creators and officers can delete caravans" ON caravan_events
  FOR DELETE USING (
    (created_by = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== CARAVAN_ESCORTS TABLE =====
CREATE POLICY "Clan members can view escorts" ON caravan_escorts
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Members can withdraw from escort" ON caravan_escorts
  FOR UPDATE USING (
    (user_id = auth.uid())
  );

-- ===== CARAVAN_WAYPOINTS TABLE =====
CREATE POLICY "Clan members can view waypoints" ON caravan_waypoints
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "Creators can manage waypoints" ON caravan_waypoints
  FOR INSERT WITH CHECK (
    (SELECT created_by FROM caravan_events WHERE id = caravan_id) = auth.uid()
  );

-- ===== ALLIANCES TABLE =====
CREATE POLICY "Leader can manage alliance" ON alliances
  FOR UPDATE USING (
    user_has_clan_role(leader_group_id, auth.uid(), ARRAY['admin'::text])
  );

-- ===== ALLIANCE_MEMBERS TABLE =====
CREATE POLICY "Leader can manage memberships" ON alliance_members
  FOR INSERT WITH CHECK (
    user_has_clan_role((SELECT leader_group_id FROM alliances WHERE id = alliance_id), auth.uid(), ARRAY['admin'::text])
  );

-- ===== ALLIANCE_EVENT_PARTICIPATION TABLE =====
CREATE POLICY "Clan officers can update participation" ON alliance_event_participation
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== ACTIVITY_LOG TABLE =====
CREATE POLICY "Officers can view activity log" ON activity_log
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Can log own activity" ON activity_log
  FOR INSERT WITH CHECK (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

-- ===== MEMBER_ACTIVITY_SUMMARY TABLE =====
CREATE POLICY "Officers can view activity summary" ON member_activity_summary
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "System manages summaries" ON member_activity_summary
  FOR INSERT WITH CHECK (true);

-- ===== INACTIVITY_ALERTS TABLE =====
CREATE POLICY "Officers can view alerts" ON inactivity_alerts
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers can manage alerts" ON inactivity_alerts
  FOR UPDATE USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== GROUP_ACHIEVEMENTS TABLE =====
CREATE POLICY "Clan members can view achievements" ON group_achievements
  FOR SELECT USING (
    user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

CREATE POLICY "System manages achievements" ON group_achievements
  FOR INSERT WITH CHECK (true);

-- ===== ACHIEVEMENT_NOTIFICATIONS TABLE =====
CREATE POLICY "Officers can view notifications" ON achievement_notifications
  FOR SELECT USING (
    user_has_clan_role((SELECT group_id FROM group_achievements WHERE id = achievement_id), auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

CREATE POLICY "Officers can manage notifications" ON achievement_notifications
  FOR INSERT WITH CHECK (
    user_has_clan_role((SELECT group_id FROM group_achievements WHERE id = achievement_id), auth.uid(), ARRAY['officer'::text, 'admin'::text])
  );

-- ===== BUILDS TABLE =====
CREATE POLICY "View builds based on visibility" ON builds
  FOR SELECT USING (
    (visibility = 'public') OR (created_by = auth.uid()) OR user_has_clan_role(group_id, auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

-- ===== BUILD_COMMENTS TABLE =====
CREATE POLICY "Comments visible with build" ON build_comments
  FOR SELECT USING (
    (SELECT visibility FROM builds WHERE id = build_id) = 'public' OR (SELECT created_by FROM builds WHERE id = build_id) = auth.uid() OR user_has_clan_role((SELECT group_id FROM builds WHERE id = build_id), auth.uid(), ARRAY['admin'::text, 'officer'::text, 'member'::text])
  );

-- ===== GUEST_EVENT_RSVPS TABLE =====
CREATE POLICY "Admins can manage guest RSVPs" ON guest_event_rsvps
  FOR INSERT WITH CHECK (
    user_has_clan_role((SELECT group_id FROM events WHERE id = event_id), auth.uid(), ARRAY['admin'::text])
  );

CREATE POLICY "Admins can delete guest RSVPs" ON guest_event_rsvps
  FOR DELETE USING (
    user_has_clan_role((SELECT group_id FROM events WHERE id = event_id), auth.uid(), ARRAY['admin'::text])
  );

-- ===== EVENT_RSVPS TABLE =====
CREATE POLICY "Users can update own RSVP" ON event_rsvps
  FOR UPDATE USING (
    (user_id = auth.uid())
  );

INSERT INTO migration_history (filename) VALUES ('053_recreate_all_rls_policies.sql');
