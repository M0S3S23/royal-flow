import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/pilot", destination: "/progress", permanent: true },
      { source: "/invest", destination: "/growth#investment", permanent: false },
    ];
  },
};

export default nextConfig;
