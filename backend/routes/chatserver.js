// Small backend for the school chatbot. Keeps your API key off the website.
//
// Setup (in your project folder):
//   npm install express @anthropic-ai/sdk
//   export ANTHROPIC_API_KEY="your-key-here"
//   node server/chat-server.js
//
// Vite dev proxy (vite.config.js):
//   server: { proxy: { "/api": "http://localhost:3001" } }

import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(express.json({ limit: "20kb" }));

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
const MODEL = "claude-haiku-5-5";

// Put only facts you are sure about here. Add more as the school confirms them
// (fees, school hours, uniform, bus routes, admission dates, documents...).
const SCHOOL_FACTS = `
- Name: Baljagriti English Secondary School
- Address: Basudev Marga, Hetauda-2
- Phone: 057-590144, 057-590145, 057-590146
- Established: 2046 BS
- Grades: Play Group to Grade 10
- Website pages: /admissions, /academics, /facilities (includes bus facility), /calendar, /notices, /contact, /blog, /gallery
`;

const SYSTEM_PROMPT = `You are the website assistant for Baljagriti English Secondary School in Hetauda, Nepal. You answer questions from parents and students.

School facts you can rely on:
${SCHOOL_FACTS}

Rules:
- Answer the question directly in 1 to 3 short sentences, in plain text (no markdown, no bullet symbols).
- Use only the facts above. Never guess or invent fees, dates, seat availability, timings, rules, or names.
- If the answer is not in the facts (for example fees, a specific admission year, or bus routes), say the school office confirms that and give the phone number 057-590144.
- If the person writes in Nepali, reply in Nepali. Otherwise reply in English.
- Politely decline anything unrelated to the school.`;

// Basic per-IP rate limit: 20 messages per minute.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

app.post("/api/chat", async (req, res) => {
  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: "Too many messages. Try again soon." });
  }

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = raw
    .slice(-10)
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));

  // The API needs the conversation to start with, and end on, a user message.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Invalid messages." });
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    });
    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Assistant unavailable." });
  }
});

app.listen(3001, () => console.log("Chat API running on http://localhost:3001"));