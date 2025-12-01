# Automatic Deployment Setup

This guide will set up automatic deployments so every change is automatically deployed to Vercel and Supabase.

---

## 🎯 What You'll Get

✅ **Push to Git → Vercel automatically deploys**  
✅ **Database changes → Supabase automatically updates**  
✅ **No manual deployment needed!**

---

## 📋 Prerequisites

- GitHub account (or GitLab/Bitbucket)
- Vercel account (already have)
- Supabase account (already have)

---

## Step 1: Create GitHub Repository (5 minutes)

### **Option A: Using GitHub CLI (Fastest)**

```bash
# Install GitHub CLI if you haven't
brew install gh

# Login
gh auth login

# Create repository
cd /Users/michalisphytides/Desktop/partner-report-nextjs
gh repo create partner-report-nextjs --public --source=. --remote=origin --push
```

### **Option B: Using GitHub Website**

1. Go to: https://github.com/new
2. **Repository name:** `partner-report-nextjs`
3. **Visibility:** Public or Private (your choice)
4. **DON'T** initialize with README (you already have code)
5. Click **"Create repository"**
6. Follow the commands shown:

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs
git remote add origin https://github.com/YOUR_USERNAME/partner-report-nextjs.git
git branch -M main
git push -u origin main
```

---

## Step 2: Connect Vercel to GitHub (2 minutes)

### **Automatic Method:**

1. **Go to Vercel Dashboard:**  
   https://vercel.com/derivgp/partner-reports/settings/git

2. **Click "Connect Git Repository"**

3. **Select GitHub**

4. **Choose your repository:**  
   `YOUR_USERNAME/partner-report-nextjs`

5. **Click "Connect"**

6. **Configure:**
   - Framework Preset: **Next.js** (important!)
   - Root Directory: `./`
   - Build Command: (leave default)
   - Output Directory: (leave default)

7. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://brpwxtnllxoxwwsvkmpi.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_aVpGxvQw_D7Kq-jBrMR4EQ_RFdlJ_H-
     ```

8. **Click "Deploy"**

### **Result:**
✅ Every `git push` will now automatically deploy to Vercel!

---

## Step 3: Set Up Supabase CLI (10 minutes)

### **Install Supabase CLI:**

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

### **Initialize Supabase in Your Project:**

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref brpwxtnllxoxwwsvkmpi

# Initialize migrations
supabase db pull
```

### **Create Migration Folder:**

```bash
# This creates supabase/migrations/ folder
mkdir -p supabase/migrations
```

---

## Step 4: Set Up Automatic Database Migrations

### **Create Migration Script:**

I'll create a script that automatically applies database changes.

### **Create GitHub Actions for Supabase (Optional but Recommended)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy-supabase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Run migrations
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_ID }}
          supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  deploy-vercel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: echo "Vercel auto-deploys via Git integration"
```

---

## Step 5: Daily Workflow (After Setup)

### **Making Code Changes:**

```bash
# 1. Make your changes
# 2. Commit
git add .
git commit -m "Your change description"

# 3. Push (triggers auto-deployment)
git push

# ✅ Vercel automatically deploys!
# ✅ Check: https://vercel.com/derivgp/partner-reports
```

### **Making Database Changes:**

```bash
# 1. Create a new migration
supabase migration new add_new_table

# 2. Edit the migration file in supabase/migrations/
# 3. Apply locally
supabase db push

# 4. Commit and push
git add .
git commit -m "Database: add new table"
git push

# ✅ Migrations auto-apply to Supabase!
```

---

## 🔧 Quick Setup Script

Run this to set up everything automatically:

```bash
#!/bin/bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# 1. Install tools
echo "📦 Installing tools..."
brew install gh supabase/tap/supabase

# 2. Create GitHub repo
echo "🐙 Creating GitHub repository..."
gh auth login
gh repo create partner-report-nextjs --public --source=. --remote=origin --push

# 3. Link Vercel
echo "▲ Linking to Vercel..."
echo "Visit: https://vercel.com/derivgp/partner-reports/settings/git"
echo "Connect to your newly created GitHub repository"

# 4. Initialize Supabase
echo "🗄️ Setting up Supabase..."
supabase login
supabase link --project-ref brpwxtnllxoxwwsvkmpi
supabase init

echo "✅ Setup complete!"
echo "Now: git push will auto-deploy to Vercel"
```

---

## 🎯 Alternative: Simple Git Hooks

If you don't want GitHub Actions, use Git hooks for local automation:

```bash
# Create post-commit hook
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
echo "🚀 Auto-deploying to Vercel..."
vercel --prod --yes

echo "🗄️ Syncing Supabase..."
supabase db push
EOF

chmod +x .git/hooks/post-commit
```

**Now every commit automatically:**
- ✅ Deploys to Vercel
- ✅ Updates Supabase

---

## 📊 Monitoring Auto-Deployments

### **Vercel:**
- Dashboard: https://vercel.com/derivgp/partner-reports
- Get notifications: Settings → Notifications → Enable "Deployment Status"

### **Supabase:**
- Dashboard: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi
- Migrations: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/database/migrations

---

## 🔔 Set Up Notifications

### **Slack Integration (Optional):**

1. **Vercel → Slack:**
   - https://vercel.com/integrations/slack
   - Get notified on deployments

2. **GitHub → Slack:**
   - https://slack.github.com
   - Get notified on pushes

---

## ✅ Verification

### **Test Automatic Deployment:**

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Make a small change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "Test: automatic deployment"
git push

# Check Vercel dashboard - should see new deployment starting!
```

---

## 🆘 Troubleshooting

### **Vercel not auto-deploying:**
1. Check Git integration: https://vercel.com/derivgp/partner-reports/settings/git
2. Ensure repository is connected
3. Check deployment settings

### **Supabase migrations not applying:**
1. Check connection: `supabase link --project-ref brpwxtnllxoxwwsvkmpi`
2. Manually push: `supabase db push`
3. Check migrations: https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/database/migrations

---

## 📚 What Gets Auto-Deployed

| Change Type | Auto-Deploy? | Where? |
|-------------|-------------|---------|
| Code changes | ✅ Yes | Vercel |
| Package updates | ✅ Yes | Vercel |
| Config changes | ✅ Yes | Vercel |
| Database schema | ✅ Yes* | Supabase |
| Environment vars | ❌ Manual | Vercel Dashboard |
| Supabase data | ❌ Manual | Supabase Dashboard |

*With GitHub Actions or Git hooks

---

## 🎉 Benefits

✅ **No manual deployments** - just `git push`  
✅ **Automatic rollback** - revert commits to rollback  
✅ **Deployment history** - see all changes in Vercel  
✅ **Team collaboration** - everyone can deploy  
✅ **CI/CD ready** - add tests, linting, etc.  

---

**Ready to set up?** Start with Step 1 (Create GitHub repository)!

