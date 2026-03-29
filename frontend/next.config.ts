import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix double-lockfile workspace warning
  outputFileTracingRoot: path.join(__dirname, "../../"),

  images: {
    remotePatterns: [
      // Local Strapi (development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Strapi Cloud — API domain
      {
        protocol: "https",
        hostname: "*.strapiapp.com",
        pathname: "/**",
      },
      // Strapi Cloud — media/image CDN
      {
        protocol: "https",
        hostname: "*.media.strapiapp.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
