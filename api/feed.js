// Vercel serverless function — generates structured AI briefings via xAI Grok.
// GET /api/feed?type=business  or  /api/feed?type=health
// Returns { items: [{ title, insight, action }, ...x5] }

const MODEL   = 'grok-3';
const API_URL = 'https://api.x.ai/v1/chat/completions';

const GRAYSON = `The reader is Grayson: 30, married, first child due November 12, sole income provider, Denver. Account Manager with strong consultative sales skills, basic coding knowledge. ~15 hrs/week, ~$100/mo budget. Tone: realistic, educational, no fluff.`;

const PROMPTS = {
  business: `${GRAYSON}

Generate a Business & Markets briefing as a JSON object with an "items" array of exactly 5 objects covering:
1. A current market trend
2. An entrepreneurship opportunity
3. A finance / money-management concept
4. Something useful for building income streams
5. One wildcard insight

Each object must have these string fields only:
- "title": short headline
- "insight": 2 plain-English sentences — what it is and why it matters to Grayson
- "action": one concrete angle for someone with consultative sales background

Education only — no specific buy/sell advice.`,

  health: `${GRAYSON}

Generate a Health & Wellness briefing as a JSON object with an "items" array of exactly 5 objects covering:
1. Strength / fitness
2. Nutrition
3. Sleep
4. Mental wellness
5. Longevity

Each object must have these string fields only:
- "title": short headline
- "insight": 2 research-grounded plain-English sentences
- "action": one realistic takeaway for someone with ~3 hrs/week

General wellness education only — never diagnose or prescribe; refer to professionals for clinical questions.`,
};

export default async function handler(req, res) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'AI not configured. Add XAI_API_KEY in Vercel project settings.',
    });
  }

  const type = req.query.type === 'health' ? 'health' : 'business';

  try {
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${key}`,
      },
      body: JSON.stringify({
        model:    MODEL,
        messages: [
          {
            role:    'system',
            content: 'Respond with valid JSON only — a JSON object with an "items" array. No markdown, no code fences, no extra text.',
          },
          {
            role:    'user',
            content: PROMPTS[type],
          },
        ],
        response_format: { type: 'json_object' },
        temperature:     0.85,
        max_tokens:      2048,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error?.message || 'AI request failed',
      });
    }

    let items = [];
    try {
      const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
      items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch { items = []; }

    return res.status(200).json({ items: items.slice(0, 5) });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
