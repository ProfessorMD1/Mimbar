export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { question } = req.body || {};
  if (!question) return res.json({ answer: 'Please type a question.' });

  const system = "You are Mimbar AI, a respectful Islamic assistant for Nigerian Muslims. Answer in clear, simple English with Hausa/Arabic terms where helpful. Base answers on Qur'an and authentic Sunnah, mention madhhab differences respectfully when relevant. Never give fatwa as final ruling - advise to confirm with a local Imam. Keep answers short, warm, and useful for khutbah and daily life.";

  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: question }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
    })
  });
  const data = await r.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Mimbar AI is busy. Try again.';
  res.json({ answer });
}
