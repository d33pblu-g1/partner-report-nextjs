#!/bin/bash

# Quick Deploy Script
# Usage: ./quick-deploy.sh "Your commit message"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /Users/michalisphytides/Desktop/partner-report-nextjs

echo -e "${BLUE}🚀 Quick Deploy - Partner Report Dashboard${NC}"
echo ""

# Get commit message
if [ -z "$1" ]; then
    read -p "Commit message: " message
else
    message="$1"
fi

# Stage all changes
echo -e "${BLUE}📦 Staging changes...${NC}"
git add .

# Commit
echo -e "${BLUE}💾 Committing: $message${NC}"
git commit -m "$message"

# Check if remote exists
if git remote | grep -q 'origin'; then
    echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
    git push
    echo ""
    echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
    echo ""
    echo "🔍 Check deployment status:"
    echo "   → https://vercel.com/derivgp/partner-reports"
else
    echo -e "${YELLOW}⚠️  No remote repository configured yet${NC}"
    echo ""
    echo "To enable automatic deployments:"
    echo "1. Create GitHub repository"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Connect Vercel to GitHub"
    echo ""
    echo "Or manually deploy:"
    echo "   vercel --prod"
fi

