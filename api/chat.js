// Vercel serverless function — proxies AI chat to xAI Grok.
// API key lives server-side only, never exposed to the browser.
// Set XAI_API_KEY in Vercel → Project → Settings → Environment Variables.

const MODEL   = 'grok-3';
const API_URL = 'https://api.x.ai/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.XAI_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'AI not configured. Add XAI_API_KEY in your Vercel project settings, then redeploy.',
    });
  }

  try {
    const { system, messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Build OpenAI-compatible message array.
    const payload = [];
    if (system) payload.push({ role: 'system', content: String(system) });
    messages
      .filter(m => m && m.text)
      .forEach(m => payload.push({
        role:    m.role === 'model' ? 'assistant' : 'user',
        content: String(m.text),
      }));

    const r = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${key}`,
      },
      body: JSON.stringify({
        model:       MODEL,
        messages:    payload,
        temperature: 0.7,
        max_tokens:  1024,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error?.message || 'AI request failed',
      });
    }

    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) {
      return res.status(200).json({ text: "I couldn't generate a response — try rephrasing." });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
