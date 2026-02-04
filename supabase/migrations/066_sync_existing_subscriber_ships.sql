-- Migration to sync subscriber ships for existing characters with subscriber tiers
-- This is a one-time migration to add subscriber ships to characters that already have subscriber_tier set

DO $$
DECLARE
  char_record RECORD;
  ship_id TEXT;
  month_key TEXT;
BEGIN
  -- Get current month in YYYY-MM format
  month_key := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
  
  -- Loop through all Star Citizen characters with subscriber_tier set
  FOR char_record IN 
    SELECT id, subscriber_tier 
    FROM members 
    WHERE game_slug = 'starcitizen' 
    AND subscriber_tier IS NOT NULL
  LOOP
    RAISE NOTICE 'Processing character % with tier %', char_record.id, char_record.subscriber_tier;
    
    -- Insert Imperator ships (Perseus and Hermes) for Imperator subscribers
    IF char_record.subscriber_tier = 'imperator' THEN
      -- Perseus
      INSERT INTO character_ships (character_id, ship_id, ownership_type, notes)
      VALUES (char_record.id, 'perseus', 'subscriber', 'imperator subscriber perk (' || month_key || ')')
      ON CONFLICT (character_id, ship_id, ownership_type) DO NOTHING;
      
      -- Hermes  
      INSERT INTO character_ships (character_id, ship_id, ownership_type, notes)
      VALUES (char_record.id, 'hermes', 'subscriber', 'imperator subscriber perk (' || month_key || ')')
      ON CONFLICT (character_id, ship_id, ownership_type) DO NOTHING;
      
      RAISE NOTICE 'Added Imperator ships (Perseus, Hermes) for character %', char_record.id;
    END IF;
    
    -- Insert Centurion ship (Hermes) for Centurion subscribers
    IF char_record.subscriber_tier = 'centurion' THEN
      -- Hermes
      INSERT INTO character_ships (character_id, ship_id, ownership_type, notes)
      VALUES (char_record.id, 'hermes', 'subscriber', 'centurion subscriber perk (' || month_key || ')')
      ON CONFLICT (character_id, ship_id, ownership_type) DO NOTHING;
      
      RAISE NOTICE 'Added Centurion ship (Hermes) for character %', char_record.id;
    END IF;
    
    -- Update subscriber_ships_month
    UPDATE members 
    SET subscriber_ships_month = month_key 
    WHERE id = char_record.id;
    
  END LOOP;
  
  RAISE NOTICE 'Subscriber ship sync complete';
END $$;
