-- Diagnostic query to check table states
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clans', 'groups', 'clan_members', 'group_members', 'clan_achievements', 'group_achievements')
ORDER BY table_name;
