import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    GREEN_API_ID_INSTANCE: process.env.GREEN_API_ID_INSTANCE,
    GREEN_API_TOKEN: process.env.GREEN_API_TOKEN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
