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
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
  ],
  API_URL: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
} as const;

export const GROQ_CONFIG = {
  MODELS: [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ],
  MODEL: "llama-3.3-70b-versatile",
  API_URL: "https://api.groq.com/openai/v1/chat/completions",
} as const;

// Default configuration for AI
export const AI_CONFIG = {
  MODEL: "gemini-2.0-flash",
  API_URL: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
} as const;

export const APP_CONFIG = {
  PROJECT_LIMIT: 50,
  CHAT_LIMIT: 10,
} as const;
