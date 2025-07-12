/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Enable static export for demo mode
  output: process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? "export" : undefined,
  trailingSlash: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  images: {
    unoptimized: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  },

  // Environment variables for build time
  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || "false",
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle demo mode specific configurations
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.NEXT_PUBLIC_DEMO_MODE": JSON.stringify("true"),
        })
      );
    }
    return config;
  },

  // Redirects for demo mode
  async redirects() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return [
        {
          source: "/",
          destination: "/demo",
          permanent: false,
        },
      ];
    }
    return [];
  },

  // Headers for demo mode
  async headers() {
    return [
      {
        source: "/demo/:path*",
        headers: [
          {
            key: "X-Demo-Mode",
            value: "true",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
