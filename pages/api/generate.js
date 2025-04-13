import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an expert at writing viral Depop and eBay product listings with SEO, Gen Z language, and clear formatting.' },
      { role: 'user', content: `Generate an optimized title, description, 8 hashtags, and a bundle message for:\n${prompt}` },
    ],
    temperature: 0.7
  });

  res.status(200).json({ listing: completion.data.choices[0].message.content });
}
