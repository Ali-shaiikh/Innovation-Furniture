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
      allowedOrigins: ["localhost:3000", "innovationfurniture.in"],
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",            value: "DENY" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
