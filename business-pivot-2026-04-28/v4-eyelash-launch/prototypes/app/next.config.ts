import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 모바일·다른 기기에서 dev server 접근 허용 (HMR·webpack chunks)
  allowedDevOrigins: ["10.50.1.120", "10.50.1.45", "localhost"],
};

export default nextConfig;
