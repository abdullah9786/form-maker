# Architecture Documentation

## 🏗️ System Architecture

### Overview
The Form Builder is a full-stack Next.js application using the App Router architecture, TypeScript, MongoDB, and modern React patterns.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React)                  │  │
│  │  - Pages & Components                             │  │
│  │  - Client-side State Management                   │  │
│  │  - UI Components (shadcn/ui)                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓ ↑
                      HTTPS Requests
                           ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                  Next.js Server                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            API Routes (Edge Runtime)              │  │
│  │  - Authentication (NextAuth.js)                   │  │
│  │  - Form CRUD Operations                           │  │
│  │  - Response Handling                              │  │
│  │  - Analytics Aggregation                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓ ↑
                    Mongoose ODM
                           ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Database                       │
│  ┌──────────────┬──────────────┬──────────────────┐    │
│  │ Users Coll.  │ Forms Coll.  │ Responses Coll.  │    │
│  └──────────────┴──────────────┴──────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
form-builder/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── signup/          # User registration
│   │   ├── dashboard/           # Dashboard data
│   │   │   └── stats/           # Statistics endpoint
│   │   └── forms/               # Form management
│   │       └── [id]/            # Dynamic form routes
│   │           ├── route.ts     # Form CRUD
│   │           └── responses/   # Response handling
│   │
│   ├── auth/                     # Auth pages
│   │   ├── signin/              # Login page
│   │   └── signup/              # Registration page
│   │
│   ├── dashboard/               # Protected dashboard
│   │   ├── layout.tsx           # Dashboard shell
│   │   ├── page.tsx             # Overview
│   │   ├── new-form/            # Form builder
│   │   └── forms/               # Form management
│   │       ├── page.tsx         # Forms list
│   │       └── [id]/            # Form details
│   │           └── analytics/   # Analytics page
│   │
│   ├── form/                    # Public forms
│   │   └── [id]/                # Form submission
│   │
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── providers.tsx            # Context providers
│   └── globals.css              # Global styles
│
├── components/                  # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── dashboard/               # Dashboard components
│   │   ├── Sidebar.tsx
│   │   └── MobileSidebar.tsx
│   ├── theme-provider.tsx       # Theme context
│   └── theme-toggle.tsx         # Dark mode toggle
│
├── lib/                         # Utilities
│   ├── db.ts                    # MongoDB connection
│   ├── auth.ts                  # NextAuth config
│   └── utils.ts                 # Helper functions
│
├── models/                      # Mongoose models
│   ├── User.ts                  # User schema
│   ├── Form.ts                  # Form schema
│   └── Response.ts              # Response schema
│
├── types/                       # TypeScript types
│   ├── mongoose.d.ts            # Mongoose global types
│   └── next-auth.d.ts           # NextAuth types
│
├── hooks/                       # Custom React hooks
│   └── useAutosave.ts          # Autosave hook
│
├── middleware.ts                # Route protection
└── next.config.js              # Next.js config
```

## 🔄 Data Flow

### Form Creation Flow
```
User clicks "Create Form"
    ↓
Opens Form Builder (/dashboard/new-form)
    ↓
User adds fields & customizes
    ↓
User clicks "Save"
    ↓
POST /api/forms
    ↓
Validates session (NextAuth)
    ↓
Creates Form document in MongoDB
    ↓
Returns form ID
    ↓
Redirects to /dashboard/forms
    ↓
Displays form in user's list
```

### Form Submission Flow
```
User visits public form (/form/[id])
    ↓
GET /api/forms/[id]
    ↓
Fetches form schema from MongoDB
    ↓
Renders form with fields
    ↓
User fills out & submits
    ↓
Client-side validation
    ↓
POST /api/forms/[id]/responses
    ↓
Creates Response document
    ↓
Shows success message
    ↓
Form owner can view in analytics
```

### Analytics Flow
```
User opens analytics page
    ↓
GET /api/forms/[id] (form details)
GET /api/forms/[id]/responses (all responses)
    ↓
Validates ownership (session check)
    ↓
Aggregates data for charts
    ↓
Renders:
  - Response count
  - Data tables
  - Bar/Pie charts
  - Export button
```

## 🔌 API Endpoints

### Authentication
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/signup` | POST | No | Create new user |
| `/api/auth/[...nextauth]` | GET/POST | No | NextAuth handler |

