export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) return Response.json({ answer: 'Please type a question.' });

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
    return Response.json({ answer });
  } catch (e) {
    return Response.json({ answer: 'Connection error. Try again.' });
  }
}
