-- Find all views that might reference clan_members
SELECT 
  table_schema,
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
AND view_definition ILIKE '%clan_members%'
ORDER BY table_name;
