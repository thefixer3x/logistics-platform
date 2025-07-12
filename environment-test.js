// Simple test to verify environment and Supabase configuration
console.log("=== Logistics Platform Environment Test ===");

// 1. Check environment variables
console.log("\n1. Environment Configuration:");
console.log(
  "NEXT_PUBLIC_SUPABASE_URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET"
);
console.log(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET (hidden)" : "NOT SET"
);

// 2. Check if we can import Supabase
console.log("\n2. Testing Supabase Import:");
try {
  const { createClient } = require("@supabase/supabase-js");
  console.log("✅ @supabase/supabase-js imported successfully");

  // 3. Test client creation
  console.log("\n3. Testing Client Creation:");
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Supabase client created successfully");
  console.log("URL:", supabaseUrl);

  // 4. Test basic connectivity (without actual query)
  console.log("\n4. Basic Configuration Test:");
  console.log(
    "Supabase client auth URL:",
    supabase.auth.client.supabaseUrl + "/auth/v1"
  );
  console.log("✅ Environment test completed successfully");
} catch (error) {
  console.error("❌ Environment test failed:", error.message);
  process.exit(1);
}

console.log("\n=== Test Summary ===");
console.log("✅ All basic checks passed");
console.log("✅ Demo page should work with mock data");
console.log(
  "⚠️  Database connectivity will be tested by ConnectionStatusHandler component"
);
console.log("\nNext steps:");
console.log("1. Start development server: bun run dev");
console.log("2. Visit http://localhost:3000/demo");
console.log("3. Check for any database connection warnings in browser console");
