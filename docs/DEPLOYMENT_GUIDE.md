# Deployment Guide - milo.ertugrul.one

This guide will help you deploy Milo's College & Soccer Recruiting Hub to your custom domain `milo.ertugrul.one`.

## Prerequisites

- GitHub account with organization access
- GoDaddy domain: `milo.ertugrul.one`
- Git installed locally
- Node.js installed

## Step 1: Push to GitHub

### A. Create GitHub Repository

1. Go to your GitHub organization
2. Click "New Repository"
3. Name it: `milo-college-recruiting` (or your preferred name)
4. Description: "Milo Ertugrul's College & Soccer Recruiting Hub"
5. Keep it **Public** (required for free GitHub Pages) or **Private** (requires GitHub Pro)
6. Do NOT initialize with README (we already have one)
7. Click "Create repository"

### B. Push Your Code

```bash
cd "/Users/kentertugrul/Desktop/Milo college application interface"

# Add the remote (replace YOUR_ORG with your organization name)
git remote add origin https://github.com/YOUR_ORG/milo-college-recruiting.git

# Push to GitHub
git push -u origin main
```

## Step 2: Configure for Deployment

We'll use **GitHub Pages** (free and easy) or **Vercel/Netlify** (also free, better performance).

### Option A: GitHub Pages (Recommended for Simple Setup)

#### 1. Update Vite Config for GitHub Pages

Your `vite.config.ts` needs the base path:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' for custom domain
})
```

#### 2. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: GitHub Actions
4. Save

#### 4. Configure Custom Domain in GitHub

1. Still in Settings → Pages
2. Custom domain: `milo.ertugrul.one`
3. Click Save
4. Wait for DNS check (may take a few minutes)

### Option B: Vercel (Recommended for Best Performance)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy to Vercel

```bash
cd "/Users/kentertugrul/Desktop/Milo college application interface"
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your organization
- Link to existing project? **N**
- Project name: `milo-college-recruiting`
- Directory: `./`
- Override settings? **N**

#### 3. Add Custom Domain in Vercel

1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add domain: `milo.ertugrul.one`
4. Follow DNS instructions (see below)

## Step 3: Configure DNS in GoDaddy

### For GitHub Pages:

1. Log into GoDaddy
2. Go to My Products → Domain Settings for `ertugrul.one`
3. Click "Manage DNS"
4. Add/Edit these records:

**For `milo.ertugrul.one`:**

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| CNAME | milo | YOUR_ORG.github.io             | 600  |

**Alternative (if using apex domain):**

| Type | Name | Value           | TTL |
|------|------|-----------------|-----|
| A    | milo | 185.199.108.153 | 600 |
| A    | milo | 185.199.109.153 | 600 |
| A    | milo | 185.199.110.153 | 600 |
| A    | milo | 185.199.111.153 | 600 |

### For Vercel:

Vercel will provide specific DNS records. Typically:

| Type  | Name | Value                     | TTL  |
|-------|------|---------------------------|------|
| CNAME | milo | cname.vercel-dns.com      | 600  |

## Step 4: Create CNAME file

For custom domain on GitHub Pages, add this file:

```bash
echo "milo.ertugrul.one" > public/CNAME
git add public/CNAME
git commit -m "Add custom domain CNAME"
git push
```

## Step 5: Enable HTTPS

### GitHub Pages:
- Automatically enabled after DNS propagates
- Check "Enforce HTTPS" in Settings → Pages

### Vercel:
- Automatically handles SSL certificates
- HTTPS enabled by default

## Verification

After DNS propagates (can take 5 minutes to 48 hours):

1. Visit: https://milo.ertugrul.one
2. Verify SSL certificate (padlock icon)
3. Test all features work
4. Check localStorage persists

## Troubleshooting

### DNS Not Propagating
- Check DNS with: `dig milo.ertugrul.one`
- GoDaddy can take up to 48 hours
- Try: `nslookup milo.ertugrul.one`

### GitHub Pages Not Working
- Check Actions tab for deployment errors
- Verify Pages is enabled in Settings
- Ensure repository is public (for free tier)

### Custom Domain Not Working
- Verify CNAME file exists in public/
- Check DNS records are correct
- Wait for DNS propagation
- Clear browser cache

### Blank Page After Deployment
- Check browser console for errors
- Verify `vite.config.ts` has correct base path
- Rebuild and redeploy

## Quick Deploy Commands

### Full Deployment Workflow

```bash
# 1. Make changes
git add .
git commit -m "Your commit message"
git push

# GitHub Pages will auto-deploy via Actions
# OR for Vercel:
vercel --prod
```

## Local Testing Before Deploy

Always test production build locally:

```bash
npm run build
npm run preview
```

Open http://localhost:4173 to test the production build.

## Recommended: Use Vercel

**Why Vercel:**
- ✅ Faster deploys (30 seconds vs 2-3 minutes)
- ✅ Better performance (CDN globally)
- ✅ Automatic HTTPS
- ✅ Preview deployments for branches
- ✅ Easy custom domain setup
- ✅ Better analytics
- ✅ Free tier is generous

**Why GitHub Pages:**
- ✅ Simple setup
- ✅ Integrated with GitHub
- ✅ Free for public repos
- ✅ No extra accounts needed

---

## Next Steps

Please provide:
1. **Your GitHub organization name** (e.g., `milo-ertugrul` or your org name)
2. **Preferred deployment method** (GitHub Pages or Vercel)

Then I'll help you complete the deployment!

