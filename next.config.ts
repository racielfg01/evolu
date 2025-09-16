import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  // serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
images: {
remotePatterns: [{
protocol: "https",
hostname: "ghtsuigzddgkrevokqrr.supabase.co",
port: "",
pathname: "/**"
}
,{
protocol: "https",
hostname: "supabase.com",
port: "",
pathname: "/**"
}]
},
async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ]
      }
    ]
  }
};

export default nextConfig;
