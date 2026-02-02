-- Check RLS policies on the members table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'members'
ORDER BY policyname;