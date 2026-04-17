export default async function handler(req: Request) {
  try {
    const { message } = await req.json();

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error("❌ Missing GROQ_API_KEY");
      return new Response(JSON.stringify({
        reply: "Server misconfiguration"
      }), { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful portfolio assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("Groq response:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("🔥 API ERROR:", error);

    return new Response(JSON.stringify({
      reply: "AI is temporarily unavailable."
    }), { status: 500 });
  }
}
