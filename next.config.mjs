/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"], // Allow Unsplash images
  },
  reactStrictMode: true, // Optional but recommended
  eslint: {
    ignoreDuringBuilds: true, // Prevent ESLint errors from failing production build
  },
};

export default nextConfig;
