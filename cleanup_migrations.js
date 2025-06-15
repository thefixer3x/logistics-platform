/**
 * Migration Cleanup Script
 * This script helps sync Supabase migration tracking after files have been moved
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkMigrationStatus() {
  console.log('🔍 Checking migration status...\n')
  
  try {
    // Check if supabase_migrations table exists
    const { data: migrationTable, error: tableError } = await supabase.rpc('check_migration_table')
    
    if (tableError) {
      console.log('⚠️  Migration table check failed, trying direct query...')
      
      // Try direct query to migrations table
      const { data: migrations, error: migrationsError } = await supabase
        .from('supabase_migrations')
        .select('*')
        .order('version')
      
      if (migrationsError) {
        console.log('📝 No migration tracking table found. This might be a fresh setup.')
        console.log('Migration error:', migrationsError.message)
        return { migrations: [], needsReset: false }
      } else {
        console.log('✅ Found migration tracking table')
        console.log('📋 Current migrations in database:')
        migrations?.forEach(migration => {
          console.log(`  - ${migration.version}: ${migration.name || 'unnamed'} (${migration.inserted_at})`)
        })
        return { migrations: migrations || [], needsReset: false }
      }
    }
    
  } catch (error) {
    console.log('⚠️  Could not access migration table directly')
    console.log('This usually means either:')
    console.log('1. The database is new and has no migration tracking yet')
    console.log('2. The migration table needs to be created')
    console.log('3. Permissions need to be adjusted')
    return { migrations: [], needsReset: true }
  }
}

async function createMigrationTrackingFunction() {
  console.log('\n🔧 Creating migration tracking utilities...')
  
  const migrationSQL = `
    -- Create function to check if migration table exists
    CREATE OR REPLACE FUNCTION check_migration_table()
    RETURNS boolean AS $$
    BEGIN
      PERFORM 1 FROM information_schema.tables 
      WHERE table_schema = 'supabase_migrations' 
      AND table_name = 'schema_migrations';
      
      RETURN FOUND;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create function to reset migrations if needed
    CREATE OR REPLACE FUNCTION reset_migration_tracking()
    RETURNS text AS $$
    BEGIN
      -- This would typically be handled by Supabase CLI
      -- For now, we'll just return status
      RETURN 'Migration reset requires CLI access';
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Grant permissions
    GRANT EXECUTE ON FUNCTION check_migration_table() TO authenticated, anon;
    GRANT EXECUTE ON FUNCTION reset_migration_tracking() TO authenticated, anon;
  `
  
  try {
    // Note: This might not work if we don't have SQL execution permissions
    const { error } = await supabase.rpc('exec_sql', { query: migrationSQL })
    
    if (error) {
      console.log('⚠️  Could not create migration utilities via RPC')
      console.log('This is normal - migration management usually requires CLI access')
    } else {
      console.log('✅ Created migration tracking utilities')
    }
  } catch (err) {
    console.log('⚠️  Migration utilities creation skipped (requires CLI access)')
  }
}

async function showCleanupInstructions() {
  console.log('\n📋 Migration Cleanup Instructions:')
  console.log('=====================================')
  
  console.log('\n1. RESET MIGRATION TRACKING (if needed):')
  console.log('   If you have Supabase CLI installed:')
  console.log('   ```')
  console.log('   supabase db reset --linked')
  console.log('   ```')
  
  console.log('\n2. MANUAL MIGRATION SYNC:')
  console.log('   If you want to mark current migrations as applied:')
  console.log('   ```sql')
  console.log('   -- Run this in your Supabase SQL editor')
  console.log('   INSERT INTO supabase_migrations.schema_migrations (version, inserted_at)')
  console.log('   VALUES')
  console.log('     (\'20250612000000\', NOW()),')
  console.log('     (\'20250612000001\', NOW())')
  console.log('   ON CONFLICT (version) DO NOTHING;')
  console.log('   ```')
  
  console.log('\n3. FRESH START APPROACH:')
  console.log('   If you prefer to start fresh:')
  console.log('   a. Backup any important data')
  console.log('   b. Drop and recreate tables manually')
  console.log('   c. Run your setup API to recreate basic structure')
  
  console.log('\n4. CLI SETUP (if not installed):')
  console.log('   ```')
  console.log('   npm install -g supabase')
  console.log('   supabase login')
  console.log('   supabase link --project-ref mxtsdgkwzjzlttpotole')
  console.log('   ```')
  
  console.log('\n5. CURRENT MIGRATION FILES:')
  console.log('   - 20250612000000_unified_infrastructure.sql')
  console.log('   - 20250612000001_sample_data.sql')
  
  console.log('\n⚠️  RECOMMENDATION:')
  console.log('   Since you\'re in development, the easiest approach is to:')
  console.log('   1. Use the /test-setup page to create tables directly')
  console.log('   2. Ignore migration tracking for now')
  console.log('   3. Set up proper migration workflow once you\'re ready for production')
}

async function main() {
  console.log('🧹 Supabase Migration Cleanup Tool')
  console.log('===================================\n')
  
  const { migrations, needsReset } = await checkMigrationStatus()
  await createMigrationTrackingFunction()
  await showCleanupInstructions()
  
  console.log('\n✅ Cleanup analysis complete!')
  console.log('\nQuick Actions:')
  console.log('- Visit /test-setup to create tables directly')
  console.log('- Use /demo to see the platform in action')
  console.log('- Check DEVELOPMENT_SUMMARY.md for full status')
}

if (require.main === module) {
  main().catch(console.error)
}
