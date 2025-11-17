# 🔍✨ Smart University Search Guide

## What is Smart Search?

Smart Search uses AI (OpenAI) to automatically research universities and populate all their information - including soccer programs! Just enter a university name and let the AI do the work.

## Setup

### Option 1: Environment Variable (For Local Development)

**Already configured for you!** Your API key is in `.env.local`

The app will automatically use it when running locally.

### Option 2: In-App Configuration (For Others Using the Site)

When someone else uses the deployed site, they can:
1. Click "Smart Search"
2. Enter their own OpenAI API key
3. It's saved in their browser localStorage

## How to Use Smart Search

### Step 1: Click "Smart Search"

On the dashboard, click the pink **"✨ Smart Search"** button (with green "AI" badge).

### Step 2: Enter University Name

Type the university name:
- "Harvard"
- "Stanford University"  
- "UCLA"
- "MIT"
- "University of Michigan"

Don't worry about being exact - the AI is smart!

### Step 3: AI Researches

The AI will automatically fetch:

**University Info:**
- ✅ Official name
- ✅ Location (city, state/country)
- ✅ Region (Northeast, West, etc.)
- ✅ School size category
- ✅ Application deadlines
- ✅ Early decision/action deadlines
- ✅ University overview and notable programs

**Soccer Program (if applicable):**
- ⚽ Official team name
- 🏆 Division level (D1, D2, D3, or Club)
- 🎯 Conference name
- 🌐 Team website
- 👥 Roster link
- 👔 Coaching staff link

### Step 4: Review & Edit

The AI results appear in a confirmation dialog:
- All data is shown in an easy-to-read format
- Click "Edit Details" to modify anything
- Soccer program info (if found) is highlighted
- Links are clickable for verification

### Step 5: Confirm & Add

Click **"Confirm & Add to My List"**

Both the university AND soccer program (if found) are added automatically!

## What Gets Created

### University Entry
- Complete profile with all basic info
- Application deadlines set
- Notes/overview populated
- Empty checklists (you add tasks later)
- Ready for essays and interviews

### Soccer Program Entry (if applicable)
- Automatically linked to the university
- Division and conference set
- Team URLs saved
- Ready for adding coaches
- Notes marked as "Auto-populated from research"

## Examples

### Try These:

**D1 Schools:**
- "Stanford University" → D1, Pac-12
- "UCLA" → D1, Big Ten
- "University of North Carolina" → D1, ACC

**D3 Schools:**
- "Williams College" → D3, NESCAC
- "MIT" → D3, NEWMAC

**International:**
- "Oxford University" → Club level

## Tips for Best Results

### Be Specific But Simple:
✅ "Harvard"
✅ "Stanford University"
✅ "UCLA"

❌ "harvard college in boston" (too much detail)
❌ "that school in california" (too vague)

### What If AI Gets Something Wrong?

1. **Click "Edit Details"** before confirming
2. **Correct any errors**
3. **Then confirm and add**

The AI is very accurate but always review!

### What If No Soccer Program Found?

- The AI will set `hasSoccerProgram: false`
- No soccer program will be created
- You can manually add it later if the AI missed it

## Cost & Usage

**OpenAI API Costs:**
- Each search costs approximately **$0.001-0.003** (less than a penny!)
- Using GPT-4O-mini model for efficiency
- 100 searches ≈ $0.10-0.30

**Your API Key:**
- Stored in `.env.local` (local development)
- Never pushed to GitHub
- Never exposed publicly
- Only used when YOU click "Smart Search"

## Troubleshooting

### "OpenAI API key not configured"
- Make sure `.env.local` exists
- Restart the dev server: `npm run dev`
- Or enter the key in-app when prompted

### "Search Failed"  
- Check your internet connection
- Verify API key is valid
- Check OpenAI API dashboard for quota/billing
- Try a different university name

### "No response from OpenAI"
- The API might be slow - try again
- Check OpenAI status: https://status.openai.com/

### Search Results Look Wrong
- Click "Edit Details" to correct
- Some data might be estimates (like deadlines)
- Always verify official deadline dates

## Privacy & Security

### Your API Key:
✅ Stored in `.env.local` (gitignored)
✅ Never committed to GitHub
✅ Never visible in deployed site
✅ Only used on your local machine

### For Deployed Site:
- Users enter their own API key
- Stored in their browser localStorage
- Each user uses their own OpenAI account
- Keys never transmitted to your server

## Advanced: Customize the Search

Edit `src/utils/openai.ts` to modify what information is fetched or how it's formatted.

The prompt can be adjusted to:
- Focus on specific academic programs
- Get more detailed soccer info
- Fetch athletic scholarship data
- Research campus culture details

---

## 🎉 Ready to Use!

Refresh your browser and try searching for a university:

1. Click "✨ Smart Search"
2. Type "Stanford" or "Harvard"
3. Watch the AI research
4. Review the results
5. Add with one click!

**This will save you hours of manual research!** 🚀✨



