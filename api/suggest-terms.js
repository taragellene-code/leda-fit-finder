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

  var prompt;
  if (type === "comments") {
    prompt = "You help high school students research colleges. A student added these comments:\n\n" + text + "\n\nDistill into 1-4 concise college search terms.\n\nRespond with ONLY a JSON array of strings. No explanation, no markdown. Example: [\"financial aid\", \"warm climate\"]";
  } else {
    prompt = "You help high school students research colleges. A student said:\n\n\"" + text + "\"\n\nDistill into 1-4 concise college search terms. Think about what they really mean.\n\nRespond with ONLY a JSON array of strings. No explanation, no markdown. Example: [\"financial aid\", \"warm climate\"]";
  }

  try {
    var body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    };

    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      var errText = await response.text();
      return res.status(200).json({ error: "API " + response.status + ": " + errText.substring(0, 300), terms: [] });
    }

    var data = await response.json();
    var raw = "";
    if (data.content && data.content.length > 0 && data.content[0].text) {
      raw = data.content[0].text;
    }

    if (!raw) {
      return res.status(200).json({ error: "Empty response from Claude", terms: [] });
    }

    var clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      var arr = JSON.parse(clean);
      if (Array.isArray(arr)) {
        return res.status(200).json({ terms: arr });
      }
      return res.status(200).json({ terms: [] });
    } catch (parseErr) {
      var match = clean.match(/\[[\s\S]*\]/);
      if (match) {
        var arr2 = JSON.parse(match[0]);
        if (Array.isArray(arr2)) {
          return res.status(200).json({ terms: arr2 });
        }
      }
      return res.status(200).json({ error: "Parse failed: " + clean.substring(0, 100), terms: [] });
    }
  } catch (err) {
    return res.status(200).json({ error: "Server error: " + err.message, terms: [] });
  }
}
