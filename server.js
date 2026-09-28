const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in environment variables.");
    process.exit(1);
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN
}));

app.use(express.json({ limit: "20kb" }));

const askLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many questions right now. Please try again in a minute." }
});

app.get("/", (req, res) => {
    res.json({ ok: true, service: "MY BUSINESS HUB AI" });
});

app.post("/ask", askLimiter, async (req, res) => {
    try {
        const question = typeof req.body.question === "string"
            ? req.body.question.trim()
            : "";

        if (!question) {
            return res.status(400).json({ error: "Please enter a question." });
        }

        if (question.length > 2000) {
            return res.status(400).json({ error: "Please keep the question under 2000 characters." });
        }

        const response = await client.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
            tools: [{ type: "web_search" }],
            input: [
                {
                    role: "system",
                    content:
                        "You are the AI assistant for MY BUSINESS HUB. " +
                        "Answer the user's question clearly, accurately and helpfully. " +
                        "Use web search for current, recent, changing, or location-specific information. " +
                        "Do not pretend to know current information without checking. " +
                        "If the question is ambiguous, briefly explain the ambiguity and answer the most reasonable interpretation. " +
                        "For calculations, show the essential steps. " +
                        "For school questions, explain at an appropriate student-friendly level. " +
                        "Do not invent facts or sources."
                },
                {
                    role: "user",
                    content: question
                }
            ]
        });

        res.json({
            answer: response.output_text || "I could not produce an answer. Please try again."
        });

    } catch (error) {
        console.error("AI request failed:", error);
        res.status(500).json({
            error: "The AI service could not answer the question right now."
        });
    }
});

app.listen(PORT, () => {
    console.log(`MY BUSINESS HUB AI backend is running on port ${PORT}`);
});
