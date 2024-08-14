const nextConfig = {
  output: 'export',
  runtime: '',
  swcMinify: false,
  reactStrictMode: false,
  images: {
    domains: ['admin.bookmyparty.co.in', 'i.ibb.co', 'atlas0dev.wpengine.com'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;