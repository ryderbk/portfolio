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
 * Priority: Groq first (fast, ~1000 t/s), Gemini as fallback.
 * 1. Groq (via GROQ_API_KEY or AI_API_KEY if key starts with gsk_)
 * 2. Google Gemini (via GEMINI_API_KEY or AI_API_KEY)
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

  // Resolve Groq key (gsk_ prefix)
  let resolvedGroqKey = groqKey;
  if (!resolvedGroqKey && genericKey && genericKey.startsWith("gsk_")) {
    resolvedGroqKey = genericKey;
  }

  // 1. Groq first — fastest provider (~1000 t/s, sub-2s responses)
  if (resolvedGroqKey && !resolvedGroqKey.startsWith("AQ.") && !resolvedGroqKey.startsWith("AIza")) {
    for (const model of GROQ_CONFIG.MODELS) {
      queue.push({
        provider: "groq",
        apiKey: resolvedGroqKey,
        apiUrl: GROQ_CONFIG.API_URL,
        model,
      });
    }
  }

  // 2. Gemini fallback
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

  return queue;
}

/**
 * Formats full portfolio context into a structured string for the AI.
 * Merges dynamic Firestore context with complete grounded website data.
 */
export function formatPortfolioContext(context: PortfolioContext = {}): string {
  const { projects = [], skills = [], experiences = [], education = [] } = context;

  // Curated detailed project catalog
  const defaultProjects = [
    {
      title: "MARKIFY",
      category: "WEB APPLICATION — ACADEMIC ANALYTICS",
      oneLiner: "A full-stack academic web app built to calculate internal marks, predict GPAs, and project target scores through instant, data-driven insights.",
      problemSolved: "Eliminates manual, error-prone calculator methods by using predefined formulas mapped directly to college department evaluation schemes (such as Theory 40-mark and Integrated 50-mark formats).",
      howItWorks: "The student enters test marks (CAT 1, CAT 2) and attendance percentage into form fields. React saves inputs into local component state and passes them to pure mathematical utility functions. The normalized score and target goals appear instantly on a visual card without requiring backend processing or page reloads.",
      tech: "React, TypeScript, Tailwind CSS, Vite. Deployed live on Vercel with custom domain.",
    },
    {
      title: "INSTRAUX '26",
      category: "WEB APPLICATION — SYMPOSIUM WEBSITE",
      oneLiner: "A modern symposium website built to centralize event details, schedules, and registrations through an interactive and visually engaging interface.",
      problemSolved: "Replaced scattered social media links and confusing paper registration sheets with a unified digital portal for the entire college technical symposium.",
      howItWorks: "Students browse technical competitions, workshops, schedules, entry fees, and coordinator contacts featuring smooth Framer Motion animations. Clicking an event registration action redirects seamlessly to an integrated registration form.",
      tech: "React, TypeScript, Tailwind CSS, Framer Motion. Deployed live on Vercel with custom domain.",
    },
    {
      title: "SWEETALK",
      category: "WEB APPLICATION — MESSAGING APP",
      oneLiner: "A real-time web messaging app that combines live personal chatting with synchronized interactive mini-games and custom visual themes.",
      problemSolved: "Built as a Progressive Web Application (PWA) exploring real-time client-server architecture with synchronized state for interactive social features.",
      howItWorks: "When a user sends a message or makes a move in a mini-game (e.g., 'This or That', 'Guess the Word'), the app writes the payload to Firebase Firestore. Firebase real-time listeners push updates instantly to the recipient's screen without reloading.",
      tech: "React, TypeScript, Flutter, Firebase (Firestore, Auth), Tailwind CSS, Progressive Web App.",
    },
    {
      title: "AUTONOMOUS FIRE FIGHTING ROBOT",
      category: "HARDWARE — ROBOTICS & SAFETY SYSTEMS",
      oneLiner: "An autonomous safety system engineered to detect and extinguish flames using sensor-based navigation for safe, human-free fire suppression.",
      problemSolved: "Provides rapid, human-free fire hazard intervention in hazardous environments where human presence is dangerous.",
      howItWorks: "Infrared (IR) flame sensors mounted on the front chassis continuously scan the surrounding environment. When flame is detected, the central Arduino UNO microcontroller processes sensor signals and instructs the L298N motor driver to navigate the 4 BO wheels toward the flame. Once positioned near the fire, Arduino triggers an SG90 servo motor to aim the nozzle and activates a 5V mini submersible water pump from the onboard water tank to extinguish the fire.",
      tech: "Arduino UNO, 3x IR Flame Sensors, L298N Motor Driver, 4x BO Motors with Wheels, Robot Chassis, SG90 Servo Motor, 5V Mini Submersible Water Pump, 18650 Li-ion Batteries, Water Tank.",
    },
    {
      title: "SOUND-ACTIVATED CONTROL",
      category: "HARDWARE — HOME AUTOMATION",
      oneLiner: "A hands-free automation system designed to control a fan using clap detection through simple audio signal processing and efficient electronic circuitry.",
      problemSolved: "Delivers accessible, hands-free appliance control for users with physical mobility constraints or smart home automation needs without expensive microcontrollers.",
      howItWorks: "An electret microphone module captures ambient sound waves (hand clap) and converts them into small electrical signals. The signal is amplified and processed through a switching/flip-flop circuit. Each valid sound trigger toggles circuit output state, triggering an electronic relay switch module to toggle a 12V DC cooling fan ON or OFF.",
      tech: "Electret Microphone Sensor, Audio Signal Processing/Amplifier Circuitry, Transistors, Resistors, Relay Circuit Switch Module, 12V DC Cooling Fan, 9V Hi-Watt Batteries.",
    },
  ];

  let contextualString = `=== BHARATH KUMAR S (BK) — MASTER KNOWLEDGE CONTEXT ===

1. CANDIDATE PROFILE & CONTACT:
- Full Name: Bharath Kumar S (Prefers to be called "BK")
- Target Career Focus: Software Engineer, Full-Stack Web/App Developer, and IT Technical Roles
- Current Status: 4th-year Undergraduate Student (Batch of 2027) in Electronics and Instrumentation Engineering (EIE)
- Location: Perambur, Chennai, Tamil Nadu, India
- Phone: +91 98843 26984
- Email: sbharathkumarrr@gmail.com
- Portfolio: https://portfolio.ryderbk.me
- GitHub: https://github.com/ryderbk
- LinkedIn: https://linkedin.com/in/bharathkumarss

2. ACADEMIC BACKGROUND:
- College: Velammal Engineering College, Chennai (2023 – 2027)
  * Degree: B.E. Electronics and Instrumentation Engineering (EIE)
  * Academic Performance: CGPA 7.89
- Schooling:
  * HSC (12th Standard): Kaligi Ranganathan Montford Matric Higher Secondary School (2021 – 2023) | Percentage: 78.33%
  * SSLC (10th Standard): SKNS PMC Vivekananda Vidyalaya Junior College (2009 – 2021) | Percentage: 70.17%

3. TECHNICAL SKILL MATRIX:
- Programming Languages: Python, C++
- Web & Mobile Development: React, TypeScript, Tailwind CSS, HTML5, CSS3, JavaScript (ES6+), Flutter, Node.js, Express
- Databases & Cloud BaaS: Firebase (Firestore, Authentication, Realtime Database), PostgreSQL (Drizzle ORM)
- Hardware & Embedded Systems: Arduino UNO, Microcontrollers, Sensor Integration (IR Flame Sensors, Sound/Clap Detection, Industrial Flow Meters), L298N Motor Drivers, Relay Circuits, Signal Processing, BO Motors, Servo Motors
- AI Tools & Development Platforms: Git, GitHub, VS Code, Vercel, Framer Motion, Antigravity, OpenAI Codex / Groq API
- Design & Creative Media: Canva, Photo & Video Editing, Technical Poster Design, Promotional Reel Production

4. PRACTICAL WORK EXPERIENCE & CAMPUS LEADERSHIP:
- Toshniwal Hyvac Pvt. Ltd., Ambattur, Chennai — Industrial Internship (July 2026):
  * Hands-on manufacturing, assembly, and precision testing of industrial flow meters.
  * Designed and engineered an automated testing setup utilizing Arduino microcontrollers for equipment validation.
  * Gained deep practical knowledge of industrial automation workflows, sensor calibration, and equipment testing protocols.
- Brakes India Private Limited — Industrial Internship (Dec 2024):
  * Studied advanced automotive braking technologies, precision engineering workflows, and quality control practices.
  * Gained insights into large-scale manufacturing workflows, safety management, and quality assurance in vehicle manufacturing.
- Campus & Media Leadership:
  * INSTRAUX '26: Led the media and editing team; created promotional reels, designed technical posters, and engineered the official technical symposium website.
  * RIDDHI '26: Managed videography and video editing operations for the college farewell event.
  * HIRA Project: Contributed as a core member of the editing team, producing college promotional videos.

5. DETAILED PROJECT CATALOG:
`;

  // Merge projects from context if present or use default curated list
  if (projects && projects.length > 0) {
    contextualString += projects.map((p) => {
      let entry = `PROJECT: ${p.title}`;
      const cat = p.category || p.subtitle;
      if (cat) entry += ` (${cat})`;
      entry += `\n- Summary: ${p.description || p.oneLiner || "No description available"}`;
      const tech = p.technologiesUsed?.join(", ") || (Array.isArray(p.tags) ? p.tags.join(", ") : p.tech);
      if (tech) entry += `\n- Tech Stack: ${tech}`;
      return entry;
    }).join("\n\n") + "\n\n";
  } else {
    contextualString += defaultProjects.map((p) =>
      `PROJECT: ${p.title} (${p.category})
- Summary: ${p.oneLiner}
- Problem Solved: ${p.problemSolved}
- How it Works: ${p.howItWorks}
- Tech Stack: ${p.tech}`
    ).join("\n\n") + "\n\n";
  }

  // Include dynamic Firestore data if passed
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

  contextualString += `6. CORE INTERVIEW & RECRUITER FAQ:
Q: How does BK bridge his EIE non-IT background with Software Development?
A: BK leverages his strong foundation in hardware logic, signal processing, and systems thinking from EIE, combining them with modern software development skills in Python, React, TypeScript, and cloud services to build robust end-to-end applications.

Q: What is BK's approach to AI-assisted development (Vibe Coding)?
A: BK uses modern AI tools (such as VS Code, Antigravity, and Groq/OpenAI APIs) to accelerate prototyping, UI styling, and syntax implementation, while maintaining complete conceptual ownership over application architecture, component structure, state management, and data flow.

Q: Is BK available for software engineering roles or placement opportunities?
A: Yes! BK is actively seeking entry-level Software Engineer, Full-Stack Developer, and IT Technical roles. Recruiters can contact him directly via email at sbharathkumarrr@gmail.com or call +91 9884326984.
`;

  return contextualString;
}

