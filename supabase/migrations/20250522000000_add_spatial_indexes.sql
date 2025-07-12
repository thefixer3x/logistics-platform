-- Add spatial indexes after PostGIS is confirmed to be working
-- This migration adds spatial indexes that require PostGIS

-- Ensure PostGIS extension is enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add spatial index for truck locations
CREATE INDEX IF NOT EXISTS idx_truck_locations_geo 
ON logistics.truck_locations 
USING GIST(ST_Point(longitude, latitude));

-- Add other spatial indexes if needed in the future
-- CREATE INDEX IF NOT EXISTS idx_routes_geo ON logistics.routes USING GIST(geometry_column);
