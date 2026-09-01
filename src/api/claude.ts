export interface Beat {
  id: string;
  title: string;
  description: string;
  timing: string;
}

export async function generateStoryBeats(
  concept: string,
  genre: string
): Promise<Beat[]> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  const prompt = `你是一位专业的故事结构顾问。请根据以下故事概念，生成一个完整的故事节拍结构。

故事概念：${concept}
类型：${genre}

请使用"救猫咪"(Save the Cat)结构模型，生成15个关键故事节拍。每个节拍包含：
1. 标题（中英文）
2. 具体针对这个故事的描述（50-100字）
3. 时间占比

请以JSON数组格式返回，每个节拍格式如下：
{
  "title": "开场 Opening Image",
  "description": "具体场景描述",
  "timing": "0-1%"
}

只返回JSON数组，不要其他内容。`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error('API 请求失败');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    const beats = JSON.parse(jsonMatch[0]);
    return beats.map((beat: any, index: number) => ({
      id: String(index + 1),
      title: beat.title,
      description: beat.description,
      timing: beat.timing,
    }));
  }

  throw new Error('Failed to parse response');
}
