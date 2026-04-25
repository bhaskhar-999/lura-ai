import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 API KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ✅ HEALTH CHECK (VERY IMPORTANT FOR RAILWAY)
app.get("/", (req, res) => {
  res.send("OK");
});

// 🤖 CHAT ROUTE
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!GROQ_API_KEY) {
      return res.json({ reply: "Missing API key" });
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
          messages: [
            { role: "user", content: message }
          ],
        }),
      }
    );

    const data = await response.json();

    res.json({
      reply: data?.choices?.[0]?.message?.content || "No response",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

// 🚀 PORT (IMPORTANT)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});