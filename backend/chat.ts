import { getChatResponse } from '../src/services/ai.js';

export async function chatHandler(req: any, res: any) {
  try {
    const { message, context, projects } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    // Use context if provided, otherwise fallback to projects
    const portfolioContext = context || { projects: projects || [] };
    const reply = await getChatResponse(message, portfolioContext);
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error("BACKEND CHAT ERROR:", error.message || error);
    return res.status(500).json({
      reply: "AI is temporarily unavailable."
    });
  }
}
