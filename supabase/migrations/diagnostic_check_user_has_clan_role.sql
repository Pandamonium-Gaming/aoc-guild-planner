-- Check the definition of user_has_clan_role function
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'user_has_clan_role';