-- Run this in Supabase SQL Editor to check the events table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
  AND column_name LIKE '%needed%'
ORDER BY column_name;
