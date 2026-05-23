import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const BASE_PATH = "/blue-lagoon-cco";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && {
    output: "export",
    basePath: BASE_PATH,
    assetPrefix: BASE_PATH,
  }),
  images: {
    unoptimized: isStaticExport,
    ...(isStaticExport && {
      loader: "custom",
      loaderFile: "./lib/imageLoader.ts",
    }),
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
  ...(!isStaticExport && {
    async redirects() {
      return [
        { source: "/customer/book", destination: "/customer", permanent: true },
        { source: "/customer/stopover", destination: "/customer", permanent: true },
        { source: "/customer/chat", destination: "/customer", permanent: true },
        { source: "/customer/companion", destination: "/customer", permanent: true },
      ];
    },
  }),
};

export default nextConfig;
