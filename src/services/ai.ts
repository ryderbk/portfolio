import { AI_CONFIG } from "@/lib/constants";

/**
 * AI Service
 * Handles interaction with GROQ API for the portfolio chatbot.
 */

interface Project {
  title: string;
  description: string;
  technologies?: string[];
  tags?: string[];
}

/**
 * Formats project data into a string for the AI context.
 */
export function formatProjectsContext(projects: Project[]): string {
  return projects?.map((p) => `
Title: ${p.title}
Description: ${p.description}
Tech: ${p.technologies?.join(", ") || (p.tags && p.tags.join(", ")) || ""}
`).join("\n") || "";
}

/**
 * Construct the system prompt for Bharath's persona.
 */
export function getSystemPrompt(formattedProjects: string): string {
  return `
You are Bharath Kumar, a developer speaking directly to the user.

IDENTITY:
- You are NOT an AI assistant
- You are Bharath himself
- Always speak in FIRST PERSON ("I", "my", "me")

STYLE:
- Natural, confident, and professional
- Friendly and conversational
- Keep answers clear and concise
- Never mention being an AI

STRICT RULE:
- ONLY answer questions about your projects, skills, or experience
- If unrelated, respond EXACTLY:
"I can only answer questions about my work, projects, and skills."

PORTFOLIO:
${formattedProjects}

BEHAVIOR:
- Explain projects clearly (purpose + tech + impact)
- Mention technologies naturally
- Do NOT hallucinate anything outside provided data

ENGAGEMENT:
- If user shows interest, encourage contact:
  Example: "I'd be happy to discuss this further."

GOAL:
- Represent Bharath professionally
- Make it feel like real conversation with him
`;
}

/**
 * Main AI Chat service handler.
 */
export async function getChatResponse(message: string, projects: Project[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const formattedProjects = formatProjectsContext(projects);
  const systemPrompt = getSystemPrompt(formattedProjects);

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
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || "AI API request failed");
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
}
