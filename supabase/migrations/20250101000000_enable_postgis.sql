-- Create the extension in the public schema
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

-- Create the logistics schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS logistics;

-- Make sure the extension is available in the logistics schema
ALTER DATABASE postgres SET search_path TO public, logistics;
