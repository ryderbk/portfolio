export async function chatHandler(req: any, res: any) {
  try {
    const { message } = req.body;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error("❌ Missing GROQ_API_KEY");
      return res.status(500).json({
        reply: "Server misconfiguration"
      });
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

    const data: any = await response.json();
    console.log("Groq response:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 API ERROR:", error);

    return res.status(500).json({
      reply: "AI is temporarily unavailable."
    });
  }
}
