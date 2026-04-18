import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY not set in .env");
  process.exit(1);
}

const API_KEY = process.env.GROQ_API_KEY;

app.post("/get-hint", async (req, res) => {
  const { questionName, level, mode } = req.body;

  if (!questionName) {
    return res.status(400).json({ error: "No question name provided" });
  }

  try {
    const formattedQuestion = questionName.split("-").join(" ");
    const hintLevel = level || 1;

    let systemPrompt = "You are a coding mentor.";
    let userInstruction = "";

    if (mode === "solution") {
      systemPrompt = "You are a DSA expert. Provide the complete code solution to the user. Always return valid JSON.";
      userInstruction = `For the LeetCode problem '${formattedQuestion}', provide the full correct code implementation.
Return strictly as a JSON object where the key "hint" contains the full formatted code as a single plain-text string. Do NOT use nested objects or arrays for the code. Use standard escaped newlines. No alternative or optimized keys needed.`;
    } else if (hintLevel >= 3) {
      systemPrompt = "You are a DSA expert and coding mentor. Always return valid JSON.";
      userInstruction = `For the LeetCode problem '${formattedQuestion}', provide:
1. A short hint
2. One alternative approach
3. One optimized approach

Keep everything concise and DO NOT give full code.
Return strictly as a JSON object with keys: "hint", "alternative", "optimized".`;
    } else {
      systemPrompt = "You are a coding mentor. Always return valid JSON.";
      userInstruction = `Give a level ${hintLevel} hint for the LeetCode problem '${formattedQuestion}'. Do not reveal full solution.
Return strictly as a JSON object with key: "hint".`;
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userInstruction,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return res.status(500).json({ error: "Groq API error", details: data });
    }

    const jsonText = data.choices[0].message.content;
    const parsed = JSON.parse(jsonText);

    res.json({
      result: parsed.hint || "Here is your hint.",
      alternative: parsed.alternative || null,
      optimized: parsed.optimized || null
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/analyze-progress", async (req, res) => {
  const { questionName, code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const formattedQuestion = questionName ? questionName.split("-").join(" ") : "Unknown Problem";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a coding mentor. Analyze user progress and guide them without giving full solutions. Always return valid JSON."
          },
          {
            role: "user",
            content: `Analyze the user's code for the LeetCode problem "${formattedQuestion}".

Code:
${code}

Determine:
1. Progress level:
   - Level 1 → basic understanding missing
   - Level 2 → partial logic correct
   - Level 3 → close to correct

2. Return strictly as a JSON object:
{
  "level": 1,
  "hint": "...",
  "feedback": "..."
}

Rules:
- Do NOT give full solution
- Keep hint short (2-3 lines)
- Focus on logic gaps and edge cases`
          }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return res.status(500).json({ error: "Groq API error", details: data });
    }

    const text = data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        level: 1,
        hint: text,
        feedback: "",
      };
    }

    res.json(parsed);

  } catch (error) {
    console.error("Analyze Progress error:", error);
    res.status(500).json({ error: "Progress analysis failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
