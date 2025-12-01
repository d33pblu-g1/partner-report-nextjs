#!/bin/bash
# Quick deployment script for Vercel

echo "🚀 Partner Report Dashboard - Vercel Deployment"
echo "================================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Please create .env.local with your API URL:"
    echo "NEXT_PUBLIC_API_URL=https://yourdomain.com/api/index.php"
    echo ""
    read -p "Enter your API URL (or press Enter to skip): " api_url
    if [ ! -z "$api_url" ]; then
        echo "NEXT_PUBLIC_API_URL=$api_url" > .env.local
        echo "✅ Created .env.local"
    fi
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📤 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "✨ Deployment complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Visit the URL provided by Vercel"
    echo "2. Test all features"
    echo "3. Set up custom domain (optional)"
    echo "4. Configure environment variables in Vercel dashboard"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

