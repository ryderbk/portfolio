import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot,
  getCountFromServer,
  writeBatch,
  DocumentData,
  QuerySnapshot,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';

const db = getFirestoreDb();

/**
 * Projects Services
 */
export const subscribeToProjects = (callback: (projects: any[]) => void) => {
  // We use a simple collection reference first to be as resilient as possible.
  // Ordering can be done client-side if the fields don't exist yet in all docs.
  const projectsRef = collection(db, "projects");
  
  return onSnapshot(projectsRef, (snapshot) => {
    console.log(`Firestore: Received snapshot with ${snapshot.docs.length} documents.`);
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    // Sort client-side to avoid Firestore query requirements (like indexes/existing fields)
    const sortedProjects = projects.sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      return orderA - orderB;
    });
    
    callback(sortedProjects);
  }, (error) => {
    console.error("Firestore Subscription Error:", error);
  });
};

export const getAllProjects = async (limitCount = 50) => {
  const q = query(collection(db, "projects"), orderBy("displayOrder"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addProject = async (data: any) => {
  try {
    const docRef = await addDocument("projects", data);
    console.log("Project successfully added with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding project to Firestore:", error);
    throw error;
  }
};

export const updateProject = (id: string, data: any) => updateDocument("projects", id, data);
export const deleteProject = (id: string) => removeDocument("projects", id);

export const syncInitialProjects = async (initialData: any[]) => {
  console.log("🚀 Starting synchronization process...");
  try {
    const count = await getCollectionCount("projects");
    console.log(`📊 Current project count in Firestore: ${count}`);
    
    if (count > 0) {
      console.log("⚠️ Sync skipped: 'projects' collection is not empty.");
      return "skipped";
    }

    console.log(`📦 Preparing to sync ${initialData.length} projects...`);
    
    // We use a loop with addDoc for better individual error tracking as requested
    for (let i = 0; i < initialData.length; i++) {
      const project = initialData[i];
      const num = (i + 1).toString().padStart(2, '0');
      
      const projectData = {
        ...project,
        number: num,
        displayOrder: i,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      console.log(`📤 Uploading project ${i + 1}: ${project.title}`);
      await addDoc(collection(db, "projects"), projectData);
    }
    
    console.log("✅ All projects successfully synced to Firestore.");
    return "success";
  } catch (error: any) {
    console.error("❌ Critical Sync Failure:", error);
    // Log specifics if available
    if (error.code === 'permission-denied') {
      console.error("🔐 FIREBASE ERROR: Permission Denied. Please check your Firestore Security Rules.");
    }
    throw error;
  }
};

export const addRemainingProjects = async (projectsToAdd: any[]) => {
  console.log("🚀 Starting remaining projects sync...");
  try {
    const projectsRef = collection(db, "projects");
    const snapshot = await getDocs(projectsRef);
    
    const existingTitles = new Set();
    let maxDisplayOrder = -1;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.title) {
        existingTitles.add(data.title.toLowerCase().trim());
      }
      if (data.displayOrder !== undefined && data.displayOrder > maxDisplayOrder) {
        maxDisplayOrder = data.displayOrder;
      }
    });

    let nextDisplayOrder = maxDisplayOrder + 1;

    for (let i = 0; i < projectsToAdd.length; i++) {
        const project = projectsToAdd[i];
        const titleKey = (project.title || "").toLowerCase().trim();
        
        if (existingTitles.has(titleKey)) {
            console.log(`Skipped duplicate: ${project.title}`);
            continue;
        }

        const projectData = {
            title: project.title || "",
            subtitle: project.subtitle || "",
            description: project.description || "",
            tags: Array.isArray(project.tags) ? project.tags : [],
            images: Array.isArray(project.images) ? project.images : [],
            displayOrder: nextDisplayOrder++,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        console.log(`Adding project: ${project.title}`);
        await addDoc(projectsRef, projectData);
    }
    
    console.log("✅ Sync complete");
    return "success";
  } catch (error: any) {
    console.error("❌ Critical Sync Failure:", error);
    throw error;
  }
};

/**
 * Skills Services
 */
export const subscribeToSkills = (callback: (skills: any[]) => void) => {
  const q = query(collection(db, "skills"), orderBy("displayOrder"), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const skills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(skills);
  });
};

/**
 * Messages Services
 */
export const subscribeToMessages = (callback: (messages: any[]) => void) => {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data() as any).createdAt?.toDate()
    }));
    callback(messages);
  });
};

/**
 * Portfolio Context for AI
 */
export async function getPortfolioContext() {
  const [projectsSnap, skillsSnap, expSnap] = await Promise.all([
    getDocs(query(collection(db, 'projects'), orderBy('displayOrder'), limit(10))),
    getDocs(query(collection(db, 'skills'), orderBy('displayOrder'), limit(20))),
    getDocs(query(collection(db, 'experiences'), orderBy('displayOrder'), limit(10)))
  ]);

  return {
    projects: projectsSnap.docs.map(doc => doc.data()),
    skills: skillsSnap.docs.map(doc => doc.data()),
    experiences: expSnap.docs.map(doc => doc.data())
  };
}

/**
 * Generic Operations
 */
export const addDocument = async (collectionName: string, data: DocumentData) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const updateDocument = async (collectionName: string, id: string, data: DocumentData) => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
};

export const removeDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};

export const getCollectionCount = async (collectionName: string) => {
  const snapshot = await getCountFromServer(collection(db, collectionName));
  return snapshot.data().count;
};

export const batchUpdateProjectOrders = async (projects: { id: string }[]) => {
  const batch = writeBatch(db);
  projects.forEach((project, index) => {
    const projectRef = doc(db, "projects", project.id);
    batch.update(projectRef, { displayOrder: index });
  });
  await batch.commit();
};
