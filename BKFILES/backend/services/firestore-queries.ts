# Firestore Common Queries & Operations

This file contains reusable Firestore query patterns used throughout the application.

## Real-Time Listeners

### Listen to Projects (with updates)
```typescript
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';

const db = getFirestoreDb();
const projectsRef = collection(db, "projects");
const q = query(projectsRef, orderBy("displayOrder"), orderBy("title"));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const projects = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setProjects(projects);
}, (error) => {
  console.error("Error:", error);
});

return () => unsubscribe(); // Cleanup
```

### Listen to Skills (filtered by category)
```typescript
const skillsRef = collection(db, "skills");
const q = query(skillsRef, orderBy("displayOrder"), orderBy("name"));

onSnapshot(q, (snapshot) => {
  const allSkills = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Filter by category in code
  const filteredSkills = allSkills.filter(s => s.category === selectedCategory);
  setSkills(filteredSkills);
});
```

### Listen to Messages (ordered by date)
```typescript
const messagesRef = collection(db, "messages");
const q = query(messagesRef, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  const messages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  }));
  setMessages(messages);
});
```

## One-Time Reads (for public pages)

### Get All Projects
```typescript
const projectsRef = collection(db, "projects");
const q = query(projectsRef, orderBy("displayOrder"), limit(10));
const snapshot = await getDocs(q);

const projects = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get Portfolio Context (for AI chat)
```typescript
async function getPortfolioContext() {
  const db = getFirestoreDb();

  // Get projects
  const projectsSnap = await getDocs(
    query(collection(db, 'projects'), orderBy('displayOrder'), limit(10))
  );
  const projects = projectsSnap.docs.map(doc => doc.data());

  // Get skills
  const skillsSnap = await getDocs(
    query(collection(db, 'skills'), orderBy('displayOrder'), limit(20))
  );
  const skills = skillsSnap.docs.map(doc => doc.data());

  // Get experiences
  const expSnap = await getDocs(
    query(collection(db, 'experiences'), orderBy('displayOrder'), limit(10))
  );
  const experiences = expSnap.docs.map(doc => doc.data());

  return { projects, skills, experiences };
}
```

## Write Operations

### Add New Document
```typescript
const db = getFirestoreDb();
const docRef = await addDoc(collection(db, "projects"), {
  title: "New Project",
  description: "Project description",
  technologiesUsed: ["React", "Firebase"],
  displayOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log("Document ID:", docRef.id);
```

### Update Document
```typescript
const projectRef = doc(db, "projects", projectId);
await updateDoc(projectRef, {
  title: "Updated Title",
  description: "Updated description",
  updatedAt: new Date()
});
```

### Delete Document
```typescript
const projectRef = doc(db, "projects", projectId);
await deleteDoc(projectRef);
```

## Count Operations

### Get Collection Count
```typescript
import { getCountFromServer } from 'firebase/firestore';

const projectsCount = await getCountFromServer(collection(db, "projects"));
console.log("Total projects:", projectsCount.data().count);

const skillsCount = await getCountFromServer(collection(db, "skills"));
console.log("Total skills:", skillsCount.data().count);
```

## Batch Operations

### Batch Update
```typescript
import { writeBatch } from 'firebase/firestore';

const batch = writeBatch(db);

// Update multiple documents
projects.forEach((project, index) => {
  const projectRef = doc(db, "projects", project.id);
  batch.update(projectRef, { displayOrder: index });
});

await batch.commit();
```

## Error Handling

### Typical Error Handling Pattern
```typescript
try {
  const db = getFirestoreDb();
  await updateDoc(doc(db, "projects", id), data);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("not-found")) {
      console.error("Document not found");
    } else if (error.message.includes("permission-denied")) {
      console.error("Access denied. Check Firestore rules");
    } else {
      console.error("Error:", error.message);
    }
  }
  throw error;
}
```

## Tips

1. **Always cleanup listeners** - Call `unsubscribe()` in useEffect return
2. **Use limits** - Avoid querying entire collections
3. **Use ordering** - Order by fields with indexes for performance
4. **Batch writes** - Use batch for multiple operations
5. **Error handling** - Always wrap in try/catch
6. **Timestamps** - Use `new Date()` or `Timestamp.now()`

---

Last Updated: April 17, 2026
