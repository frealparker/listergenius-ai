import { Configuration, OpenAIApi } from 'openai';

// ⛔ Replace this with your actual OpenAI key — no spaces, no weird characters
const configuration = new Configuration({
  apiKey: 'apiKey: process.env.OPENAI_API_KEY, // ✅ Secure environment variable usage
,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages: [
        {
          role: 'system',
          content:
            'You are a professional SEO listing expert. Create a viral Depop or eBay listing including: 1) Title, 2) Description, 3) 8 Hashtags, 4) Bundle Offer. Use Gen Z tone and aesthetic keywords.',
        },
        {
          role: 'user',
          content: `Write a product listing for:\n${prompt}`,
        },
      ],
      temperature: 0.7,
    });

    const result = response.data.choices[0].message.content;
    res.status(200).json({ listing: result });
  } catch (err) {
    console.error('OpenAI API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate listing.' });
  }
}
