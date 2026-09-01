type Beat = {
  id: string;
  title: string;
  description: string;
  timing: string;
};

type RequestBody = {
  concept?: string;
  genre?: string;
  beats?: Beat[];
  direction?: string;
};

function promptFor(body: RequestBody) {
  if (body.beats?.length && body.direction) {
    return `你是一位专业的短剧故事结构顾问。请在保留故事核心设定的基础上，重新调整下面的15个故事节拍。

故事概念：${body.concept}
类型：${body.genre}
修改方向：${body.direction}

当前节拍：
${JSON.stringify(body.beats)}

请只返回JSON数组。保持15个节拍、原有字段和时间占比格式，每个描述具体到场景和人物行动。`;
  }

  return `你是一位专业的故事结构顾问。请根据以下故事概念，生成一个完整的故事节拍结构。

故事概念：${body.concept}
类型：${body.genre}

请使用“救猫咪”(Save the Cat)结构模型，生成15个关键故事节拍。每个节拍包含标题、具体场景描述和时间占比。
请只返回JSON数组，每个节拍格式如下：
{"title":"开场 Opening Image","description":"具体场景描述","timing":"0-1%"}`;
}

function parseBeats(content: unknown): Beat[] | null {
  if (typeof content !== 'string') return null;

  const cleaned = content.replace(/```(?:json)?/gi, '').trim();
  const candidates = [cleaned];
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      const beats = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && 'beats' in parsed && Array.isArray(parsed.beats)
          ? parsed.beats
          : null;
      if (!beats) continue;

      return beats.map((beat: any, index: number) => ({
        id: String(index + 1),
        title: String(beat.title ?? `节拍 ${index + 1}`),
        description: String(beat.description ?? ''),
        timing: String(beat.timing ?? ''),
      }));
    } catch {
      // Try the next JSON shape or extracted array.
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('仅支持 POST 请求');

  const body = req.body as RequestBody;
  if (!body?.concept?.trim() || !body.genre?.trim()) {
    return res.status(400).send('故事概念和类型不能为空');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).send('服务端尚未配置 DEEPSEEK_API_KEY');

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: promptFor(body) }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (response.status === 401) return res.status(502).send('AI 服务认证失败，请检查 DEEPSEEK_API_KEY');
    if (response.status === 429) return res.status(502).send('AI 服务额度或频率受限，请稍后重试');
    if (!response.ok) return res.status(502).send('AI 服务请求失败');
    const data = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const beats = parseBeats(data.choices?.[0]?.message?.content);
    if (!beats?.length) return res.status(502).send('AI 返回格式无法解析');
    return res.status(200).json(beats);
  } catch {
    return res.status(500).send('生成失败，请稍后重试');
  }
}
