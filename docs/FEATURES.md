# Feature Documentation

Complete descriptions of all extracted features.

---

## 1. ADMIN DASHBOARD

### Overview
Protected admin panel for managing portfolio content.

### Components
- **Dashboard** (`/admin/page.tsx`)
  - Stats cards (projects, skills, experiences count)
  - Quick action buttons
  - Firebase status indicator
  
- **Sidebar Layout** (`/admin/layout.tsx`)
  - Navigation to all management pages
  - User profile section with logout
  - Responsive mobile menu
  - Protected by AuthGuard component

### Features
- Real-time stats from Firestore
- Quick navigation
- Responsive design (mobile & desktop)
- User profile display
- Logout functionality

### Access
- URL: `/admin`
- Requires: Firebase authentication
- Redirects: Unauthenticated users to `/admin/login`

---

## 2. FIREBASE INTEGRATION

### Configuration
Located in `backend/config/firebase.ts`

### Features
- **Singleton Pattern**: Ensures only one Firebase instance
- **SDK Initialization**: Auto-initializes on app load
- **Firestore**: Database access
- **Authentication**: Email/password auth
- **Data Connect**: GraphQL interface (optional)

### Setup
```typescript
import { getFirestoreDb, getFirebaseAuth } from '@/lib/firebase';

const db = getFirestoreDb();      // Firestore access
const auth = getFirebaseAuth();   // Auth access
```

### Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

---

## 3. AUTHENTICATION SYSTEM

### Components
- **Login Page** (`/admin/login/page.tsx`)
  - Email/password form
  - Error handling
  - Loading state
  - Auto-redirect if logged in

- **Auth Context** (`/frontend/auth/auth-context.tsx`)
  - Global auth state
  - Login/logout functions
  - User information
  - Loading state

- **AuthGuard** (`/frontend/components/AuthGuard.tsx`)
  - Protected route wrapper
  - Redirects unauthorized users
  - Loading state while checking auth

### Flow
1. User enters email/password on login page
2. Firebase `signInWithEmailAndPassword()` called
3. Auth state updated in Context
4. User redirected to `/admin`
5. AuthGuard validates user on protected pages

### Security Notes
- Passwords hashed by Firebase
- Sessions managed by Firebase SDK
- Token auto-refresh handled
- Logout clears auth state

---

## 4. API ROUTES (BACKEND)

### Chat API (`/api/chat`)
- Accepts: Chat message history
- Returns: AI response with portfolio context
- Model: GPT-4o-mini
- Real-time: Fetches fresh portfolio data

### Generate Project API (`/api/generate-project`)
- Accepts: .md or .txt documentation
- Returns: Extracted project metadata
- Size Limit: 50KB
- Format: JSON

### Upload API (`/api/upload`)
- POST: Upload image to Cloudinary
- DELETE: Delete image by public_id
- Returns: Secure URL + metadata
- Auto-optimization: Quality & format

---

## 5. AI FEATURES

### Chat Widget (`/frontend/components/ChatWidget.tsx`)
- **Floating Button**: Bottom-right chat toggle
- **Message History**: Maintains conversation
- **Real-time Updates**: Firestore portfolio context
- **Auto-scroll**: To latest message
- **Markdown Support**: Links and bold text formatting

### Features
- Open/close toggle
- Auto-scroll to new messages
- Loading indicator
- Error handling
- Responsive design

### System Prompt
Built dynamically from portfolio data:
- All projects
- All skills by category
- All experiences
- Professional tone
- Max 150 words per response

### Usage
```typescript
import ChatWidget from '@/components/ChatWidget';

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <ChatWidget /> {/* Floating chat */}
    </div>
  );
}
```

---

## 6. CLOUDINARY SYSTEM

### Configuration (`/backend/config/cloudinary.ts`)
- Cloud name
- API key
- API secret

### Upload Features
- Auto quality optimization (auto)
- Auto format conversion (auto)
- Folder organization
- HTTPS secure URLs
- Width/height metadata

### Delete Features
- Public ID based deletion
- Cascade cleanup
- Error handling

### Use Cases
- Project images
- Profile photos
- Project screenshots
- Portfolio media

---

## 7. DATABASE LOGIC

### Collections
- **projects** - Portfolio projects
- **skills** - Technical skills
- **experiences** - Work & education
- **messages** - Contact form submissions

### Real-Time Features
- `onSnapshot()` listeners in admin pages
- Auto-sync across tabs
- Live updates when editing
- Real-time counts

### Queries
- **Projects**: Ordered by displayOrder
- **Skills**: Grouped by category
- **Experiences**: Ordered by start date
- **Messages**: Ordered by creation date

---

## 8. CONTACT FORM BACKEND

### Message Storage
- Collection: `messages`
- Fields: name, email, subject, message, createdAt, read
- Auto-generated: ID, timestamp

### Features
- Public form submission
- Firebase storage
- Read/unread status
- Timestamp tracking
- Admin inbox view

### Workflow
1. User fills form on `/contact`
2. Submitted to Firestore
3. Appears in `/admin/messages`
4. Admin can mark read/delete

---

## 9. REAL-TIME DATA LOGIC

### Implementation
Uses Firestore `onSnapshot()` for live updates:

```typescript
const unsubscribe = onSnapshot(query, (snapshot) => {
  // Auto-called when data changes
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setState(data);
}, (error) => {
  console.error("Error:", error);
});

// Cleanup on unmount
return () => unsubscribe();
```

### Used In
- `/admin/projects` - Live project updates
- `/admin/skills` - Live skill updates
- `/admin/experience` - Live experience updates
- `/admin/messages` - Live message updates

### Benefits
- No manual refresh needed
- Multi-user sync
- Instant UI updates
- Efficient bandwidth usage

---

## Admin Pages Details

### Projects Page
- List all projects with images
- Add/edit/delete projects
- AI-assisted generation from docs
- Image upload to Cloudinary
- Display order management
- Tech stack display

### Skills Page
- List skills by category
- Filter by category
- Add/edit/delete skills
- Proficiency levels with colors
- Display order management

### Experience Page
- List work & education
- Filter by type
- Add/edit/delete entries
- Date pickers for start/end
- Description support

### Messages Page
- Inbox of contact submissions
- Mark read/unread
- View message details
- Delete messages

---

Last Updated: April 17, 2026
