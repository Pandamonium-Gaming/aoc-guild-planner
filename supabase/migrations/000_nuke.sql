-- =====================================================
-- 000_nuke.sql - DROP ALL TABLES AND FUNCTIONS
-- ⚠️  WARNING: This will DELETE ALL DATA!
-- Only use for testing/development reset
-- =====================================================

-- Drop policies first
DROP POLICY IF EXISTS "Anyone can view clans" ON clans;
DROP POLICY IF EXISTS "Authenticated users can create clans" ON clans;
DROP POLICY IF EXISTS "Admins can update their clans" ON clans;
DROP POLICY IF EXISTS "Admins can delete their clans" ON clans;

DROP POLICY IF EXISTS "Members can view their clan's members" ON clan_members;
DROP POLICY IF EXISTS "Users can apply to clans" ON clan_members;
DROP POLICY IF EXISTS "Officers+ can update members" ON clan_members;
DROP POLICY IF EXISTS "Admins can remove members" ON clan_members;

DROP POLICY IF EXISTS "Members can view their clan's game characters" ON members;
DROP POLICY IF EXISTS "Officers+ can manage game characters" ON members;

DROP POLICY IF EXISTS "Members can view profession assignments" ON member_professions;
DROP POLICY IF EXISTS "Officers+ can manage profession assignments" ON member_professions;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Clan members can view each other" ON users;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS user_has_clan_role(UUID, UUID, TEXT[]) CASCADE;

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS member_professions CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS clan_members CASCADE;
DROP TABLE IF EXISTS clans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS race CASCADE;
DROP TYPE IF EXISTS archetype CASCADE;

-- Optional: Clear auth.users (commented out for safety)
-- DELETE FROM auth.users;

-- Confirm nuke complete
DO $$ BEGIN
  RAISE NOTICE '🔥 NUKE COMPLETE - All tables, functions, and types dropped';
END $$;
