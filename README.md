# Form Builder - SaaS Application

A complete **Form Maker SaaS** where users can create, share, and manage dynamic forms. Users can sign up, build forms visually, share public links, and collect response data — all within a polished, responsive dashboard.

## 🚀 Features

✅ **User Authentication**
- Email/password authentication with NextAuth.js
- Secure JWT-based sessions
- Protected routes with middleware

✅ **Form Builder**
- Visual drag-and-drop form creation
- 8 field types: Text, Textarea, Radio, Checkbox, Dropdown, Date, File Upload, Rating
- Field customization (labels, placeholders, required fields, options)
- Real-time preview
- 3 design templates: Minimal, Bordered, Modern

✅ **Form Management**
- Create, edit, duplicate, and delete forms
- Share forms via public links
- Copy shareable links to clipboard

✅ **Response Collection**
- Public form submission pages
- Mobile-responsive form rendering
- Form validation

✅ **Analytics & Insights**
- View all form responses
- Interactive charts (Bar & Pie charts)
- Export data to CSV
- Response statistics

✅ **Modern UI/UX**
- Dark/Light mode support
- Smooth animations with Framer Motion
- Responsive design for all devices
- Beautiful UI with shadcn/ui components

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Backend:** Next.js API Routes
- **Database:** MongoDB + Mongoose
- **Authentication:** NextAuth.js
- **Charts:** Recharts
- **Form Handling:** react-hook-form

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd form-builder
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file in the root directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/form-builder
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
\`\`\`

4. Start MongoDB (if running locally):
\`\`\`bash
mongod
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Models

### User
\`\`\`typescript
{
  email: string;
  password: string (hashed);
  createdAt: Date;
}
\`\`\`

### Form
\`\`\`typescript
{
  userId: ObjectId;
  title: string;
  template: 'minimal' | 'bordered' | 'modern';
  fields: Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### Response
\`\`\`typescript
{
  formId: ObjectId;
  answers: Object;
  createdAt: Date;
}
\`\`\`

## 🎯 Usage

### Creating a Form

1. Sign up or sign in to your account
2. Navigate to "New Form" from the dashboard
3. Add fields by clicking on field types
4. Customize each field's properties
5. Choose a template style
6. Save your form

### Sharing a Form

1. Go to "My Forms" in the dashboard
2. Click on a form card
3. Click "Copy Link" to share the form
4. Recipients can fill out the form without signing up

### Viewing Analytics

1. Go to "My Forms"
2. Click "Analytics" on any form
3. View response statistics and charts
4. Export data to CSV for further analysis

## 📱 Pages & Routes

- `/` - Homepage with features and templates
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/dashboard` - Dashboard overview with stats
- `/dashboard/new-form` - Form builder
- `/dashboard/forms` - List of all forms
- `/dashboard/forms/[id]/analytics` - Form analytics and responses
- `/form/[id]` - Public form submission page

## 🔒 Security

- Passwords are hashed using bcrypt
- Protected routes with NextAuth middleware
- Form ownership verification for edit/delete operations
- Environment variables for sensitive data

## 🚀 Deployment

### Vercel + MongoDB Atlas

1. Create a MongoDB Atlas account and cluster
2. Get your MongoDB connection string
3. Deploy to Vercel:
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

\`\`\`env
MONGODB_URI=your-mongodb-atlas-connection-string
NEXTAUTH_SECRET=generate-a-secure-random-string
NEXTAUTH_URL=https://your-domain.com
\`\`\`

## 📝 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js and MongoDB
