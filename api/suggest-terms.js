export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", terms: [] });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ error: "No API key", terms: [] });
  }

  const text = req.body?.text;
  const type = req.body?.type;
  if (!text) {
    return res.status(200).json({ error: "No text", terms: [] });
  }

  const intro = "You help high school students research colleges.";
  const outro = "Respond with ONLY a JSON array of strings. No explanation, no markdown, no backticks. Example: [\"financial aid\", \"warm climate\"]";

  const prompt = type === "comments"
    ? intro + " A student added these comments:\n\n" + text + "\n\nDistill into 1-4 concise college search terms.\n\n" + outro
    : intro + " A student said:\n\n\"" + text + "\"\n\nDistill into 1-4 concise college search terms. Think about what they really mean.\n\n" + outro;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(200).json({ error: "API " + response.status, terms: [], raw: err.substring(0, 200) });
    }

    const data = await response.json();
    const raw = (data.content && data.content[0] && data.content[0].text) || "";

    if (!raw) {
      return res.status(200).json({ error: "Empty response", terms: [] });
    }

    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const arr = JSON.parse(clean);
      const terms = Array.isArray(arr) ? arr : [];
      return res.status(200).json({ terms: terms });
    } catch (e) {
      const m = clean.match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]);
        return res.status(200).json({ terms: Array.isArray(arr) ? arr : [] });
      }
      return res.status(200).json({ error: "Parse failed", terms: [], raw: clean.substring(0, 200) });
    }
  } catch (err) {
    return res.status(200).json({ error: err.message, terms: [] });
  }
}
