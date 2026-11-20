export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const prompt = req.body?.prompt || req.body?.question || req.body?.message || '';
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  const models = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-2.5-flash-lite'];
  let lastError = null;

  for (const model of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await r.json();
      const answer = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (answer) return res.status(200).json({ answer });
      lastError = d;
    } catch (e) {
      lastError = String(e);
    }
  }
  return res.status(500).json({ error: 'No answer', detail: lastError });
}
