-- =====================================================
-- Character Linking Migration
-- Add support for linking alts to main characters
-- =====================================================

-- Add main_character_id column to members table
ALTER TABLE members 
  ADD COLUMN IF NOT EXISTS main_character_id UUID REFERENCES members(id) ON DELETE SET NULL;

-- Create index for efficient lookups of alts by main character
CREATE INDEX IF NOT EXISTS idx_members_main_character_id ON members(main_character_id) WHERE main_character_id IS NOT NULL;

-- Add constraint to prevent circular references (can't link to self)
ALTER TABLE members 
  ADD CONSTRAINT members_no_self_link CHECK (id != main_character_id);

-- Add constraint to prevent linking a main character to another character
-- (only non-main characters can have a main_character_id)
ALTER TABLE members
  ADD CONSTRAINT members_main_has_no_link CHECK (
    (is_main = FALSE AND main_character_id IS NOT NULL) OR
    (is_main = TRUE AND main_character_id IS NULL) OR
    (is_main = FALSE AND main_character_id IS NULL)
  );

-- Add comment for documentation
COMMENT ON COLUMN members.main_character_id IS 'Reference to the main character this alt belongs to. Only non-main characters should have this set.';

-- Update existing records: ensure main characters don't have a main_character_id
UPDATE members SET main_character_id = NULL WHERE is_main = TRUE;
