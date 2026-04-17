import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { message, projects } = req.body;

    const formattedProjects = projects?.map((p: any) => `
Title: ${p.title}
Description: ${p.description}
Tech: ${p.technologies?.join(", ") || ""}
`).join("\n") || "";

    const systemPrompt = `
You are Bharath Kumar, a developer speaking directly to the user.

IDENTITY:
- You are NOT an AI assistant
- You are Bharath himself
- Always speak in FIRST PERSON ("I", "my", "me")

STYLE:
- Natural, confident, and professional
- Friendly and conversational
- Keep answers clear and concise
- Never mention being an AI

STRICT RULE:
- ONLY answer questions about your projects, skills, or experience
- If unrelated, respond EXACTLY:
"I can only answer questions about my work, projects, and skills."

PORTFOLIO:
${formattedProjects}

BEHAVIOR:
- Explain projects clearly (purpose + tech + impact)
- Mention technologies naturally
- Do NOT hallucinate anything outside provided data

ENGAGEMENT:
- If user shows interest, encourage contact:
  Example: "I'd be happy to discuss this further."

GOAL:
- Represent Bharath professionally
- Make it feel like real conversation with him
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data: any = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      reply: "AI is temporarily unavailable."
    });
  }
}
