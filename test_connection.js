/**
 * Simple Database Test Script
 */

const { createClient } = require('@supabase/supabase-js')

// Environment-based configuration (secure)
const supabaseUrl = process.env.SUPABASE_URL || 'https://mxtsdgkwzjzlttpotole.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || (() => {
  console.error('❌ SUPABASE_ANON_KEY not set in environment variables')
  console.error('   Set it with: export SUPABASE_ANON_KEY="your_key_here"')
  process.exit(1)
})()

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
