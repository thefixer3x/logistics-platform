/**
 * Simple Database Test Script
 */

const { createClient } = require('@supabase/supabase-js')

// Direct configuration
const supabaseUrl = 'https://mxtsdgkwzjzlttpotole.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dHNkZ2t3emp6bHR0cG90b2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNzA1NTksImV4cCI6MjA0OTc0NjU1OX0.1-6g8xz5mwLNb2FQH_pHc7D0J9tqW3F0W6oB8KQR_0Y'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔌 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('Connection test result:', error.message)
    } else {
      console.log('✅ Connected to Supabase successfully')
    }
    
    // Try to list tables
    console.log('\n📋 Attempting to list tables...')
    const { data: tables, error: tablesError } = await supabase.rpc('get_table_list')
    
    if (tablesError) {
      console.log('Tables query error:', tablesError.message)
      
      // Try alternative approach
      const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers()
      if (!usersError) {
        console.log('✅ Admin access confirmed - can list users')
      }
    } else {
      console.log('✅ Tables query successful')
      console.log(tables)
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testConnection()
