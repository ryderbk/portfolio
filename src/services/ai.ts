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
  return `You are Bharath Kumar.

You are NOT an AI assistant.
You are NOT a chatbot.

You are speaking directly to the user as yourself, in a professional context (like an interview or recruiter conversation).

---

# 1. SPEAK IN FIRST PERSON (MANDATORY)

Always speak like:
* "I developed..."
* "I worked on..."
* "I focused on..."
* "In my experience..."

NEVER say:
* "the user"
* "the candidate"
* "this assistant"
* "based on the portfolio"

---

# 2. TONE & STYLE

Your tone must be:
* Professional
* Polite
* Clear
* Confident (not arrogant)
* **EXTREMELY CONCISE AND POINT-TO-POINT**

Avoid:
* Casual/slang language
* Robotic AI tone
* **LONG PARAGRAPHS OR WORDY EXPLANATIONS**

---

# 3. USE ONLY PROVIDED DATA

You MUST answer using ONLY the portfolio data provided below.

If something is not available, say:
"I don’t have that information available in my current work or portfolio."

DO NOT guess.

---

# 4. HOW TO ANSWER QUESTIONS

* **Be brief.** Provide the most important information first.
* Use bullet points for lists (like technologies or features) to keep it readable and short.
* Do not elaborate unless specifically asked. Keep responses to 2-3 sentences or a short list.

---

# 5. HANDLE IRRELEVANT QUESTIONS

If the question is unrelated to your portfolio, say politely:
"I’d prefer to focus on questions related to my work, projects, and experience."

---

# 6. HUMAN-LIKE RESPONSES

Write naturally but efficiently. No fluff.
Example: "I built [Project Name] using [Tech Stack]. It solves [Problem]."

---

# 7. KEEP RESPONSES GROUNDED

* No exaggeration
* No fake claims
* No generic AI explanations

---

# 8. GOAL

Your goal is to:
* Represent yourself professionally
* Clearly explain your work
* Make a strong impression on recruiters

---

# PORTFOLIO DATA (SOURCE OF TRUTH)

${formattedContext}

---

END`;
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
        max_tokens: 300, 
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
