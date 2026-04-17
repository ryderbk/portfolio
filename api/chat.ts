import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, projects } = req.body;
    
    console.log("📥 Incoming request message:", message);
    console.log("📥 Incoming request projects count:", projects?.length || 0);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are a helpful AI assistant for Bharath Kumar S's portfolio website. 
Your task is to answer questions about his projects based ONLY on the data provided below.

PROJECT DATA:
${JSON.stringify(projects || [], null, 2)}

INSTRUCTIONS:
1. Use ONLY the provided project data. If information is missing, politely say you don't have that information.
2. Be professional, concise, and friendly.
3. Answer ONLY based on the projects list. Do not hallucinate other details.
4. Keep responses under 150 words.`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    console.log("🚀 Sending request to Groq...");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Groq API error data:", errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Received response from Groq");
    
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("❌ No reply content in Groq response:", data);
      return res.status(500).json({ reply: "I couldn't generate a response. Please try again." });
    }

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('❌ Chat API Error:', error);
    return res.status(500).json({ 
      reply: "Something went wrong. Please try again later!",
      error: error.message 
    });
  }
}
