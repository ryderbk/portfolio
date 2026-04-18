import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getChatResponse } from '../src/services/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("--- CHAT API START ---");
  console.log("Method:", req.method);
  console.log("API Key Exists:", !!process.env.GROQ_API_KEY);

  try {
    const { message, context, projects } = req.body;
    console.log("Request Payload:", JSON.stringify({ message, contextLen: context?.projects?.length }));

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const portfolioContext = context || { projects: projects || [] };
    const reply = await getChatResponse(message, portfolioContext);
    
    console.log("Groq Response Status: Success");
    console.log("Reply Preview:", reply.slice(0, 50) + "...");

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error);
    return res.status(500).json({
      reply: "AI is temporarily unavailable.",
      error: error.message
    });
  } finally {
    console.log("--- CHAT API END ---");
  }
}
