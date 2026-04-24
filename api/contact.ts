import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { getFirestoreDb } from '../src/lib/firebase';

const db = getFirestoreDb();
const MESSAGES_COLLECTION = "messages";

export default async function handler(req: Request) {
  const method = req.method;

  try {
    if (method === 'POST') {
      const body = await req.json();
      const { name, email, message } = body;

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: name, email, and message are required." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Save message to Firestore
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        name,
        email,
        message,
        createdAt: Timestamp.now(),
        read: false
      });

      return new Response(
        JSON.stringify({ success: true, id: docRef.id }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );

    } else if (method === 'GET') {
      // Fetch all messages sorted by latest first
      const q = query(collection(db, MESSAGES_COLLECTION), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data() as any).createdAt?.toDate()?.toISOString()
      }));

      return new Response(
        JSON.stringify(messages),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: `Method ${method} Not Allowed` }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("CONTACT API ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
