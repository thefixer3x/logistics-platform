const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxtsdgkwzjzlttpotole.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read and execute migration files
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const files = await fs.readdir(migrationsDir);
    
    // Sort files by timestamp
    const sortedFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of sortedFiles) {
      console.log(`\nExecuting migration: ${file}`);
      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`Error executing statement in ${file}:`, error.message);
          throw error;
        }
      }
      console.log(`✅ Completed migration: ${file}`);
    }

    // Verify setup
    console.log('\nVerifying database setup...');
    
    // Check schemas
    const { data: schemas, error: schemaError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .not('schema_name', 'in', '(pg_catalog,information_schema)');
    
    if (schemaError) throw schemaError;
    
    console.log('\nCreated schemas:');
    schemas.forEach(schema => console.log(`- ${schema.schema_name}`));

    // Check tables in each schema
    for (const schema of schemas) {
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', schema.schema_name)
        .not('table_name', 'like', 'pg_%');
      
      if (tableError) throw tableError;
      
      if (tables.length > 0) {
        console.log(`\nTables in schema '${schema.schema_name}':`);
        tables.forEach(table => console.log(`- ${table.table_name}`));
      }
    }

    console.log('\n✅ Database setup completed successfully');
  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase(); 