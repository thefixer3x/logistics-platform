/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['app', 'components', 'lib', 'contexts', 'hooks'], // Only run ESLint on these directories during production builds
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
}

// Temporarily disable Sentry to unblock builds
// TODO: Configure Sentry project properly and re-enable
module.exports = nextConfig

// Sentry configuration (disabled)
// const { withSentryConfig } = require("@sentry/nextjs");
// module.exports = withSentryConfig(
//   nextConfig,
//   {
//     silent: true,
//     org: "seftech-hub",
//     project: "logistics-platform",
//   },
//   {
//     widenClientFileUpload: true,
//     transpileClientSDK: true,
//     tunnelRoute: "/monitoring",
//     hideSourceMaps: true,
//     disableLogger: true,
//     automaticVercelMonitors: true,
//   }
// )