### Forms
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/forms` | GET | Yes | Get user's forms |
| `/api/forms` | POST | Yes | Create new form |
| `/api/forms/[id]` | GET | No | Get form details |
| `/api/forms/[id]` | PUT | Yes | Update form |
| `/api/forms/[id]` | DELETE | Yes | Delete form |

### Responses
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/forms/[id]/responses` | GET | Yes | Get form responses |
| `/api/forms/[id]/responses` | POST | No | Submit response |

### Dashboard
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/dashboard/stats` | GET | Yes | Get user statistics |

## 🗄️ Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  createdAt: Date
}
```

### Forms Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  title: string,
  template: 'minimal' | 'bordered' | 'modern',
  fields: [
    {
      id: string,
      type: FieldType,
      label: string,
      placeholder?: string,
      options?: string[],
      required?: boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Responses Collection
```typescript
{
  _id: ObjectId,
  formId: ObjectId (ref: Form, indexed),
  answers: {
    [fieldId: string]: any
  },
  createdAt: Date
}
```

## 🔐 Authentication Flow

### NextAuth.js Configuration
```typescript
Providers: [CredentialsProvider]
Session Strategy: JWT
Pages: {
  signIn: '/auth/signin',
  error: '/auth/signin'
}
Callbacks: {
  jwt: Add user ID to token
  session: Add user ID to session
}
```

### Protected Routes
Middleware checks authentication for:
- `/dashboard/*` - All dashboard pages

## 🎨 UI Architecture

### Component Hierarchy
```
RootLayout (Theme + Session Provider)
├── Homepage
│   ├── Navigation
│   ├── Hero Section
│   ├── Features Grid
│   └── Footer
│
├── Auth Pages
│   ├── SignIn Form
│   └── SignUp Form
│
└── Dashboard Layout
    ├── Sidebar (Desktop)
    ├── MobileSidebar (Mobile)
    └── Main Content
        ├── Dashboard Overview
        ├── Form Builder
        ├── Forms List
        └── Analytics Page
```

### State Management

**Client State:**
- React useState for local state
- useSession for auth state
- useTheme for theme state

**Server State:**
- API routes return data
- Client fetches with axios
- No Redux/Zustand needed (simple app)

## 🚀 Deployment Architecture

### Vercel Deployment
```
GitHub Repository
    ↓
Automatic Deployment
    ↓
Vercel Edge Network
    ↓
Next.js Serverless Functions
    ↓
MongoDB Atlas (Cloud)
```

### Environment Variables
- `MONGODB_URI` - Database connection
- `NEXTAUTH_SECRET` - Session encryption
- `NEXTAUTH_URL` - App URL

## ⚡ Performance Optimizations

### Next.js Features
- Server-side rendering (SSR)
- Automatic code splitting
- Image optimization
- Font optimization (Geist)

### Database
- Connection pooling (cached)
- Indexed queries (userId, formId)
- Lean queries for analytics

### Frontend
- Lazy loading components
- Optimized bundle size
- Minimal dependencies
- Tree-shaking enabled

## 🔒 Security Measures

### Backend
- Password hashing (bcrypt, 10 rounds)
- JWT session tokens
- Environment variable secrets
- MongoDB injection prevention
- Ownership verification

### Frontend
- No sensitive data in client
- XSS prevention (React escaping)
- CSRF protection (NextAuth)
- Secure cookie settings

## 🧪 Testing Strategy

### Recommended Tests (Future)
- Unit tests (Jest + React Testing Library)
- Integration tests (API routes)
- E2E tests (Playwright/Cypress)
- Load testing (k6)

## 📊 Monitoring & Logging

### Current
- Console logging
- Next.js error boundaries

### Recommended (Future)
- Sentry for error tracking
- Vercel Analytics
- MongoDB Atlas monitoring
- Custom metrics dashboard

## 🔮 Scalability Considerations

### Horizontal Scaling
- Stateless serverless functions
- MongoDB Atlas auto-scaling
- CDN for static assets

### Performance Bottlenecks
- Database queries (add indexes)
- Large form response sets (pagination)
- File uploads (use cloud storage)

### Future Improvements
- Response pagination
- Redis caching layer
- Background job processing
- Webhook queue system

