export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const prompt = req.body?.prompt || req.body?.question || req.body?.message || '';
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const d = await r.json();
    const answer = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!answer) return res.status(500).json({ error: 'No answer', detail: d });
    return res.status(200).json({ answer });

  } catch (e) {
    return res.status(500).json({ error: 'Server error', detail: String(e) });
  }
}
