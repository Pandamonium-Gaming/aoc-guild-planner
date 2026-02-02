-- Check all table columns for tables used in RLS policies
-- Focus on caravan_events, group_achievements, and other key tables

SELECT 
  t.table_name,
  string_agg(c.column_name, ', ' ORDER BY c.column_name) as columns
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
AND t.table_name IN (
  'caravan_events', 'group_achievements', 'guild_banks', 'freeholds',
  'parties', 'events', 'alliances', 'build_comments', 'builds'
)
GROUP BY t.table_name
ORDER BY t.table_name;
