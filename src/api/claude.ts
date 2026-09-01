export interface Beat {
  id: string;
  title: string;
  description: string;
  timing: string;
}

async function requestStoryBeats(payload: {
  concept: string;
  genre: string;
  beats?: Beat[];
  direction?: string;
}): Promise<Beat[]> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'API 请求失败');
  }

  return response.json();
}

export function generateStoryBeats(concept: string, genre: string): Promise<Beat[]> {
  return requestStoryBeats({ concept, genre });
}

export function refineStoryBeats(
  concept: string,
  genre: string,
  beats: Beat[],
  direction: string,
): Promise<Beat[]> {
  return requestStoryBeats({ concept, genre, beats, direction });
}
