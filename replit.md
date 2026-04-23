# Portfolio

## Overview
A Vite + React 19 + TypeScript portfolio site with an Express backend that proxies an AI chat endpoint (Groq) and a Firebase-backed data layer.

## Stack
- Frontend: Vite 6, React 19, TailwindCSS 4, Framer Motion, Three.js, Firebase
- Backend: Express 5 (TypeScript via tsx)
- AI: Groq API
- Data: Firebase / Firestore

## Replit Setup
- Frontend (Vite) runs on port 5000 (webview), bound to 0.0.0.0 with `allowedHosts: true` for the Replit iframe proxy.
- Backend (Express) runs on port 3001 (console).
- Vite dev server proxies `/api/*` -> `http://localhost:3001`.
- Workflows:
  - `Start application`: `npm run dev` (port 5000)
  - `Backend`: `npm run backend` (port 3001)

## Environment Variables
See `.env.example`. Required for full functionality:
- `GROQ_API_KEY` — server-side AI chat
- `VITE_FIREBASE_*` — client-side Firebase config

## Notes
- The legacy `api/chat.ts` (Vercel Edge function) is unused on Replit; the Express backend at `backend/chat.ts` serves `/api/chat` instead.
- `vercel.json` is no longer used by the runtime.
