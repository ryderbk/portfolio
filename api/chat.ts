export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, projects, messages } = await req.json();
    const userMessage = message || (messages && messages[messages.length - 1]?.content);

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("🚀 Sending request to Groq (Edge Runtime)");

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
      { role: 'user', content: userMessage }
    ];

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
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("✅ Received response from Groq");
    
    const reply = data.choices[0]?.message?.content;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ 
      reply: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!",
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
