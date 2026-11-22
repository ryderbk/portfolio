/**
 * Application Constants
 * Centralized store for magic strings and configuration IDs.
 */

export const FIRESTORE_COLLECTIONS = {
  PROJECTS: "projects",
  SKILLS: "skills",
  MESSAGES: "messages",
  EXPERIENCES: "experiences",
  SITE_CONFIG: "siteConfig",
} as const;

export const GEMINI_CONFIG = {
  MODELS: [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ],
  API_URL: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
} as const;

export const GROQ_CONFIG = {
  MODEL: "llama-3.1-8b-instant",
  API_URL: "https://api.groq.com/openai/v1/chat/completions",
} as const;

// Default configuration for AI
export const AI_CONFIG = {
  MODEL: "gemini-3.1-flash-lite",
  API_URL: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
} as const;

export const APP_CONFIG = {
  PROJECT_LIMIT: 50,
  CHAT_LIMIT: 10,
} as const;
