import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Standard Cloudinary CDN
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Cloudinary-managed subdomains (e.g. bairesdev.mo.cloudinary.net)
      {
        protocol: "https",
        hostname: "**.cloudinary.net",
        pathname: "/**",
      },
      // Any other cloudinary-managed domain
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;


npm run format
git add .
git commit -m "feat: add admin dashboard with charts, user management, coupons, and audit logs &
fix: allow cloudinary-managed subdomains in next/image remotePatterns"
git push