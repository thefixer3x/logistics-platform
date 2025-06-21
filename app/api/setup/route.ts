import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const SCHEMA_CHUNKS = [
  // 1. Extensions and schemas
  `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA public;
  CREATE SCHEMA IF NOT EXISTS logistics;
  CREATE SCHEMA IF NOT EXISTS payments;
  CREATE SCHEMA IF NOT EXISTS monitoring;
  CREATE SCHEMA IF NOT EXISTS reporting;
  ALTER DATABASE postgres SET search_path = public, logistics, payments, monitoring, reporting;
  ALTER DATABASE postgres SET row_security = on;
  `,

  // 2. Core tables
  `
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    phone VARCHAR,
    role VARCHAR CHECK (role IN ('driver', 'supervisor', 'contractor', 'admin')) DEFAULT 'driver',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  `,

  // 3. Additional tables would go here
  // ... (rest of schema chunks)
]

export async function GET(request: NextRequest) {
  try {
    // Check existing tables
    const { data: tables, error } = await supabaseAdmin
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')

    if (error) throw error

    return NextResponse.json({ 
      message: 'Database connection successful',
      tables: tables?.map(t => t.tablename) || [],
      status: 'available'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Connection test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'setup') {
      // Execute schema in chunks
      for (const chunk of SCHEMA_CHUNKS) {
        const { error } = await supabaseAdmin.rpc('execute', {
          query: chunk
        })
        if (error) throw error
      }

      return NextResponse.json({ 
        success: true,
        message: 'Database setup completed successfully',
        status: 'ready'
      })
    } else if (action === 'reset') {
      // Drop all tables (careful!)
      const { data, error } = await supabaseAdmin.rpc('execute', {
        query: `
          DROP SCHEMA public CASCADE;
          CREATE SCHEMA public;
          GRANT ALL ON SCHEMA public TO postgres;
          GRANT ALL ON SCHEMA public TO public;
        `
      })

      if (error) throw error

      return NextResponse.json({ 
        success: true,
        message: 'Database reset completed'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
      return NextResponse.json(
      { 
        success: false,
        error: 'Setup failed',
        details: error instanceof Error ? error.message : String(error),
        status: 'error'
      },
      { status: 500 }
    )
  }
}
