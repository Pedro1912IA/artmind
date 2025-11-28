import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'artmind.us-east-2.elasticbeanstalk.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
