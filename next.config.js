const nextConfig = {
  runtime: 'edge',
  swcMinify: false,
  reactStrictMode: true,
  images: {
    domains: ['admin.bookmyparty.co.in', 'i.ibb.co', 'atlas0dev.wpengine.com'],
    unoptimized: false
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },

  async rewrites() {
    return [
      {
        source: '/caterers',
        destination: '/venues'
      },
      {
        source: '/caterers/:slug',
        destination: '/venues/:slug*'
      }
    ];
  }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;