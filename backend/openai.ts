import OpenAI from 'openai';

// Initialize OpenAI client
// Get API key from https://platform.openai.com/api-keys
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
