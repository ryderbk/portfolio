import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getChatResponse } from '../src/services/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("=== API START ===");

  console.log("ENV CHECK:", {
    hasKey: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY?.length
  });

  try {
    const { message, context, projects } = req.body;
    console.log("Request body:", JSON.stringify({ message, context, projects }));

    const portfolioContext = context || { projects: projects || [] };
    
    console.log("Sending request to Groq via AI Service...");
    const reply = await getChatResponse(message, portfolioContext);
    
    console.log("Success! Reply generated.");
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({
      reply: "DEBUG_ERROR",
      error: String(error),
      stack: error.stack
    });
  } finally {
    console.log("=== API END ===");
  }
}
