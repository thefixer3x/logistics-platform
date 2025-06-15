import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test connection first
    const { data: testData, error: testError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 })
    
    if (testError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Connection failed: ' + testError.message 
      }, { status: 500 })
    }

    // Get basic info about existing tables
    const tableInfo: any = {}
    const tables = ['profiles', 'trucks', 'trips', 'contracts', 'payments', 'notifications', 'maintenance_requests']
    
    for (const tableName of tables) {
      try {
        const { count, error } = await supabaseAdmin
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        tableInfo[tableName] = {
          exists: !error,
          count: error ? 0 : (count || 0),
          error: error?.message
        }
      } catch (err) {
        tableInfo[tableName] = {
          exists: false,
          count: 0,
          error: 'Table not accessible'
        }
      }
    }

    return NextResponse.json({
      success: true,
      connected: true,
      tables: tableInfo,
      userCount: testData?.users?.length || 0
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'setup') {
      // Create profiles table first using direct table creation
      try {
        // Try to insert sample data - this will tell us if the table exists and works
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

        // Try to insert data - if table doesn't exist, this will fail
        const { data: insertedProfiles, error: dataError } = await supabaseAdmin
          .from('profiles')
          .upsert(sampleProfiles, { onConflict: 'email' })
          .select()

        if (dataError) {
          // Table might not exist, return setup instructions
          return NextResponse.json({
            success: false,
            error: 'Profiles table may not exist. Please create it manually first.',
            sqlNeeded: `
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  role VARCHAR CHECK (role IN ('driver', 'supervisor', 'contractor', 'admin')) DEFAULT 'driver',
  company_name VARCHAR,
  avatar_url TEXT,
  status VARCHAR CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.profiles;  
CREATE POLICY "Enable insert for all users" ON public.profiles FOR INSERT WITH CHECK (true);
            `,
            instructions: 'Run the SQL above in your Supabase SQL editor, then try setup again.'
          })
        }

        return NextResponse.json({
          success: true,
          message: 'Database setup completed successfully',
          sampleDataInserted: insertedProfiles?.length || 0,
          note: 'Basic profiles table is working. Additional tables may need manual creation.'
        })

      } catch (error) {
        return NextResponse.json({ 
          success: false, 
          error: 'Setup failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
          hint: 'Try creating the profiles table manually in Supabase SQL editor first.'
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid action' 
      }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
