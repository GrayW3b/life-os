// Vercel serverless function — proxies chat to Google Gemini.
// The API key lives only here (server-side env var), never in the browser.
// Set GEMINI_API_KEY in Vercel → Project → Settings → Environment Variables.

const MODEL = 'gemini-2.0-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'AI is not configured yet. Add GEMINI_API_KEY in your Vercel project settings, then redeploy.',
    });
  }

  try {
    const { system, messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Map our {role:'user'|'model', text} history into Gemini's format.
    const contents = messages
      .filter((m) => m && m.text)
      .map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(m.text) }],
      }));

    const body = {
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };
    if (system) {
      body.systemInstruction = { parts: [{ text: String(system) }] };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error?.message || 'AI request failed',
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';

    if (!text) {
      // Most often a safety block or empty candidate.
      return res.status(200).json({
        text: "I couldn't generate a response to that — try rephrasing.",
      });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
