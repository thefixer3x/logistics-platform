// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    swcMinify: true
  },
  async rewrites() {
    return [
      {
        source: '/logistics/:path*',
        destination: 'https://logistics.seftechub.com/:path*'
      }
    ]
  }
}