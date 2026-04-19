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

export const AI_CONFIG = {
  MODEL: "llama-3.1-8b-instant",
  API_URL: "https://api.groq.com/openai/v1/chat/completions",
} as const;

export const APP_CONFIG = {
  PROJECT_LIMIT: 50,
  CHAT_LIMIT: 10,
} as const;
