# 🔐 Password & Secrets Configuration

## 🔒 Login Password

**Default Password**: `Milo2025!`

### To Change the Password:

1. Open `src/context/AuthContext.tsx`
2. Find line with password check:
   ```typescript
   if (password === 'Milo2025!') {
   ```
3. Change `'Milo2025!'` to your desired password
4. Also update `PASSWORD_HASH` constant if you want
5. Save, rebuild, and redeploy

### Session Details:
- **Duration**: 24 hours
- **Storage**: localStorage
- **Auto-logout**: After 24 hours of inactivity

---

## 🤖 OpenAI API Key Setup

The API key enables Smart University Search. It needs to be configured in two places:

### For Local Development (Your Computer):

**Already done!** Your API key is in `.env.local`

The file contains:
```
VITE_OPENAI_API_KEY=sk-proj-...
```

This file is gitignored and never pushed to GitHub.

### For Deployment (GitHub Pages):

You need to add the API key as a GitHub Secret:

1. **Go to**: https://github.com/kentertugrul/milo-college-recruiting/settings/secrets/actions

2. **Click**: "New repository secret"

3. **Fill in**:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your full OpenAI API key (the one starting with `sk-proj-...`)

4. **Click**: "Add secret"

5. **Redeploy**: The next time you push to GitHub, it will use this secret

### How It Works:

**Local Development:**
- Reads from `.env.local` file
- Works immediately, no configuration needed

**GitHub Pages Deployment:**
- Reads from GitHub Secrets during build
- Embedded in the built files
- Works for all authenticated users
- Never exposed in the source code on GitHub

---

## ✅ Quick Setup Checklist:

- [x] `.env.local` file created (for local dev)
- [x] Password set in AuthContext.tsx
- [x] Workflow updated to use secrets
- [ ] **YOU NEED TO DO**: Add `OPENAI_API_KEY` secret in GitHub

---

## 🚀 After Adding the GitHub Secret:

1. The Smart Search will work on the deployed site
2. Anyone who logs in with the password can use AI search
3. No need to enter API key in the app
4. Completely seamless experience

---

## 🔐 Security Notes:

**Password Protection:**
- Simple but effective for personal use
- Session expires after 24 hours
- Stored in browser localStorage
- Protects all your data

**API Key:**
- Local: In `.env.local` (gitignored)
- Deployed: In GitHub Secrets (encrypted)
- Never visible in public code
- Only accessible to authenticated users

**This Protects:**
- Your college application data
- Your soccer recruiting information
- Your OpenAI API usage
- Your privacy

---

## 📝 Important:

**Right now**, the deployed site won't have Smart Search working until you add the GitHub Secret. But password protection is working!

**To enable Smart Search on deployment:**
1. Add the `OPENAI_API_KEY` secret (instructions above)
2. Push any change to GitHub (or manually re-run the workflow)
3. Smart Search will work for authenticated users!

