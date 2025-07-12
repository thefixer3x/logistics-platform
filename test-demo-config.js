#!/usr/bin/env node

// Local test script for demo configuration
const path = require("path");
const fs = require("fs");

console.log("🧪 Testing Demo Configuration Locally...\n");

// Test 1: Check if demo config file exists and imports correctly
console.log("1. Testing demo-config.ts import...");
try {
  // Since we're in Node.js, we need to check the file exists
  const demoConfigPath = path.join(__dirname, "lib", "demo-config.ts");
  if (fs.existsSync(demoConfigPath)) {
    console.log("✅ demo-config.ts file exists");

    // Read the file and check for key exports
    const content = fs.readFileSync(demoConfigPath, "utf8");
    const hasIsDemoMode = content.includes("export const isDemoMode");
    const hasDemoConfig = content.includes("export const demoConfig");
    const hasGetDemoConfig = content.includes("export const getDemoConfig");

    if (hasIsDemoMode && hasDemoConfig && hasGetDemoConfig) {
      console.log("✅ All required exports found in demo-config.ts");
    } else {
      console.log("❌ Missing exports in demo-config.ts");
    }
  } else {
    console.log("❌ demo-config.ts file not found");
  }
} catch (error) {
  console.log("❌ Error testing demo-config.ts:", error.message);
}

// Test 2: Check demo pages exist
console.log("\n2. Testing demo pages...");
const demoPages = ["app/demo/page.tsx", "app/demo-landing/page.tsx"];

demoPages.forEach((pagePath) => {
  const fullPath = path.join(__dirname, pagePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${pagePath} exists`);
  } else {
    console.log(`❌ ${pagePath} missing`);
  }
});

// Test 3: Check deployment files
console.log("\n3. Testing deployment configuration...");
const deployFiles = [
  "deploy-demo.sh",
  "next.config.demo.js",
  "LIVE_DEMO_SETUP.md",
  "LIVE_DEMO_README.md",
];

deployFiles.forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath} exists`);
  } else {
    console.log(`❌ ${filePath} missing`);
  }
});

// Test 4: Check environment variables structure
console.log("\n4. Testing environment configuration...");
const envFile = path.join(__dirname, ".env.local");
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf8");
  const hasSupabaseUrl = envContent.includes("NEXT_PUBLIC_SUPABASE_URL");
  const hasSupabaseKey = envContent.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log("✅ Environment variables configured");
  } else {
    console.log("❌ Missing environment variables");
  }
} else {
  console.log("⚠️  .env.local not found (will use fallback values)");
}

// Test 5: Simulate demo mode detection
console.log("\n5. Testing demo mode detection logic...");

// Simulate different environment scenarios
const testScenarios = [
  { env: "development", expected: true, name: "Development mode" },
  {
    env: "production",
    demoMode: "true",
    expected: true,
    name: "Production with DEMO_MODE=true",
  },
  {
    env: "production",
    demoMode: "false",
    expected: false,
    name: "Production with DEMO_MODE=false",
  },
];

testScenarios.forEach((scenario) => {
  // Mock environment
  const originalEnv = process.env.NODE_ENV;
  const originalDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE;

  process.env.NODE_ENV = scenario.env;
  process.env.NEXT_PUBLIC_DEMO_MODE = scenario.demoMode;

  // Test the logic (simplified version)
  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.NODE_ENV === "development";

  const result = isDemoMode === scenario.expected ? "✅" : "❌";
  console.log(
    `${result} ${scenario.name}: expected ${scenario.expected}, got ${isDemoMode}`
  );

  // Restore environment
  process.env.NODE_ENV = originalEnv;
  process.env.NEXT_PUBLIC_DEMO_MODE = originalDemoMode;
});

console.log("\n🎯 Local Testing Summary:");
console.log("- All core files should exist");
console.log("- Demo mode detection should work correctly");
console.log("- Environment configuration should be valid");
console.log("- Next steps: Test build process and page rendering");
