/**
 * Database Organization Script
 * This script will inspect the current database structure and organize it according to our unified schema
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectDatabase() {
  console.log('🔍 Inspecting current database structure...\n')
  
  try {
    // Check existing tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_schema, table_name, table_type')
      .not('table_schema', 'in', '(information_schema,pg_catalog,pg_toast)');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
      return
    }
    
    console.log('📋 Existing Tables:')
    tables?.forEach(table => {
      console.log(`  ${table.table_schema}.${table.table_name} (${table.table_type})`)
    })
    
    // Check existing schemas
    const { data: schemas, error: schemasError } = await supabase.rpc('get_schemas')
    
    if (!schemasError && schemas) {
      console.log('\n📂 Existing Schemas:')
      schemas.forEach(schema => console.log(`  ${schema}`))
    }
    
  } catch (error) {
    console.error('❌ Error inspecting database:', error.message)
  }
}

async function organizeDatabase() {
  console.log('\n🔧 Organizing database structure...\n')
  
  try {
    // Create schemas if they don't exist
    const schemas = ['logistics', 'payments', 'monitoring', 'reporting']
    
    for (const schema of schemas) {
      const { error } = await supabase.rpc('create_schema_if_not_exists', { schema_name: schema })
      if (error) {
        console.log(`⚠️  Schema ${schema} may already exist or error occurred:`, error.message)
      } else {
        console.log(`✅ Created schema: ${schema}`)
      }
    }
    
    // Check for existing core tables in public schema
    const coreTables = ['profiles', 'trucks', 'trips', 'contracts', 'payments', 'notifications']
    
    for (const table of coreTables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (!error) {
        console.log(`✅ Table '${table}' exists and is accessible`)
      } else {
        console.log(`⚠️  Table '${table}' may not exist or is inaccessible: ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error organizing database:', error.message)
  }
}

async function insertSampleData() {
  console.log('\n📝 Inserting sample data (if tables are empty)...\n')
  
  try {
    // Check if profiles table has data
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (profilesError) {
      console.log('⚠️  Profiles table may not exist, skipping sample data insertion')
      return
    }
    
    if (existingProfiles && existingProfiles.length > 0) {
      console.log('ℹ️  Database already contains data, skipping sample data insertion')
      return
    }
    
    // Insert sample profiles
    const sampleProfiles = [
      {
        email: 'admin@seftech.com',
        first_name: 'System',
        last_name: 'Administrator',
        role: 'admin',
        status: 'active'
      },
      {
        email: 'contractor1@seftech.com',
        first_name: 'Adebayo',
        last_name: 'Okafor',
        phone: '+234-801-234-5678',
        role: 'contractor',
        company_name: 'Lagos Logistics Ltd',
        status: 'active'
      },
      {
        email: 'driver1@seftech.com',
        first_name: 'Musa',
        last_name: 'Abdullahi',
        phone: '+234-811-111-1111',
        role: 'driver',
        status: 'active'
      },
      {
        email: 'supervisor1@seftech.com',
        first_name: 'Folake',
        last_name: 'Adeyemi',
        phone: '+234-805-567-8901',
        role: 'supervisor',
        status: 'active'
      }
    ]
    
    const { data: insertedProfiles, error: insertError } = await supabase
      .from('profiles')
      .insert(sampleProfiles)
      .select()
    
    if (insertError) {
      console.error('❌ Error inserting sample profiles:', insertError.message)
    } else {
      console.log(`✅ Inserted ${insertedProfiles?.length || 0} sample profiles`)
    }
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message)
  }
}

async function main() {
  console.log('🚀 Starting database organization process...\n')
  
  await inspectDatabase()
  await organizeDatabase()
  await insertSampleData()
  
  console.log('\n✅ Database organization complete!')
  console.log('\nNext steps:')
  console.log('1. Review the database structure in Supabase dashboard')
  console.log('2. Start the development server: npm run dev')
  console.log('3. Test the application functionality')
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { inspectDatabase, organizeDatabase, insertSampleData }
