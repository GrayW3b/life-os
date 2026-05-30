// Vercel serverless function — generates the two Daily Brief cards via Groq.
// GET /api/feed?type=business  or  /api/feed?type=health
// Returns { items: [{ title, insight, action }, ... x5] }

const MODEL = 'llama-3.3-70b-versatile';

const GRAYSON = `The reader is Grayson: 30, married, first child due November 12, sole income provider, Denver. Account Manager with strong consultative sales and people skills, basic coding knowledge, ~15 hrs/week, ~$100/mo budget. Tone: realistic, educational, no fluff, no hype.`;

const PROMPTS = {
  business: `${GRAYSON}

Generate a Business & Markets briefing as a JSON object with an "items" array containing exactly 5 objects, covering in order:
1. A current market trend
2. An entrepreneurship opportunity
3. A finance / money-management concept worth knowing
4. Something useful for someone building income streams
5. One wild-card insight

Each object must have exactly these string fields:
- "title": short, bold-worthy headline
- "insight": 2 sentences in plain English — what it is and why it matters to Grayson
- "action": one concrete angle tailored to someone with a consultative sales background

This is education, not financial advice — never give specific buy/sell calls.`,

  health: `${GRAYSON}

Generate a Health & Wellness briefing as a JSON object with an "items" array containing exactly 5 objects, covering in order:
1. Strength / fitness
2. Nutrition
3. Sleep
4. Mental wellness
5. Longevity

Each object must have exactly these string fields:
- "title": short, bold-worthy headline
- "insight": 2 sentences, research-grounded, plain English
- "action": one concrete takeaway realistic for a busy person with ~3 hrs/week

This is general wellness education, NOT medical advice — never diagnose or prescribe; suggest seeing a professional for anything clinical.`,
};

export default async function handler(req, res) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'AI is not configured yet. Add GROQ_API_KEY in your Vercel project settings, then redeploy.',
    });
  }

  const type = req.query.type === 'health' ? 'health' : 'business';

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant. Always respond with valid JSON only — a JSON object with an "items" array. No markdown, no code fences, no extra text.',
          },
          {
            role: 'user',
            content: PROMPTS[type],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.85,
        max_tokens: 2048,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error?.message || 'AI request failed',
      });
    }

    const raw = data?.choices?.[0]?.message?.content || '{}';
    let items = [];
    try {
      const parsed = JSON.parse(raw);
      items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
      items = [];
    }

    return res.status(200).json({ items: items.slice(0, 5) });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
