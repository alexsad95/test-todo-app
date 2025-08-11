/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg', 'pg-hstore']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pg', 'pg-hstore');
    }
    return config;
  }
};

export default nextConfig;
