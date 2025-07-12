-- Enable PostGIS extension for spatial functionality
-- This must run before any migrations that use spatial functions

-- Enable the PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS is working
SELECT PostGIS_Version();
