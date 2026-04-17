# Firestore Database Schema

## Collections Overview

This document defines the Firestore database structure for the portfolio application.

---

## 1. Collection: `projects`

**Purpose:** Store portfolio projects

### Document Structure
```javascript
{
  id: string (auto-generated)
  title: string (required)
  description: string (required)
  longDescription?: string (optional)
  technologiesUsed: string[] (e.g., ["React", "Firebase", "Tailwind"])
  liveDemoUrl?: string (optional)
  repositoryUrl?: string (optional)
  imageUrl?: string (optional - Cloudinary URL)
  images?: string[] (optional - gallery)
  displayOrder: number (for sorting)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Example Document
```javascript
{
  title: "Smart Task Manager",
  description: "Real-time task management with Firebase",
  technologiesUsed: ["React", "Firebase", "Tailwind CSS"],
  liveDemoUrl: "https://task-manager.app",
  repositoryUrl: "https://github.com/user/task-manager",
  imageUrl: "https://res.cloudinary.com/.../project1.jpg",
  displayOrder: 1
}
```

### Queries Used
- `query(collection(db, 'projects'), orderBy('displayOrder'), limit(10))`
- `query(collection(db, 'projects'), orderBy('displayOrder'), orderBy('title'))`

---

## 2. Collection: `skills`

**Purpose:** Store skills and technologies

### Document Structure
```javascript
{
  id: string (auto-generated)
  name: string (required - e.g., "React")
  category: string (required - "Frontend", "Backend", "Database", "Tools")
  proficiencyLevel: string (required - "Beginner", "Intermediate", "Advanced")
  displayOrder: number (for sorting)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Example Document
```javascript
{
  name: "React",
  category: "Frontend",
  proficiencyLevel: "Advanced",
  displayOrder: 1
}
```

### Categories
- `Frontend` - UI libraries, CSS frameworks
- `Backend` - Server frameworks, languages
- `Database` - SQL, NoSQL databases
- `Tools` - Development tools, platforms

### Queries Used
- `query(collection(db, 'skills'), orderBy('displayOrder'), orderBy('name'))`
- Filtered by category for display

---

## 3. Collection: `experiences`

**Purpose:** Store work and education history

### Document Structure
```javascript
{
  id: string (auto-generated)
  title: string (required - e.g., "Senior Developer")
  company: string (required - company/institution name)
  institutionOrCompany: string (required - alternative name)
  type: string (required - "work" or "education")
  startDate: Date (required)
  endDate?: Date (optional - null if current)
  description?: string (optional)
  location?: string (optional)
  displayOrder: number (for sorting)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Example Document
```javascript
{
  title: "Senior Full-Stack Developer",
  company: "Tech Company Inc",
  type: "work",
  startDate: "2022-01-15",
  endDate: "2024-04-17",
  description: "Led development of microservices architecture",
  location: "San Francisco, CA",
  displayOrder: 1
}
```

### Queries Used
- `query(collection(db, 'experiences'), orderBy('displayOrder'), orderBy('startDate', 'desc'))`
- Filtered by type ("work" or "education")

---

## 4. Collection: `messages`

**Purpose:** Store contact form submissions

### Document Structure
```javascript
{
  id: string (auto-generated)
  name: string (required)
  email: string (required)
  subject: string (required)
  message: string (required)
  read: boolean (default: false)
  createdAt: Timestamp
}
```

### Example Document
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  subject: "Project Collaboration",
  message: "I'd like to discuss a potential project...",
  read: false,
  createdAt: Timestamp(1713369600)
}
```

### Queries Used
- `query(collection(db, 'messages'), orderBy('createdAt', 'desc'))`

---

## Firestore Security Rules

### Production Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin authentication helper
    function isAdmin() {
      return request.auth.uid == "ADMIN_UID_HERE";
    }

    // Public read for portfolio content
    match /projects/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /skills/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /experiences/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Public write for contact messages
    match /messages/{document=**} {
      allow read: if isAdmin();
      allow create: if true;
      allow delete: if isAdmin();
      allow update: if isAdmin();
    }
  }
}
```

### Replace "ADMIN_UID_HERE" with:
1. Get your Firebase user UID from Firebase Console
2. Create an admin user via Email/Password authentication
3. Find the UID in Authentication section
4. Replace in security rules

---

## Real-Time Listeners (onSnapshot)

### Setup in Admin Pages

```typescript
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';

// In useEffect hook:
useEffect(() => {
  const db = getFirestoreDb();
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, orderBy("displayOrder"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProjects(projects); // Auto re-render
  }, (error) => {
    console.error("Error:", error);
  });

  return () => unsubscribe(); // Cleanup
}, []);
```

---

## CRUD Operations

### Create
```typescript
await addDoc(collection(db, "projects"), {
  title: "My Project",
  description: "...",
  technologiesUsed: ["React"],
  displayOrder: 1
});
```

### Read (One-time)
```typescript
const snapshot = await getDocs(
  query(collection(db, "projects"), orderBy("displayOrder"))
);
const projects = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Update
```typescript
await updateDoc(doc(db, "projects", projectId), {
  title: "Updated Title",
  updatedAt: new Date()
});
```

### Delete
```typescript
await deleteDoc(doc(db, "projects", projectId));
```

---

## Indexes Recommended

For production performance, create composite indexes:

1. **projects**: `displayOrder, title`
2. **skills**: `displayOrder, name`
3. **experiences**: `displayOrder, startDate (desc)`
4. **messages**: `createdAt (desc)`

---

## Data Validation

### Before Storing:
- Validate required fields are present
- Trim whitespace from strings
- Validate URLs format (liveDemoUrl, repositoryUrl)
- Validate email format for contact messages
- Ensure arrays are not empty (technologiesUsed, images)

### Example:
```typescript
const validateProject = (data) => {
  if (!data.title || !data.description) {
    throw new Error("Title and description required");
  }
  if (!/^https?:\/\//.test(data.liveDemoUrl)) {
    throw new Error("Invalid URL format");
  }
  return true;
};
```

---

## Tips & Best Practices

1. **Always use Timestamps** - Use `new Date()` or `Timestamp.now()`
2. **Real-time for Admin** - Use `onSnapshot` for admin panels
3. **One-time for Public** - Use `getDocs` for public pages
4. **Firestore Limits** - Max 1MB per document, 500MB per database operation
5. **Cost Optimization** - Reads are expensive; paginate where possible
6. **Security** - Always implement security rules before production

---

Last Updated: April 17, 2026
