# Quick Start Guide

Get your Form Builder app running in 5 minutes! ⚡

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally OR MongoDB Atlas account

## Setup in 3 Steps

### 1️⃣ Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2️⃣ Configure Environment
Create `.env.local` file:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/form-builder
NEXTAUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000
\`\`\`

Generate secret:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 3️⃣ Start Development Server
\`\`\`bash
npm run dev
\`\`\`

🎉 Open http://localhost:3000

## First Use

1. Click "Get Started"
2. Create account (any email/password)
3. Create your first form
4. Share the form link
5. View responses in analytics

## MongoDB Setup

### Local MongoDB
\`\`\`bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Check if running
mongosh
\`\`\`

### MongoDB Atlas (Cloud - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env.local` with connection string

## Common Issues

**Port 3000 in use?**
\`\`\`bash
lsof -ti:3000 | xargs kill -9
\`\`\`

**MongoDB not connecting?**
- Check MongoDB is running: `mongosh`
- Verify `MONGODB_URI` in `.env.local`
- For Atlas: Check IP whitelist

**Session errors?**
- Ensure `NEXTAUTH_SECRET` is set
- Must be at least 32 characters

## Project Commands

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
\`\`\`

## Next Steps

✅ Explore the form builder  
✅ Try all 8 field types  
✅ Test different templates  
✅ Submit a test form  
✅ View analytics & charts  
✅ Toggle dark/light mode  

## Need Help?

- 📖 Read [README.md](README.md) for full documentation
- 🏗️ See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- 🎨 Check [FEATURES.md](FEATURES.md) for feature list
- ⚙️ Review [SETUP.md](SETUP.md) for detailed setup

## Deploy to Production

### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

Add environment variables in Vercel dashboard.

---

**You're ready to build forms!** 🚀

