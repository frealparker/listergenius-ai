import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at writing viral product listings for Depop and eBay. Include an optimized title, aesthetic description, 8 relevant hashtags, and a bundle message. Use Gen Z, Y2K, and SEO-friendly language.',
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
