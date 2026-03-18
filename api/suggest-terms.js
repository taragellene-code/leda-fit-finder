export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const { text, type } = req.body;
  if (!text) {
    return res.status(200).json({ error: "No text provided", terms: [] });
  }
 
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ error: "API key not configured", terms: [] });
  }
 
  const prompt = type === "comments"
    ? `You help high school students from under-resourced communities research colleges. A student added these open-ended comments:\n\n${text}\n\nDistill into 1-4 concise college search terms for Niche or CollegeBoard. Think about what they really mean.\n\nRespond with ONLY a JSON array of strings, nothing else. Example: ["need-based financial aid", "warm climate"]`
    : `You help high school students research colleges. A student said:\n\n"${text}"\n\nDistill into 1-4 concise college search terms. Think about what they really mean:\n- "I don't want to feel like a number" -> "small class sizes"\n- "My family can't help me pay" -> "generous financial aid"\n\nRespond with ONLY a JSON array of strings, nothing else. Example: ["need-based financial aid", "warm climate"]`;
 
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
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
    console.log("Status:", response.status, "Body:", JSON.stringify(data).substring(0, 300));
 
    if (!response.ok) {
      return res.status(200).json({ error: data?.error?.message || "API error", terms: [] });
    }
 
    const raw = data?.content?.[0]?.text;
    if (!raw) {
      return res.status(200).json({ error: "Empty response", terms: [] });
    }
 
    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    let terms;
    try {
      terms = JSON.parse(clean);
    } catch (e) {
      const m = clean.match(/\[.*\]/s);
      terms = m ? JSON.parse(m[0]) : [];
    }
 
    if (!Array.isArray(terms)) terms = [];
    return res.status(200).json({ terms });
  } catch (err) {
    console.error("Error:", err);
    return res.status(200).json({ error: err.message, terms: [] });
  }
}
}
