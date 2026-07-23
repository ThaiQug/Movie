import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.ophim.live",
      },
    ],
  },
};

export default nextConfig;
