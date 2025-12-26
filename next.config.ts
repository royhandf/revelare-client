import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "library.oapen.org",
      },
      {
        protocol: "https",
        hostname: "api.revelare.royhandf.me",
      },
    ],
  },
};

export default nextConfig;
