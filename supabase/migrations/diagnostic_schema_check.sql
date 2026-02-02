-- Check which tables have group_id vs clan_id
SELECT 
  table_name,
  column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND (column_name = 'group_id' OR column_name = 'clan_id')
ORDER BY table_name, column_name;
