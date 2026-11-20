export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const prompt = req.body?.prompt || req.body?.question || req.body?.message || '';
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  const systemInstruction = `You are MINBAR-AI HUB, an Islamic assistant. Answer in plain text only. Do NOT use markdown. Do NOT use **, *, ###, #, or backticks. Use line breaks for paragraphs. For emphasis, use CAPITAL LETTERS.\n\nUser question: `;

  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemInstruction + prompt }] }] })
      });
      const d = await r.json();
      let answer = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (answer) {
        answer = answer
          .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/###\s*/g, '')
          .replace(/##\s*/g, '')
          .replace(/^#\s*/gm, '')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`{1,3}/g, '')
          .trim();
        return res.status(200).json({ answer });
      }
      lastError = d;
    } catch (e) {
      lastError = String(e);
    }
  }
  return res.status(500).json({ error: 'No answer', detail: lastError });
}
