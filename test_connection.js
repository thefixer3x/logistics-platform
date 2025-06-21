/**
 * Simple Database Test Script
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = 'https://mxtsdgkwzjzlttpotole.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dHNkZ2t3emp6bHR0cG90b2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDUyNTksImV4cCI6MjA2MjY4MTI1OX0.2KM8JxBEsqQidSvjhuLs8HCX-7g-q6YNswedQ5ZYq3g'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...')
    
    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.log('✅ Connection successful, but tables not yet created')
      } else {
        throw error
      }
    } else {
      console.log('✅ Connection successful and tables exist')
    }

    // Try to create the logistics schema if it doesn't exist
    const { error: schemaError } = await supabase.rpc('create_schema_if_not_exists', {
      schema_name: 'logistics'
    })

    if (schemaError) {
      console.log('⚠️ Could not create schema (this is normal if you don\'t have admin rights)')
    } else {
      console.log('✅ Logistics schema created or already exists')
    }

    // List available tables in public schema
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(0)
    
    if (!tablesError) {
      console.log('\nAvailable tables in public schema:')
      console.log('- profiles')
    }

    console.log('\n✅ Database connection test completed successfully')
  } catch (error) {
    console.error('\n❌ Error testing connection:', error.message)
    process.exit(1)
  }
}

testConnection()
