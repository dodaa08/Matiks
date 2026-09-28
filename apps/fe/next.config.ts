import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental : {
    globalNotFound : true
  },
  allowedDevOrigins: ["*.ngrok-free.dev"],
};

export default nextConfig;
