#!/bin/bash

# Automatic Deployment Setup Script
# This script sets up automatic deployments to Vercel and Supabase

set -e

echo "🚀 Partner Report - Automatic Deployment Setup"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project directory
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Step 1: Check if git is initialized
echo -e "${BLUE}📋 Step 1: Checking Git setup...${NC}"
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi
echo -e "${GREEN}✅ Git initialized${NC}"
echo ""

# Step 2: Check for remote
echo -e "${BLUE}📋 Step 2: Checking for remote repository...${NC}"
if ! git remote | grep -q 'origin'; then
    echo -e "${YELLOW}⚠️  No remote repository found.${NC}"
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to: https://github.com/new"
    echo "2. Name it: partner-report-nextjs"
    echo "3. Don't initialize with README"
    echo "4. Copy the repository URL"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ Remote added${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping remote setup${NC}"
    fi
else
    echo -e "${GREEN}✅ Remote repository already configured${NC}"
fi
echo ""

# Step 3: Install Supabase CLI (if not installed)
echo -e "${BLUE}📋 Step 3: Checking Supabase CLI...${NC}"
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    if command -v brew &> /dev/null; then
        brew install supabase/tap/supabase
    else
        npm install -g supabase
    fi
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
else
    echo -e "${GREEN}✅ Supabase CLI already installed${NC}"
fi
echo ""

# Step 4: Initialize Supabase migrations
echo -e "${BLUE}📋 Step 4: Setting up Supabase migrations...${NC}"
if [ ! -d supabase ]; then
    mkdir -p supabase/migrations
    echo -e "${GREEN}✅ Migrations folder created${NC}"
else
    echo -e "${GREEN}✅ Supabase folder already exists${NC}"
fi
echo ""

# Step 5: Create Git hooks for auto-deploy
echo -e "${BLUE}📋 Step 5: Setting up Git hooks...${NC}"

# Create post-push hook (safer than post-commit)
cat > .git/hooks/post-push << 'HOOK_EOF'
#!/bin/bash
echo "🚀 Triggering automatic deployment..."
echo "Vercel will auto-deploy via Git integration"
echo "Check: https://vercel.com/derivgp/partner-reports"
HOOK_EOF

chmod +x .git/hooks/post-push
echo -e "${GREEN}✅ Git hooks configured${NC}"
echo ""

# Step 6: Create GitHub Actions workflow
echo -e "${BLUE}📋 Step 6: Creating GitHub Actions workflow...${NC}"
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'WORKFLOW_EOF'
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy to Vercel & Supabase
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Notify deployment start
        run: |
          echo "🚀 Starting deployment..."
          echo "Vercel will auto-deploy this push"
          echo "Check: https://vercel.com/derivgp/partner-reports"
WORKFLOW_EOF

echo -e "${GREEN}✅ GitHub Actions workflow created${NC}"
echo ""

# Step 7: Create deployment commands file
echo -e "${BLUE}📋 Step 7: Creating quick deploy commands...${NC}"

cat > deploy.sh << 'DEPLOY_EOF'
#!/bin/bash
# Quick deployment script

echo "🚀 Deploying Partner Report Dashboard..."

# Commit changes
git add .
read -p "Commit message: " message
git commit -m "$message"

# Push to trigger auto-deploy
echo "📤 Pushing to GitHub (triggers auto-deploy)..."
git push

echo "✅ Pushed! Check deployment:"
echo "   Vercel: https://vercel.com/derivgp/partner-reports"
echo "   Supabase: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi"
DEPLOY_EOF

chmod +x deploy.sh
echo -e "${GREEN}✅ Deployment script created${NC}"
echo ""

# Step 8: Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Automatic Deployment Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. If you haven't already, push to GitHub:"
echo "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "2. Connect Vercel to GitHub:"
echo "   → Visit: https://vercel.com/derivgp/partner-reports/settings/git"
echo "   → Click 'Connect Git Repository'"
echo "   → Select your GitHub repo"
echo "   → Add environment variables"
echo ""
echo "3. After connecting, every 'git push' will auto-deploy!"
echo ""
echo "💡 Quick Deploy Command:"
echo "   ${BLUE}./deploy.sh${NC} (commits and pushes in one command)"
echo ""
echo "📊 Monitor Deployments:"
echo "   Vercel: https://vercel.com/derivgp/partner-reports"
echo "   Supabase: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi"
echo ""

