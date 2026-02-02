-- Check columns in tables that reference event_id
SELECT 
  t.table_name,
  string_agg(c.column_name, ', ' ORDER BY c.column_name) as columns
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
AND t.table_name IN (
  'caravan_escorts', 'caravan_waypoints', 'guest_event_rsvps', 'party_roster',
  'bank_inventory', 'freehold_buildings', 'freehold_schedules', 'build_comments',
  'achievement_notifications', 'siege_roster'
)
GROUP BY t.table_name
ORDER BY t.table_name;
