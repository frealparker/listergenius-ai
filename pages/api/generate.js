import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Debugging: Check if API key is loaded
console.log('API Key Check:', process.env.OPENAI_API_KEY ? 'Found' : 'Missing');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4', // Change to 'gpt-3.5-turbo' if needed
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at writing viral Depop and eBay product listings. Include an optimized title, a descriptive aesthetic, 8 hashtags, and a bundle upsell message. Use SEO and Gen Z lingo.',
        },
        {
          role: 'user',
          content: `Write a product listing for:\n${prompt}`,
        },
      ],
      temperature: 0.7,
    });

    const result = completion.data.choices[0].message.content;
    res.status(200).json({ listing: result });
  } catch (err) {
    console.error('OpenAI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate listing.' });
  }
}

