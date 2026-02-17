import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY not set in .env");
  process.exit(1);
}

const API_KEY = process.env.GROQ_API_KEY;

app.post("/get-hint", async (req, res) => {
  const { questionName } = req.body;

  if (!questionName) {
    return res.status(400).json({ error: "No question name provided" });
  }

  try {
    const formattedQuestion = questionName.split("-").join(" ");

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
              content:
                "You are a coding mentor. Give short hints only, never full solutions.",
            },
            {
              role: "user",
              content: `Give a 6-word hint for solving the LeetCode problem "${formattedQuestion}".`,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return res.status(500).json({ error: "Groq API error", details: data });
    }

    const hint = data.choices[0].message.content;

    res.json({ hint: hint.trim() });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
