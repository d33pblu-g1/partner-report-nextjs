# 🚀 Quick Auto-Deploy Setup (5 Minutes)

Follow these steps to enable automatic deployments - every `git push` will deploy to Vercel!

---

## Step 1: Create GitHub Repository (2 minutes)

### **Option A: Using Browser (Easiest)**

1. **Go to:** https://github.com/new

2. **Fill in:**
   - Repository name: `partner-report-nextjs`
   - Description: "Partner Report Dashboard - Next.js + Supabase"
   - Visibility: **Public** (or Private if you prefer)
   - ❌ **DON'T** check "Initialize with README"

3. **Click "Create repository"**

4. **Copy the commands shown** and run them:

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs
git remote add origin https://github.com/YOUR_USERNAME/partner-report-nextjs.git
git branch -M main  
git push -u origin main
```

---

## Step 2: Connect Vercel to GitHub (2 minutes)

1. **Go to:** https://vercel.com/derivgp/partner-reports/settings/git

2. **Click:** "Connect Git Repository"

3. **Select:** GitHub

4. **Choose your repository:** `YOUR_USERNAME/partner-report-nextjs`

5. **Important Settings:**
   - ✅ Framework Preset: **Next.js**
   - ✅ Root Directory: `./`
   - ✅ Build Command: (leave default)
   - ✅ Output Directory: (leave default)

6. **Click:** "Connect"

7. **Done!** ✅

---

## Step 3: That's It!

Now every time you:

```bash
git add .
git commit -m "Your changes"
git push
```

**Vercel automatically:**
- ✅ Pulls your code
- ✅ Runs `npm install`
- ✅ Runs `npm run build`
- ✅ Deploys to production
- ✅ Updates your live site

---

## 🎯 Your New Workflow

### **Before (Manual):**
```bash
# Make changes
git commit -m "changes"
vercel --prod  # Manual deployment
# Wait...
# Check if it worked...
```

### **After (Automatic):**
```bash
# Make changes
git commit -m "changes"
git push  # That's it!
# Vercel auto-deploys in background
```

---

## 💡 Quick Deploy Command

I've created a helper script for you:

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs
./deploy.sh
```

This will:
1. Ask for your commit message
2. Commit all changes
3. Push to GitHub
4. Trigger automatic deployment

---

## 📊 Monitoring Deployments

### **Watch Live Deployments:**
👉 https://vercel.com/derivgp/partner-reports

You'll see:
- ✅ Build progress
- ✅ Deployment status
- ✅ Live logs
- ✅ Deploy time

### **Get Notifications:**
1. Go to: https://vercel.com/derivgp/settings/notifications
2. Enable: "Deployment Status"
3. Get email/Slack notifications on each deploy

---

## 🔧 Troubleshooting

### **Push doesn't trigger deployment:**
1. Check Git connection: https://vercel.com/derivgp/partner-reports/settings/git
2. Ensure repository is connected
3. Check branch is `main` (not `master`)

### **Deployment fails:**
1. Check build logs: https://vercel.com/derivgp/partner-reports
2. Ensure environment variables are set:
   - Go to: https://vercel.com/derivgp/partner-reports/settings/environment-variables
   - Verify `NEXT_PUBLIC_SUPABASE_URL` exists
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` exists

---

## ✅ Verification

Test your setup:

```bash
cd /Users/michalisphytides/Desktop/partner-report-nextjs

# Make a test change
echo "# Auto-deploy test" >> README.md

# Commit and push
git add .
git commit -m "Test: automatic deployment"
git push

# Go to Vercel dashboard - you should see a new deployment starting!
# https://vercel.com/derivgp/partner-reports
```

---

## 🎉 Benefits

✅ **No manual deployments** - just push  
✅ **Faster workflow** - deploy in seconds  
✅ **Team collaboration** - everyone can deploy  
✅ **Deployment history** - see all changes  
✅ **Easy rollback** - revert commits to rollback  
✅ **Preview deployments** - every PR gets a preview URL  

---

## 🚀 Advanced: Preview Deployments

After connecting GitHub, Vercel also gives you:

**Every Pull Request automatically gets a preview URL!**

1. Create a branch: `git checkout -b feature/new-page`
2. Make changes
3. Push: `git push origin feature/new-page`
4. Create PR on GitHub
5. Vercel comments with preview URL!
6. Test before merging

---

**Ready?** Start with Step 1 (Create GitHub repository)!

Once connected, just `git push` and Vercel handles the rest! 🎉

