# Bk's Portfolio

A Vite + React 19 + TypeScript portfolio with an Express backend. Features a 3D Three.js scene, Framer Motion animations, Firebase (client SDK), and a Groq-powered AI chat assistant.

## Architecture

- **Frontend**: Vite dev server on port `5000` (`npm run dev`). Aliased `@/` -> `src/`. Tailwind v4 via `@tailwindcss/vite`.
- **Backend**: Express on port `3001` (`npm run backend` -> `tsx backend/server.ts`). Exposes `POST /api/chat` and `GET /health`.
- **Proxy**: Vite forwards `/api/*` to the backend (`http://localhost:3001`), so the browser only ever talks to port 5000.

## Workflows

- `Start application` — `npm run dev` (port 5000, webview)
- `Backend` — `npm run backend` (port 3001, console)

## Environment variables

- `GROQ_API_KEY` — required for the chat assistant (server-side only).
- `VITE_FIREBASE_*` — optional Firebase web client config; the app degrades gracefully if missing.

## Migrated from Vercel

- Removed reliance on `@vercel/node` request handlers at runtime — the same `chatHandler` is mounted under Express.
- Vite `server.host = 0.0.0.0` and `allowedHosts = true` for the Replit iframe proxy.
