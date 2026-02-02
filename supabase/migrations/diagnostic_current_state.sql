-- Check exact current state of problem tables
SELECT 
  t.table_name,
  string_agg(c.column_name, ', ' ORDER BY c.column_name) as columns
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
AND t.table_name IN (
  'achievement_notifications', 'alliance_event_participation', 'builds', 
  'dkp_leaderboard', 'inactivity_alerts', 'member_activity_summary', 
  'node_distribution', 'recruitment_applications', 'siege_events'
)
GROUP BY t.table_name
ORDER BY t.table_name;
