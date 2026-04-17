import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getFirestoreDb } from '../src/lib/firebase';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Fetch portfolio context from Firestore
async function getPortfolioContext() {
    try {
        const db = getFirestoreDb();

        // Fetch projects
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(projectsRef, orderBy('displayOrder'), limit(15));
        const projectsSnap = await getDocs(projectsQuery);
        const projects = projectsSnap.docs.map(doc => ({
            title: doc.data().title,
            description: doc.data().description,
            technologies: doc.data().technologiesUsed || [],
            liveDemoUrl: doc.data().liveDemoUrl,
            repositoryUrl: doc.data().repositoryUrl,
        }));

        // Fetch skills
        const skillsRef = collection(db, 'skills');
        const skillsSnap = await getDocs(skillsRef);
        const skills = skillsSnap.docs.map(doc => ({
            name: doc.data().name,
            category: doc.data().category,
        }));

        return { projects, skills };
    } catch (error) {
        console.error('Error fetching portfolio context:', error);
        return { projects: [], skills: [] };
    }
}

const createSystemPrompt = (context: Awaited<ReturnType<typeof getPortfolioContext>>) => {
    return `You are a helpful AI assistant for Bharath Kumar S's portfolio website. 
Your task is to answer questions about his projects and skills based ONLY on the data provided below.

DATA:
Projects:
${JSON.stringify(context.projects, null, 2)}

Skills:
${JSON.stringify(context.skills, null, 2)}

INSTRUCTIONS:
1. Use ONLY the provided data. If information is missing, politely say you don't have that information.
2. Be professional, concise, and friendly.
3. Keep responses under 150 words.
4. If asked about contact info, refer to the contact section of the website.`;
};

/**
 * Handle AI Chat logic (Express Handler)
 */
export async function chatHandler(req: any, res: any) {
    try {
        const { message, messages } = req.body;
        
        // Handle both single 'message' (new requirement) and 'messages' array (old support)
        const userMessage = message || (messages && messages[messages.length - 1]?.content);

        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log("🚀 Sending request to Groq...");

        // Get portfolio context
        const context = await getPortfolioContext();
        const systemPrompt = createSystemPrompt(context);

        // Prepare messages for Groq
        const groqMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ];

        // Call Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: groqMessages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("✅ Received response from Groq");
        
        const reply = data.choices[0]?.message?.content;

        if (!reply) {
            throw new Error('No response content from Groq');
        }

        return res.json({ reply });
    } catch (error: any) {
        console.error('Chat error:', error);
        return res.status(500).json({ 
            reply: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!",
            error: error.message 
        });
    }
}
