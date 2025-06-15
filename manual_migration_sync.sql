-- Manual Migration Sync for Supabase
-- Run this in your Supabase SQL Editor to manually mark migrations as applied

-- First, check what's currently in the migrations table
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;

-- If the table doesn't exist or your migrations aren't there, add them:
INSERT INTO supabase_migrations.schema_migrations (version, inserted_at)
VALUES 
  ('20250612000000', NOW()),
  ('20250612000001', NOW())
ON CONFLICT (version) DO NOTHING;

-- Verify they were added
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;

-- This will mark your migration files as "applied" so they won't run again
