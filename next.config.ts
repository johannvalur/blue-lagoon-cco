import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.contentstack.io",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/customer/book",
        destination: "/customer",
        permanent: true,
      },
      {
        source: "/customer/stopover",
        destination: "/customer",
        permanent: true,
      },
      {
        source: "/customer/chat",
        destination: "/customer",
        permanent: true,
      },
      {
        source: "/customer/companion",
        destination: "/customer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
