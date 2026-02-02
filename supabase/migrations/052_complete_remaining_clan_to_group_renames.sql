-- Complete remaining clan_id to group_id renames in tables that were missed
-- This migration finishes the work that migrations 046 and 049 didn't complete

-- achievement_notifications
ALTER TABLE IF EXISTS achievement_notifications
RENAME COLUMN clan_id TO group_id;

-- alliance_event_participation
ALTER TABLE IF EXISTS alliance_event_participation
RENAME COLUMN clan_id TO group_id;

-- builds
ALTER TABLE IF EXISTS builds
RENAME COLUMN clan_id TO group_id;

-- dkp_leaderboard
ALTER TABLE IF EXISTS dkp_leaderboard
RENAME COLUMN clan_id TO group_id;

-- inactivity_alerts
ALTER TABLE IF EXISTS inactivity_alerts
RENAME COLUMN clan_id TO group_id;

-- member_activity_summary
ALTER TABLE IF EXISTS member_activity_summary
RENAME COLUMN clan_id TO group_id;

-- node_distribution
ALTER TABLE IF EXISTS node_distribution
RENAME COLUMN clan_id TO group_id;

-- recruitment_applications
ALTER TABLE IF EXISTS recruitment_applications
RENAME COLUMN clan_id TO group_id;

-- siege_events
ALTER TABLE IF EXISTS siege_events
RENAME COLUMN clan_id TO group_id;

INSERT INTO migration_history (filename) VALUES ('052_complete_remaining_clan_to_group_renames.sql');
