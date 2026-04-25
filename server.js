import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
const app = express();

// 🔥 IMPORTANT: allow phone to connect
app.use(cors());
app.use(express.json());

// 👉 Put your Groq API key here
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ✅ Test route (VERY IMPORTANT for phone testing)
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

// 🔥 MOST IMPORTANT LINE (allows phone access)
app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:3001 🚀");
});