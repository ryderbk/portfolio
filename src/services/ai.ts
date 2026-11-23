import { GEMINI_CONFIG, GROQ_CONFIG } from "../lib/constants";

/**
 * AI Service
 * Handles interaction with AI APIs (Google Gemini & Groq) for the portfolio chatbot.
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

interface AIProviderAttempt {
  provider: "gemini" | "groq";
  apiKey: string;
  apiUrl: string;
  model: string;
}

/**
 * Builds an ordered list of providers and models to attempt.
 * Automatically supports:
 * 1. Google Gemini (via GEMINI_API_KEY, AI_API_KEY, or GROQ_API_KEY if key starts with AQ. / AIza)
 * 2. Groq (via GROQ_API_KEY or AI_API_KEY if key starts with gsk_)
 */
function getProviderExecutionQueue(): AIProviderAttempt[] {
  const env = (typeof process !== "undefined" && process.env)
    ? process.env
    : (globalThis as any)?.process?.env || {};

  const geminiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
  const groqKey = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY;
  const genericKey = env.AI_API_KEY || env.VITE_AI_API_KEY;

  const queue: AIProviderAttempt[] = [];

  // Determine Gemini key
  let resolvedGeminiKey = geminiKey;
  if (!resolvedGeminiKey && groqKey && (groqKey.startsWith("AQ.") || groqKey.startsWith("AIza"))) {
    resolvedGeminiKey = groqKey;
  }
  if (!resolvedGeminiKey && genericKey && (genericKey.startsWith("AQ.") || genericKey.startsWith("AIza"))) {
    resolvedGeminiKey = genericKey;
  }

  // 1. Google Gemini attempts (Primary provider)
  if (resolvedGeminiKey) {
    for (const model of GEMINI_CONFIG.MODELS) {
      queue.push({
        provider: "gemini",
        apiKey: resolvedGeminiKey,
        apiUrl: GEMINI_CONFIG.API_URL,
        model,
      });
    }
  }

  // 2. Groq attempts (Secondary provider, with modern active models)
  if (groqKey && !groqKey.startsWith("AQ.") && !groqKey.startsWith("AIza")) {
    for (const model of GROQ_CONFIG.MODELS) {
      queue.push({
        provider: "groq",
        apiKey: groqKey,
        apiUrl: GROQ_CONFIG.API_URL,
        model,
      });
    }
  }

  return queue;
}

/**
 * Formats full portfolio context into a structured string for the AI.
 */
/**
 * Personal profile (general skills, internships, education). Kept in sync with the resume.
 * Personal skills are NOT taken from the database, so they cannot drift from the resume.
 * Project-specific technologies come from the projects data and stay separate.
 */
const PERSONAL_PROFILE = `PERSONAL PROFILE (my general skills — separate from any single project's tech):
- Programming languages: Python, C++
- Web development: Frontend & Backend Development, App Development, AI-Assisted Development
- Tools & platforms: Git, GitHub, VS Code, Antigravity
- Languages spoken: English, Tamil

EXPERIENCE:
- Brakes India Private Limited — Internship (Dec 2024): Observation-based internship covering automotive braking technologies, manufacturing processes, quality control practices and the role of precision engineering in vehicle safety.
- Toshniwal Hyvac Pvt. Ltd. — Internship: Practical experience in manufacturing and testing flow meters, worked on a testing setup using Arduino, and contributed to an industrial automation project.

EDUCATION:
- B.E. Electronics & Instrumentation Engineering, Velammal Engineering College, Chennai (2023 — 2027)`;

export function formatPortfolioContext(context: PortfolioContext): string {
  const { projects = [] } = context;

  let contextualString = "=== MY PORTFOLIO DATA ===\n\n" + PERSONAL_PROFILE + "\n\n";

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

When describing my general skills, use ONLY the PERSONAL PROFILE section.
Technologies listed under a project belong to that project only — mention them only when
discussing that project, and never present them as my general skills.

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
 * Iterates through candidate providers/models with automatic fallback.
 */
export async function getChatResponse(
  message: string, 
  context: PortfolioContext,
  conversationHistory: ConversationMessage[] = []
): Promise<string> {
  const queue = getProviderExecutionQueue();

  if (queue.length === 0) {
    console.error("AI CONFIG ERROR: No valid AI provider credentials found.");
    throw new Error(
      "Missing AI API key. Please configure GEMINI_API_KEY in your environment variables."
    );
  }

  const formattedContext = formatPortfolioContext(context);
  const systemPrompt = getSystemPrompt(formattedContext);

  // Build message array: system prompt + conversation history + current message
  const messages: ConversationMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-8), // Keep last 8 messages for context window
    { role: "user", content: message }
  ];

  let lastError: Error | null = null;

  for (let i = 0; i < queue.length; i++) {
    const attempt = queue[i];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      console.log(`Sending chat request via ${attempt.provider} with model ${attempt.model}...`);
      const response = await fetch(attempt.apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${attempt.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: attempt.model,
          messages,
          temperature: 0.5,
          max_tokens: 220, 
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`${attempt.provider} API warning with model ${attempt.model} (status ${response.status}):`, errorText);

        lastError = new Error(`${attempt.provider} Error (${response.status}): ${errorText}`);

        // Try the next provider or model in the queue
        if (i < queue.length - 1) {
          continue;
        }
        throw lastError;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      
      if (!content) {
        if (i < queue.length - 1) continue;
        return "I don't have a response at this moment. Please try again.";
      }

      return content.trim();

    } catch (error: any) {
      console.error(`AI execution error with ${attempt.provider} (${attempt.model}):`, error.message || error);
      lastError = error;

      if (i < queue.length - 1) {
        console.log(`Retrying with next option in queue...`);
        continue;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error("Failed to get response from AI service.");
}
