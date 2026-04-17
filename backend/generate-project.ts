const SYSTEM_PROMPT = `You are an AI assistant that extracts project information from documentation files to create portfolio-ready project entries.

Your task is to analyze the provided document content and extract/generate the following fields:
- title: A concise, professional project title
- description: A 2-3 sentence portfolio-ready description highlighting what the project does and its key value
- technologies: An array of technologies/frameworks/tools used in the project
- liveDemoUrl: The live demo URL if mentioned (or empty string if not found)
- repositoryUrl: The GitHub/repository URL if mentioned (or empty string if not found)

RULES:
1. Use ONLY information found in the document - do not invent or hallucinate
2. If a field cannot be determined, leave it empty or use an empty array
3. Keep the description professional, concise, and portfolio-friendly
4. Extract ALL technologies mentioned (programming languages, frameworks, databases, tools, etc.)
5. Return ONLY valid JSON, no markdown or explanations

Respond with this exact JSON structure:
{
  "title": "string",
  "description": "string", 
  "technologies": ["string"],
  "liveDemoUrl": "string",
  "repositoryUrl": "string"
}`;

/**
 * Handle Project Generation from Doc (Express Handler)
 */
export async function generateProjectHandler(req: any, res: any) {
    try {
        const { documentContent } = req.body;

        if (!documentContent || typeof documentContent !== 'string') {
            return res.status(400).json({ error: 'Document content is required' });
        }

        console.log("🚀 Sending generation request to Groq...");

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Analyze this project documentation and extract the project details:\n\n${documentContent}` }
                ],
                temperature: 0.1,
                max_tokens: 1024,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("✅ Received generation response from Groq");

        const responseText = data.choices[0]?.message?.content;

        if (!responseText) {
            throw new Error('AI did not return a response');
        }

        const projectData = JSON.parse(responseText);

        return res.json({
            success: true,
            data: {
                title: projectData.title || '',
                description: projectData.description || '',
                technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
                liveDemoUrl: projectData.liveDemoUrl || '',
                repositoryUrl: projectData.repositoryUrl || '',
            }
        });
    } catch (error: any) {
        console.error('AI Generation error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate project details' });
    }
}
