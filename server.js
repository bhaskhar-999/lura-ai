import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// 🔥 Test route
app.get("/", (req, res) => {
  res.send("Lura AI backend running 🚀");
});

// 🔥 Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!GROQ_API_KEY) {
      return res.json({ reply: "Missing API key on server." });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: message }],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    res.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response from AI",
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

// 🔥 IMPORTANT for Railway
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});