/**
 * Construct the master system prompt for BK's embedded AI representative.
 */
export function getSystemPrompt(formattedContext: string): string {
  return `MASTER AI SYSTEM PROMPT — BHARATH KUMAR S (BK) PORTFOLIO

SYSTEM ROLE & PERSONALITY:
You are the official AI Assistant embedded inside the personal portfolio website of Bharath Kumar S (known as BK), located at portfolio.ryderbk.me. Your primary objective is to answer questions from recruiters, hiring managers, potential collaborators, and technical interviewers about BK's projects, technical skills, practical industrial experience, and academic background.

RESPONSE GUIDELINES:
1. Tone & Persona:
   - Professional, grounded, authentic, confident, and approachable.
   - Speak as a supportive digital representative for BK (referring to him as "BK" or "Bharath Kumar", or speaking naturally in first person "I" / "BK" as his representative).
2. Communication Style:
   - Keep explanations clear, structured, and easy to digest.
   - Focus on what problem a project solves, how it functions at a high level, the technical stack used, and real-world application.
   - Keep responses SHORT: 2-4 sentences or a compact bullet list of 3-5 items max. Never write more than needed.
3. FORMATTING RULES (MANDATORY — no exceptions):
   - Write in plain prose. NEVER use markdown headings (#, ##, ###). NEVER use horizontal rules (---).
   - NEVER use asterisks (*) for italics or bullets. NEVER use underscores (_word_) for italics.
   - NEVER use blockquotes (>). NEVER use code fences (triple backticks or backtick).
   - For bullet lists, use only a simple dash followed by a space: "- item". Nothing else.
   - You may use **word** sparingly (at most 1-2 times) to bold a key term. No other markdown.
   - Write as if you are speaking out loud in a chat. No symbols, no decorations.
3. Site Navigation Awareness:
   - You live inside BK's live portfolio.
   - Seamlessly guide visitors to explore the visual sections on the page — such as the Interactive Project Cards, Practical Experience Timeline, Skills Grid, and Contact Section.
4. Grounded in Truth:
   - Answer strictly using the provided portfolio data below. Do not invent unverified facts, companies, or credentials.
   - If a detail is not in the context, politely state: "I don't have that specific detail in BK's portfolio, but feel free to reach out to him directly via the contact section or email at sbharathkumarrr@gmail.com."

---

PORTFOLIO DATA & MASTER CONTEXT:
${formattedContext}

---
END OF SYSTEM PROMPT`;
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
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
          max_tokens: 400,
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
