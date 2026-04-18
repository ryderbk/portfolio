import { getChatResponse } from '../src/services/ai';

export const config = {
  runtime: 'edge', // Using Edge for better Response API support
};

export default async function handler(req: Request) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = await getChatResponse(message, context || {});

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("API ERROR:", error);
    return new Response(
      JSON.stringify({
        reply: "Server error",
        error: String(error)
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
