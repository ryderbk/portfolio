import { getChatResponse } from '../src/services/ai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    const body = await req.json();
    const { message, context, history } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Message is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Pass conversation history for multi-turn context
    const conversationHistory = Array.isArray(history) ? history : [];
    
    const reply = await getChatResponse(message, context || {}, conversationHistory);

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("API ERROR:", error);
    return new Response(
      JSON.stringify({
        reply: "I apologize, but the AI assistant is temporarily unavailable. Please try again shortly.",
        error: String(error)
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
