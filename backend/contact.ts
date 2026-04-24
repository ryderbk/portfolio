import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { getFirestoreDb } from '../src/lib/firebase.js';

const db = getFirestoreDb();
const MESSAGES_COLLECTION = "messages";

export async function contactHandler(req: any, res: any) {
  const method = req.method;

  try {
    if (method === 'POST') {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields: name, email, and message are required." });
      }

      // Save message to Firestore
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        name,
        email,
        message,
        createdAt: Timestamp.now(),
        read: false
      });

      return res.status(201).json({ success: true, id: docRef.id });

    } else if (method === 'GET') {
      // Fetch all messages sorted by latest first
      const q = query(collection(db, MESSAGES_COLLECTION), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data() as any).createdAt?.toDate()?.toISOString()
      }));

      return res.status(200).json(messages);

    } else {
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    console.error("BACKEND CONTACT ERROR:", error.message || error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
