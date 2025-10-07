# Setup Guide

This guide will help you set up the Form Builder application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Step-by-Step Setup

### 1. Install MongoDB (if running locally)

**macOS (using Homebrew):**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
\`\`\`

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

**Linux:**
Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

### 2. Clone and Install Dependencies

\`\`\`bash
# Navigate to the project directory
cd form-builder

# Install dependencies
npm install
\`\`\`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# MongoDB Connection (Local)
MONGODB_URI=mongodb://localhost:27017/form-builder

# OR MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/form-builder?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**Generate a secure NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## MongoDB Atlas Setup (Cloud Database)

If you prefer using MongoDB Atlas instead of a local installation:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string from the "Connect" button
6. Replace `<password>` with your database user password
7. Use this connection string in your `.env.local` file

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseError: The 'uri' parameter to 'openUri()' must be a string`

**Solution:** Ensure your `MONGODB_URI` is properly set in `.env.local`

### NextAuth Configuration Error

**Error:** `[next-auth][error][NO_SECRET]`

**Solution:** Add a valid `NEXTAUTH_SECRET` to your `.env.local` file

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:** 
\`\`\`bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
\`\`\`

## Building for Production

\`\`\`bash
# Build the application
npm run build

# Start the production server
npm start
\`\`\`

## Project Structure

\`\`\`
form-builder/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── form/              # Public form pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                   # Utility functions
├── models/               # MongoDB models
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── public/               # Static assets
\`\`\`

## Default User Creation

There is no default user created. To use the application:

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Sign Up"
3. Create a new account with your email and password
4. You'll be automatically signed in and redirected to the dashboard

## Testing the Application

### Test Flow:

1. **Sign Up** - Create a new account
2. **Create a Form** - Click "New Form" and add fields
3. **Share Form** - Copy the form link from "My Forms"
4. **Submit Response** - Open the form link in an incognito window and submit
5. **View Analytics** - Check the analytics page to see responses and charts

## Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Check the terminal logs for server-side errors
3. Ensure MongoDB is running
4. Verify environment variables are set correctly
5. Clear `.next` folder and rebuild: `rm -rf .next && npm run dev`

## Next Steps

Once your development environment is set up:

1. Explore the form builder interface
2. Create different types of forms
3. Test the analytics and export features
4. Customize the UI and templates
5. Deploy to Vercel (see README.md for deployment instructions)

Happy building! 🚀

