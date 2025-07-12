import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test connection by listing tables
    const { data, error } = await supabaseAdmin
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')

    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      tables: data?.map(t => t.tablename) || [],
      message: 'Connection test successful'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // First check if tables exist
    const { data: existingTables } = await supabaseAdmin
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')

    const requiredTables = [
      'profiles', 'trucks', 'trips', 'truck_locations',
      'maintenance_requests', 'payments', 'notifications',
      'contracts', 'sla_reports', 'incidents'
    ]

    // Create missing tables (simplified for demo)
    for (const table of requiredTables) {
      if (!existingTables?.some(t => t.tablename === table)) {
        const { error } = await supabaseAdmin.rpc('create_table', {
          table_name: table
        })
        if (error) throw error
      }
    }

    return NextResponse.json({ 
      success: true,
      initializedTables: requiredTables,
      message: 'Database setup completed'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Database setup failed'
      },
      { status: 500 }
    )
  }
}