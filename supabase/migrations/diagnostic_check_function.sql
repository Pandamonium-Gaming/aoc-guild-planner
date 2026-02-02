-- Check the definition of user_in_clan_or_allied_clan function
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'user_in_clan_or_allied_clan';