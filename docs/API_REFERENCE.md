# API Reference

All API endpoints in BKFILES for backend functionality.

## 1. POST /api/chat

**Purpose:** AI-powered chat with portfolio context

### Request
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What projects have you built?"
    },
    {
      "role": "assistant",
      "content": "I've built..."
    },
    {
      "role": "user",
      "content": "Tell me more about X"
    }
  ]
}
```

### Response (200 OK)
```json
{
  "role": "assistant",
  "content": "Based on my portfolio, I've built projects including...",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 75,
    "total_tokens": 225
  }
}
```

### Error Responses
```json
// 400 Bad Request
{ "error": "Messages array is required" }

// 500 Internal Server Error
{ "error": "Failed to process chat message" }
```

### How It Works
1. Accepts chat message history
2. Fetches portfolio context from Firestore (projects, skills, experiences)
3. Builds system prompt with context
4. Sends to OpenAI GPT-4o-mini
5. Returns AI response

### Frontend Usage
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
});
const data = await response.json();
console.log(data.content); // AI response
```

---

## 2. POST /api/generate-project

**Purpose:** Extract project details from documentation using AI

### Request
```json
{
  "documentContent": "# My Project\n\nBuilt with React, Firebase...\nLive: https://project.app\nGithub: https://github.com/user/project"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "title": "My Project",
    "description": "A web application built with modern technologies.",
    "technologies": ["React", "Firebase", "TypeScript"],
    "liveDemoUrl": "https://project.app",
    "repositoryUrl": "https://github.com/user/project"
  }
}
```

### Error Responses
```json
// 400 Bad Request
{ "error": "Document content is required" }
{ "error": "Document is too large. Maximum 50,000 characters." }

// 500 Internal Server Error
{ "error": "Failed to parse AI response" }
{ "error": "Failed to generate project details" }
```

### Constraints
- Accepts: `.md` and `.txt` files
- Max size: 50KB
- Returns: JSON with project metadata
- AI Model: GPT-4o-mini with JSON mode

### Frontend Usage
```typescript
const file = new File([content], 'project.md', { type: 'text/markdown' });
const response = await fetch('/api/generate-project', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    documentContent: await file.text() 
  })
});
const { success, data, error } = await response.json();
```

---

## 3. POST /api/upload

**Purpose:** Upload images to Cloudinary

### Request
```
FormData:
  - file: [File] (required)
  - folder: string (optional, default: "portfolio")
```

### Response (200 OK)
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/cloud/image/upload/v1234567890/portfolio/projects/abc123.jpg",
  "public_id": "portfolio/projects/abc123",
  "width": 1200,
  "height": 800
}
```

### Error Responses
```json
// 400 Bad Request
{ "error": "No file provided" }

// 500 Internal Server Error
{ "error": "Failed to upload image" }
```

### Features
- Auto quality optimization
- Auto format conversion
- HTTPS secure URLs
- Cloudinary storage

### Frontend Usage
```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('folder', 'portfolio/projects');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const { success, url, public_id } = await response.json();
console.log("Image URL:", url);
```

---

## 4. DELETE /api/upload

**Purpose:** Delete images from Cloudinary

### Request
```
DELETE /api/upload?public_id=portfolio/projects/abc123
```

### Response (200 OK)
```json
{
  "success": true,
  "result": {
    "result": "ok"
  }
}
```

### Error Responses
```json
// 400 Bad Request
{ "error": "No public_id provided" }

// 500 Internal Server Error
{ "error": "Failed to delete image" }
```

### Frontend Usage
```typescript
const response = await fetch(`/api/upload?public_id=${publicId}`, {
  method: 'DELETE'
});
const { success } = await response.json();
```

---

## Authentication

- **Chat API:** Public (no authentication required)
- **Generate Project:** Public (no authentication required)
- **Upload:** Public (no authentication required)
- **Delete:** Public (no authentication required)

> ⚠️ **Note:** All APIs are currently public. For production, add:
> - Firebase token verification
> - Rate limiting
> - CORS restrictions
> - Input validation

---

## Rate Limiting (Recommended)

For production, implement rate limiting:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 req/hour
});

export async function POST(request: NextRequest) {
  const ip = request.ip || "unknown";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // Continue with API logic...
}
```

---

## Testing with cURL

### Chat API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}]}'
```

### Generate Project
```bash
curl -X POST http://localhost:3000/api/generate-project \
  -H "Content-Type: application/json" \
  -d '{"documentContent":"# My Project\nBuilt with React"}'
```

### Upload Image
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@image.jpg" \
  -F "folder=portfolio"
```

### Delete Image
```bash
curl -X DELETE "http://localhost:3000/api/upload?public_id=portfolio/image123"
```

---

Last Updated: April 17, 2026
