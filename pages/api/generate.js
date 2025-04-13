import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: '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'
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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Write a Depop or eBay listing with SEO title, aesthetic description, 8 hashtags, and bundle upsell.',
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
