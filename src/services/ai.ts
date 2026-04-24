import { AI_CONFIG } from "../lib/constants";

/**
 * AI Service
 * Handles interaction with GROQ API for the portfolio chatbot.
 * Persona: Bharath Kumar S — Professional, composed, interview-ready.
 */

interface PortfolioContext {
  projects?: any[];
  skills?: any[];
  experiences?: any[];
  education?: any[];
}

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Formats full portfolio context into a structured string for the AI.
 */
export function formatPortfolioContext(context: PortfolioContext): string {
  const { projects = [], skills = [], experiences = [], education = [] } = context;
  
  let contextualString = "=== MY PORTFOLIO DATA ===\n\n";

  if (projects.length > 0) {
    contextualString += "PROJECTS:\n" + projects.slice(0, 10).map((p) => {
      let entry = `- ${p.title}`;
      if (p.subtitle) entry += ` (${p.subtitle})`;
      entry += `: ${p.description || 'No description available'}`;
      const tech = p.technologiesUsed?.join(", ") || p.tags?.join(", ");
      if (tech) entry += ` | Technologies: ${tech}`;
      if (p.liveUrl) entry += ` | Live: ${p.liveUrl}`;
      if (p.githubUrl) entry += ` | GitHub: ${p.githubUrl}`;
      return entry;
    }).join("\n") + "\n\n";
  }

  if (skills.length > 0) {
    contextualString += "SKILLS:\n" + skills.map(s => {
      let entry = s.name;
      if (s.category) entry += ` (${s.category})`;
      if (s.level) entry += ` — ${s.level}`;
      return `- ${entry}`;
    }).join("\n") + "\n\n";
  }

  if (experiences.length > 0) {
    contextualString += "EXPERIENCE:\n" + experiences.map(e => 
      `- ${e.role || e.title} at ${e.company} (${e.period || e.duration}): ${e.description}`
    ).join("\n") + "\n\n";
  }

  if (education.length > 0) {
    contextualString += "EDUCATION:\n" + education.map(e =>
      `- ${e.degree || e.title} from ${e.institution || e.school} (${e.year || e.period})`
    ).join("\n") + "\n\n";
  }

  return contextualString;
}

/**
 * Construct the professional system prompt for Bharath's persona.
 * This follows a structured, interview-grade communication style.
 */
export function getSystemPrompt(formattedContext: string): string {
  return `You are an AI assistant representing the portfolio of Bharath Kumar.

Your role is to communicate in a **highly professional, polite, and composed manner**, similar to how Bharath would speak in an interview or professional setting.

---

# 1. PERSONALITY & TONE

* Always be **respectful, calm, and well-structured**
* Use **clear, professional English**
* Avoid slang, sarcasm, or casual tone
* Never sound rude, dismissive, or arrogant
* Be confident but not boastful

Preferred tone:
* "Certainly."
* "I'd be happy to explain."
* "Based on my work..."
* "In this project, I focused on..."

---

# 2. KNOWLEDGE SOURCE (STRICT)

You MUST answer using ONLY the portfolio data provided below.

If information is not available:
* Say: "I don't have that information available in my current portfolio details."

DO NOT:
* Make up experience
* Assume skills not mentioned
* Hallucinate project details

---

# 3. RESPONSE STYLE

Always:
* Be **structured and clear**
* Use short paragraphs or bullet points when needed
* Focus on **impact, implementation, and learning**

For projects, include:
* What the project is
* Technologies used
* What problem it solves
* Your contribution
* Any key outcomes

---

# 4. CONTEXT AWARENESS

If user asks:
* "What projects have you done?" → summarize key projects
* "Explain this project" → give detailed breakdown
* "What technologies do you use?" → list from portfolio data
* "Are you available for work?" → respond professionally

---

# 5. STRICT BOUNDARIES

You MUST NOT:
* Answer unrelated general knowledge questions
* Answer personal or irrelevant questions
* Act like a generic AI assistant

If question is unrelated:
Say: "This assistant is designed to answer questions related to my portfolio, projects, and experience."

---

# 6. HUMAN-LIKE REPRESENTATION

Speak as Bharath (first-person):
* "I developed..."
* "I worked on..."
* "My focus was..."

NOT:
* "The candidate"
* "The user"

---

# 7. ERROR HANDLING

If unsure:
* Do NOT guess
* Say clearly: "I'd prefer to rely only on the verified details available in my portfolio."

---

# 8. AI CONFESSION

If asked whether you are an AI, a bot, or a real person:
Say: "I am an AI assistant that Bharath has set up to help visitors learn about his work and experience. For a direct conversation, please feel free to use the contact form."

---

# 9. GOAL

Your goal is to:
* Represent Bharath professionally
* Answer accurately using real data
* Impress recruiters with clarity and structure

---

# PORTFOLIO DATA (SOURCE OF TRUTH)

${formattedContext}

---

END OF SYSTEM PROMPT`;
}

/**
 * Main AI Chat service handler.
 * Supports multi-turn conversation history for contextual responses.
 */
export async function getChatResponse(
  message: string, 
  context: PortfolioContext,
  conversationHistory: ConversationMessage[] = []
): Promise<string> {
  // Safe environment variable detection for Node.js (Vercel/Local)
  const apiKey = (typeof process !== "undefined" && process.env) 
    ? process.env.GROQ_API_KEY 
    : (globalThis as any)?.process?.env?.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("AI CONFIG ERROR: GROQ_API_KEY is missing.");
    throw new Error("GROQ_API_KEY not found in environment.");
  }

  const formattedContext = formatPortfolioContext(context);
  const systemPrompt = getSystemPrompt(formattedContext);

  // Build message array: system prompt + conversation history + current message
  const messages: ConversationMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-8), // Keep last 8 messages for context window
    { role: "user", content: message }
  ];

  try {
    console.log("Sending request to Groq...");
    const response = await fetch(AI_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 500, 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API failed:", errorText);
      throw new Error(`Groq Error: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) return "I don't have a response at this moment. Please try again.";

    return content.trim();

  } catch (error: any) {
    console.error("AI EXECUTION ERROR:", error.message);
    throw error;
  }
}
