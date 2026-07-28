import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "**" }, // fallback for user-provided URLs
    ],
  },
};

export default nextConfig;
