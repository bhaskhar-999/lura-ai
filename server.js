import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 API key from Railway (Environment Variables)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ✅ Test route (for browser check)
app.get("/", (req, res) => {
  res.send("Groq AI backend running 🚀");
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.json({ reply: "Server error occurred." });
  }
});

// 🔥 IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});