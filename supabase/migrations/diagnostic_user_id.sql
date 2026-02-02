-- Check which tables used in policies have user_id
SELECT 
  t.table_name,
  EXISTS(
    SELECT 1 FROM information_schema.columns c 
    WHERE c.table_schema = 'public' 
    AND c.table_name = t.table_name 
    AND c.column_name = 'user_id'
  ) as has_user_id
FROM information_schema.tables t
WHERE t.table_schema = 'public'
AND t.table_name IN (
  'members', 'member_professions', 'party_roster', 'caravan_escorts',
  'siege_roster', 'resource_requests', 'activity_log', 'event_rsvps',
  'guest_event_rsvps', 'build_comments'
)
ORDER BY t.table_name;
