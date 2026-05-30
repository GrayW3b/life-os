// Vercel serverless function — generates the two Daily Brief cards via Gemini.
// GET /api/feed?type=business  or  /api/feed?type=health
// Returns { items: [{ title, insight, action }, ... x5] }

const MODEL = 'gemini-2.0-flash';

const GRAYSON = `The reader is Grayson: 30, married, first child due November 12, sole income provider, Denver. Account Manager with strong consultative sales and people skills, basic coding knowledge, ~15 hrs/week, ~$100/mo budget. Tone: realistic, educational, no fluff, no hype.`;

const PROMPTS = {
  business: `${GRAYSON}

Generate a Business & Markets briefing as exactly 5 items covering, in order:
1. A current market trend
2. An entrepreneurship opportunity
3. A finance / money-management concept worth knowing
4. Something useful for someone building income streams
5. One wild-card insight

For each item: a short bold "title", a 2-sentence "insight" in plain English explaining why it matters, and one concrete "action" angle tailored to someone with a consultative sales background. This is education, not financial advice — never give specific buy/sell calls.`,

  health: `${GRAYSON}

Generate a Health & Wellness briefing as exactly 5 items covering, in order:
1. Strength / fitness
2. Nutrition
3. Sleep
4. Mental wellness
5. Longevity

For each item: a short bold "title", a 2-sentence research-grounded "insight", and one concrete "action" takeaway realistic for a busy person with ~3 hrs/week. This is general wellness education, NOT medical advice — never diagnose or prescribe; suggest seeing a professional for anything clinical.`,
};

export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'AI is not configured yet. Add GEMINI_API_KEY in your Vercel project settings, then redeploy.',
    });
  }

  const type = req.query.type === 'health' ? 'health' : 'business';

  try {
    const body = {
      contents: [{ role: 'user', parts: [{ text: PROMPTS[type] }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              insight: { type: 'STRING' },
              action: { type: 'STRING' },
            },
            required: ['title', 'insight', 'action'],
          },
        },
      },
    };

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

    const raw =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '[]';
    let items = [];
    try {
      items = JSON.parse(raw);
    } catch {
      items = [];
    }

    return res.status(200).json({ items: Array.isArray(items) ? items.slice(0, 5) : [] });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
