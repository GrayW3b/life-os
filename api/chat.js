// Vercel serverless function — proxies chat to Groq (free tier).
// The API key lives only here (server-side env var), never in the browser.
// Set GROQ_API_KEY in Vercel → Project → Settings → Environment Variables.

const MODEL = 'llama-3.3-70b-versatile';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'AI is not configured yet. Add GROQ_API_KEY in your Vercel project settings, then redeploy.',
    });
  }

  try {
    const { system, messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Build OpenAI-compatible message array for Groq.
    const groqMessages = [];
    if (system) {
      groqMessages.push({ role: 'system', content: String(system) });
    }
    messages
      .filter((m) => m && m.text)
      .forEach((m) => {
        groqMessages.push({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: String(m.text),
        });
      });

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
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
      return res.status(200).json({
        text: "I couldn't generate a response to that — try rephrasing.",
      });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
