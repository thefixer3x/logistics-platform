const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "http://localhost:54321";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection...");

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("Database error:", error.message);
      return;
    }

    console.log("✅ Database connection successful!");
    console.log("Profiles table found with", data, "records");

    // Test listing tables through schema
    const { data: schemas, error: schemaError } = await supabase
      .rpc("pg_tables_info")
      .select();

    if (schemaError) {
      console.log("Schema query not available, but basic connection works");
    } else {
      console.log("Available schemas:", schemas);
    }
  } catch (err) {
    console.error("Connection test failed:", err.message);
  }
}

testConnection();
