import { Configuration, OpenAIApi } from 'openai';

// ⚠️ Replace with your real OpenAI API key for testing
const configuration = new Configuration({
  apiKey: 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, // your full OpenAI key here
});

const openai = new OpenAIApi(configuration);

// Debugging log
console.log('✅ API Key Check:', configuration.apiKey ? 'Found' : 'Missing');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Use 'gpt-4' if you’re sure your key has access
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in writing viral Depop and eBay product listings. Include a catchy title, detailed aesthetic description, 8 hashtags, and a bundle upsell message using Gen Z style.',
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
    console.error('❌ OpenAI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate listing.' });
  }
}
