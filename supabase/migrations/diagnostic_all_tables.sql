-- Check which tables used in migration 053 exist and have group_id
SELECT 
  t.table_name,
  EXISTS(
    SELECT 1 FROM information_schema.columns c 
    WHERE c.table_schema = 'public' 
    AND c.table_name = t.table_name 
    AND c.column_name = 'group_id'
  ) as has_group_id
FROM information_schema.tables t
WHERE t.table_schema = 'public'
AND t.table_name IN (
  'groups', 'members', 'member_professions', 'events', 'announcements',
  'group_members', 'parties', 'party_roster', 'recruitment_applications',
  'node_citizenships', 'siege_events', 'siege_roster', 'loot_systems',
  'dkp_points', 'loot_history', 'dkp_transactions', 'guild_banks',
  'bank_inventory', 'bank_transactions', 'resource_requests', 'freeholds',
  'freehold_buildings', 'freehold_schedules', 'caravan_events', 'caravan_escorts',
  'caravan_waypoints', 'alliances', 'alliance_members', 'alliance_event_participation',
  'activity_log', 'member_activity_summary', 'inactivity_alerts', 'group_achievements',
  'achievement_notifications', 'builds', 'build_comments', 'guest_event_rsvps', 'event_rsvps'
)
ORDER BY t.table_name;
