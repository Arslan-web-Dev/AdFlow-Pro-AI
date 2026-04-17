import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedAd {
  title: string;
  description: string;
  imagePrompt: string;
  category: string;
  tags: string[];
}

export async function generateAdContent(topic: string): Promise<GeneratedAd> {
  try {
    const prompt = `Generate a compelling advertisement for the following topic: "${topic}"

Please provide:
1. A catchy, attention-grabbing title (max 60 characters)
2. A persuasive description (100-150 words) that highlights benefits and creates urgency
3. A detailed image prompt for AI image generation (describe the visual scene, style, colors, mood)
4. A relevant category (e.g., Technology, Fashion, Food, Health, Entertainment, Business, Education)
5. 5-7 relevant tags for the ad

Format your response as JSON with this structure:
{
  "title": "...",
  "description": "...",
  "imagePrompt": "...",
  "category": "...",
  "tags": ["...", "...", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert advertising copywriter and creative director. You create compelling, high-converting advertisements with catchy headlines and persuasive descriptions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const generatedAd: GeneratedAd = JSON.parse(content);
    return generatedAd;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw new Error('Failed to generate ad content');
  }
}

export async function generateMultipleAds(topics: string[]): Promise<GeneratedAd[]> {
  const ads: GeneratedAd[] = [];
  
  for (const topic of topics) {
    try {
      const ad = await generateAdContent(topic);
      ads.push(ad);
    } catch (error) {
      console.error(`Failed to generate ad for topic: ${topic}`, error);
    }
  }
  
  return ads;
}

export async function generateAdSuggestions(category: string): Promise<string[]> {
  try {
    const prompt = `Generate 5 creative advertisement topics/ideas for the category: "${category}"

Each topic should be:
- Unique and creative
- Marketable and appealing
- Suitable for a sponsored ads marketplace

Return as a JSON array of strings.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a creative advertising strategist who generates innovative ad ideas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsed = JSON.parse(content);
    return parsed.topics || parsed.suggestions || [];
  } catch (error) {
    console.error('OpenAI suggestions error:', error);
    return [];
  }
}
