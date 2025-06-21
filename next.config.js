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

// Only enable Sentry in production with valid DSN
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const { withSentryConfig } = require('@sentry/nextjs');
  
  module.exports = withSentryConfig(
    nextConfig,
    {
      silent: true,
      org: 'lan-onasis',
      project: 'logistics-project',
    },
    {
      // Additional config options for the Sentry Webpack plugin
      // See: https://github.com/getsentry/sentry-webpack-plugin#options
      // Suppresses source map uploading logs during build
      silent: true,
      // Hide source maps from generated client bundles
      hideSourceMaps: true,
    }
  );
} else {
  module.exports = nextConfig;
}
