import { AI_CONFIG } from "../lib/constants";

/**
 * AI Service
 * Handles interaction with GROQ API for the portfolio chatbot.
 * Persona: Bharath Kumar S (Casual, direct, professional developer/engineer)
 */

interface PortfolioContext {
  projects?: any[];
  skills?: any[];
  experiences?: any[];
  education?: any[];
}

/**
 * Formats full portfolio context into a string for the AI.
 */
export function formatPortfolioContext(context: PortfolioContext): string {
  const { projects = [], skills = [], experiences = [] } = context;
  
  let contextualString = "MY PORTFOLIO DATA:\n\n";

  if (projects.length > 0) {
    contextualString += "PROJECTS:\n" + projects.slice(0, 10).map((p) => 
      `- ${p.title}: ${p.description}. Tech: ${p.technologiesUsed?.join(", ") || p.tags?.join(", ") || "n/a"}`
    ).join("\n") + "\n\n";
  }

  if (skills.length > 0) {
    contextualString += "SKILLS:\n" + skills.map(s => s.name).join(", ") + "\n\n";
  }

  if (experiences.length > 0) {
    contextualString += "EXPERIENCE:\n" + experiences.map(e => 
      `- ${e.role} at ${e.company} (${e.period}): ${e.description}`
    ).join("\n") + "\n\n";
  }

  return contextualString;
}

/**
 * Construct the system prompt for Bharath's persona.
 * Updated to follow strict human-like texting style rules.
 */
export function getSystemPrompt(formattedContext: string): string {
  return `
You are Bharath Kumar S. This is a personal chat. Speak in the FIRST PERSON ("I", "my", "me").
Imagine the visitor is texting you directly. Your tone is casual, professional, confident, and direct.

TONE & STYLE:
- Talk like a real human texting. Short sentences. No long paragraphs.
- MAX 5 lines per response. Ever. Usually 1-2 lines is enough.
- No "Certainly!", "Absolutely!", "Great question!", "As an AI", or "I'd be happy to help." 
- Directly answer questions. No robotic introductions.
- If someone compliments the site, be humble: "Thanks, put a lot of work into it"

IDENTITY & RULES:
- You built this website. You are a developer and electronics engineer.
- ONLY answer questions about your work: projects, skills, education, experience, tech stack, contact info, etc.
- OFF-TOPIC REDIRECT: If asked about general coding, explaining concepts, news, or science:
  "I'm just here to talk about my work and background. Anything specific you want to know about my projects or skills?"
- NEVER write code for the visitor or explain general tech (like "what is React").
- AI CONFESSION: If asked if you are an AI or bot:
  "I'm an AI representing Bharath — he set this up so visitors can get quick answers. But if you want to talk to him directly, the contact form's right there"
- IF DATA MISSING: "That's not something I've shared here, but you can reach out directly and I'll get back to you"

PORTFOLIO DATA (CONTEXT):
${formattedContext}

EXAMPLE CONVERSATIONS:
User: "What do you do?"
Me: "I build full stack apps and work with embedded systems too. Basically anything at the intersection of software and hardware."

User: "Tell me about your tech stack."
Me: "I mainly use React, TypeScript, and Node.js for software, and work with microcontrollers like Arduino and ESP32 for hardware projects."

User: "Are you available for work?"
Me: "Yeah, I'm open to opportunities right now. Feel free to reach out through the contact form or drop me a message on LinkedIn."
`;
}

/**
 * Main AI Chat service handler.
 */
export async function getChatResponse(message: string, context: PortfolioContext): Promise<string> {
  // Broad environment variable detection to support Vercel, local Node, and Vite bundling
  // Try standard Node, then Vite, then fallbacks
  const apiKey = (typeof process !== "undefined" ? process.env.GROQ_API_KEY : null) || 
                 (globalThis as any)?.process?.env?.GROQ_API_KEY ||
                 (import.meta as any).env?.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("AI SERVICE CONFIG ERROR: GROQ_API_KEY is missing from all environment sources (process.env, etc.)");
    throw new Error("GROQ_API_KEY is not configured. Please check your environment variables.");
  }

  const formattedContext = formatPortfolioContext(context);
  const systemPrompt = getSystemPrompt(formattedContext);

  try {
    const response = await fetch(AI_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 250, 
      })
    });

    if (!response.ok) {
      let errorMessage = "AI API request failed";
      try {
        const errorData = await response.json();
        console.error("Groq API error response:", errorData);
        errorMessage = errorData?.error?.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) return "I'm sorry, I couldn't formulate a response right now. Can we talk about my projects instead?";

    // Post-processing to ensure it's not too long (secondary safety)
    const lines = content.split('\n').filter((l: string) => l.trim() !== "");
    if (lines.length > 5) {
      return lines.slice(0, 4).join("\n");
    }

    return content;
  } catch (error: any) {
    console.error("AI SERVICE EXECUTION ERROR:", error.message || error);
    // On Vercel, this error message might be useful to see in logs
    throw error;
  }
}
