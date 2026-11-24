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
 * Merges dynamic Firestore context with complete grounded website data.
 */
export function formatPortfolioContext(context: PortfolioContext = {}): string {
  const { projects = [], skills = [], experiences = [], education = [] } = context;

  // Curated project dataset (matching Firebase & website live portfolio)
  const defaultProjects = [
    {
      title: "MARKIFY",
      category: "WEB APPLICATION — ACADEMIC ANALYTICS",
      description: "A full-stack academic web app built to calculate internal marks, predict GPAs, and project target scores through instant, data-driven insights.",
      tech: "React, TypeScript, Tailwind CSS",
    },
    {
      title: "INSTRUAX",
      category: "WEB APPLICATION — SYMPOSIUM WEBSITE",
      description: "A modern symposium website built to centralize event details, schedules, and registrations through an interactive and visually engaging interface.",
      tech: "React, TypeScript, Tailwind CSS, Framer Motion",
    },
    {
      title: "FIRE FIGHTING ROBOT",
      category: "HARDWARE — ROBOTICS & SAFETY SYSTEMS",
      description: "An autonomous safety system engineered to detect and extinguish flames using sensor-based navigation for safe, human-free fire suppression.",
      tech: "Arduino, Embedded Systems, Sensor-Based, Automation",
    },
    {
      title: "SOUND-ACTIVATED CONTROL",
      category: "HARDWARE — HOME AUTOMATION",
      description: "A hands-free automation system designed to control a fan using clap detection through simple audio signal processing and efficient electronic circuitry.",
      tech: "Home Automation, Relay Circuit, Signal Processing",
    },
    {
      title: "SWEETALK",
      category: "WEB APPLICATION — MESSAGING APP",
      description: "A real-time web messaging app that combines live personal chatting with synchronized interactive mini-games and custom visual themes.",
      tech: "React, TypeScript, Firebase, Progressive Web App",
    },
  ];

  let contextualString = `=== BHARATH KUMAR S — PORTFOLIO DATA ===

ABOUT ME:
- Name: Bharath Kumar S
- Role: Electronics & Instrumentation Engineer who writes software
- Location: Perambur, Chennai, India (IST timezone)
- Core Focus: I build things that sense, think, and feel good to use — from Arduinos, sensors, and flow meters on the factory floor to web applications, cross-platform tools, and embedded automation.
- Current Status: Available for opportunities
- Education:
  * B.E. in Electronics & Instrumentation Engineering at Velammal Engineering College, Chennai (2023 — 2027) | Current CGPA: 7.89
  * Higher Secondary (HSC) at Kaligi Ranganathan Montford Matric Hr. Sec. School (2021 — 2023) | 78.33%
  * Secondary (SSLC) at SKNS PMC Vivekananda Vidyalaya Junior College (2009 — 2021) | 70.17%
- Experience & Internships:
  * Toshniwal Hyvac Pvt. Ltd. (July 2024): Developed an Arduino testing setup for flow meters and gained hands-on industrial automation experience.
  * Brakes India Private Limited (Dec 2024): Explored automotive manufacturing, braking systems engineering, and precision quality standards.
  * INSTRAUX'24: Led the editing team, created promotional reels and posters, and developed the official symposium website.
- Technical Skills & Toolbox:
  * 01 — Code: Python, C++, HTML, CSS, TypeScript, JavaScript, React, Flutter
  * 02 — Hardware: Arduino, Microcontrollers, Sensors & Actuators, Industrial Automation
  * 03 — Tools & Platforms: Firebase, Git & GitHub, Vercel, VS Code, OpenAI Codex, Antigravity
  * 04 — Creative: Canva, Video Editing, Poster Design, Promotional Media
- Strengths: Problem solving, Communication, Teamwork, Adaptability, Curiosity
- Languages Known: English, Tamil
- Contact Details:
  * Phone: +91 98843 26984
  * Email: sbharathkumarrr@gmail.com
  * LinkedIn: https://www.linkedin.com/in/bharathkumarss
  * GitHub: https://github.com/ryderbk
  * Location: Perambur, Chennai, India

PROJECTS:\n`;

  // Merge projects from context if present or use default curated list
  if (projects && projects.length > 0) {
    contextualString += projects.map((p) => {
      let entry = `- ${p.title}`;
      const cat = p.category || p.subtitle;
      if (cat) entry += ` (${cat})`;
      entry += `: ${p.description || "No description available"}`;
      const tech = p.technologiesUsed?.join(", ") || (Array.isArray(p.tags) ? p.tags.join(", ") : p.tech);
      if (tech) entry += ` | Tech Stack: ${tech}`;
      return entry;
    }).join("\n") + "\n\n";
  } else {
    contextualString += defaultProjects.map((p) => 
      `- ${p.title} (${p.category}): ${p.description} | Tech Stack: ${p.tech}`
    ).join("\n") + "\n\n";
  }

  // Include any extra dynamic Firestore data if passed
  if (skills && skills.length > 0) {
    contextualString += "ADDITIONAL SKILLS:\n" + skills.map((s) => {
      let entry = s.name || s.title;
      if (s.category) entry += ` (${s.category})`;
      return `- ${entry}`;
    }).join("\n") + "\n\n";
  }

  if (experiences && experiences.length > 0) {
    contextualString += "ADDITIONAL EXPERIENCES:\n" + experiences.map((e) =>
      `- ${e.role || e.title} at ${e.company} (${e.period || e.duration}): ${e.description}`
    ).join("\n") + "\n\n";
  }

  if (education && education.length > 0) {
    contextualString += "ADDITIONAL EDUCATION:\n" + education.map((ed) =>
      `- ${ed.degree || ed.title} from ${ed.institution || ed.school} (${ed.year || ed.period})`
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
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
          max_tokens: 700, 
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
