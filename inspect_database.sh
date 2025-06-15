#!/bin/bash
# Script to inspect current Supabase database structure

echo "🔍 Inspecting current Supabase database structure..."

# Set environment variables
export SUPABASE_URL="https://mxtsdgkwzjzlttpotole.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dHNkZ2t3emp6bHR0cG90b2xlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDE3MDU1OSwiZXhwIjoyMDQ5NzQ2NTU5fQ.H8J3t9GnLQVa8KlZmYc2vF1S9jX7tN0oR4uP6vK2Wz0"

# Install psql if not available
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL client..."
    brew install postgresql
fi

# Connect to database and list tables
echo "📋 Listing existing tables..."
psql "postgresql://postgres.mxtsdgkwzjzlttpotole:${DATABASE_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -c "
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schemaname, tablename;
"

echo "📋 Listing existing schemas..."
psql "postgresql://postgres.mxtsdgkwzjzlttpotole:${DATABASE_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -c "
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast_temp_1')
ORDER BY schema_name;
"
