export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, type } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  let prompt;
  if (type === "comments") {
    prompt = `You help high school students from under-resourced communities research colleges. A student filled out a college fit questionnaire and added these open-ended comments:

${text}

Distill their comments into 1-4 concise, practical college search terms. These should be terms a student could type into Niche, CollegeBoard, or a college website. Think about what they really mean, even if they didn't say it cleanly. Skip anything too vague to be actionable.

Return ONLY a JSON array of strings, no explanation. Example: ["need-based financial aid", "warm climate"]`;
  } else {
    prompt = `You help high school students from under-resourced communities research colleges. A student just told you what else matters to them:

"${text}"

Distill this into 1-4 concise, practical college search terms a student could type into Niche, CollegeBoard, or a college website. Think about what they really mean:
- "I don't want to feel like a number" -> "small class sizes"
- "My family can't help me pay" -> "generous financial aid"
- "I want somewhere warm where people are chill" -> "warm climate", "laid-back campus culture"

Return ONLY a JSON array of strings. Example: ["need-based financial aid", "warm climate"]`;
  }

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
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json([]);
  }
}
