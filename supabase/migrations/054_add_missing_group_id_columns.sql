-- Add missing group_id columns to tables that need them
-- Tables that reference groups and need group_id for RLS

-- bank_transactions needs group_id
ALTER TABLE IF EXISTS bank_transactions 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- bank_inventory needs group_id (or can use FK from guild_banks, but for RLS we need direct)
ALTER TABLE IF EXISTS bank_inventory 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- dkp_points needs group_id
ALTER TABLE IF EXISTS dkp_points 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- dkp_transactions needs group_id
ALTER TABLE IF EXISTS dkp_transactions 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- loot_history needs group_id
ALTER TABLE IF EXISTS loot_history 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- event_rsvps needs group_id
ALTER TABLE IF EXISTS event_rsvps 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- guest_event_rsvps needs group_id
ALTER TABLE IF EXISTS guest_event_rsvps 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- build_comments needs group_id
ALTER TABLE IF EXISTS build_comments 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- member_professions needs group_id
ALTER TABLE IF EXISTS member_professions 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- node_citizenships needs group_id
ALTER TABLE IF EXISTS node_citizenships 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- party_roster needs group_id
ALTER TABLE IF EXISTS party_roster 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- caravan_escorts needs group_id
ALTER TABLE IF EXISTS caravan_escorts 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- caravan_waypoints needs group_id
ALTER TABLE IF EXISTS caravan_waypoints 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- freehold_buildings needs group_id
ALTER TABLE IF EXISTS freehold_buildings 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- freehold_schedules needs group_id
ALTER TABLE IF EXISTS freehold_schedules 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- siege_roster needs group_id
ALTER TABLE IF EXISTS siege_roster 
ADD COLUMN group_id uuid REFERENCES groups(id);

-- resource_requests needs group_id
ALTER TABLE IF EXISTS resource_requests 
ADD COLUMN group_id uuid REFERENCES groups(id);

INSERT INTO migration_history (filename) VALUES ('054_add_missing_group_id_columns.sql');
