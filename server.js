import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("Lura AI backend running 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(500).json({ reply: "Missing GROQ_API_KEY on server." });
    }

    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 700,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: "Groq error: " + data.error.message });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response from AI.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error occurred." });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lura AI backend running on port ${PORT}`);
});