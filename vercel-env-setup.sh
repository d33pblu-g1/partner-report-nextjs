#!/bin/bash
# Script to add Supabase environment variables to Vercel

echo "🔧 Adding Supabase environment variables to Vercel..."

# Add NEXT_PUBLIC_SUPABASE_URL
echo "https://brpwxtnllxoxwwsvkmpi.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Add NEXT_PUBLIC_SUPABASE_ANON_KEY
echo "sb_publishable_aVpGxvQw_D7Kq-jBrMR4EQ_RFdlJ_H-" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "✅ Environment variables added!"
echo "🚀 Deploying to production..."

vercel --prod --yes

