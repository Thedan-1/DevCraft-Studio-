import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Endpoint for Readme, Code Review, Refactor, and Commit Messages
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { task, input, language, context } = req.body;
    
    if (!input || typeof input !== "string" || !input.trim()) {
      return res.status(400).json({ error: "Input prompt or code is required." });
    }

    const ai = getGenAI();

    let systemPrompt = "You are a world-class senior software engineer and open-source project architect.";
    let prompt = input;

    if (task === "readme") {
      systemPrompt += " You generate clean, detailed, well-structured GitHub README.md content in Markdown format with badges, installation, architecture, and feature descriptions.";
      prompt = `Generate an impressive GitHub README.md for the following project description or code:\n\n${input}\n\nKey requirements: Include badges placeholder, Quick Start, Features, Project Structure, and License sections. Use markdown formatting.`;
    } else if (task === "explain") {
      systemPrompt += " You explain code clearly and concisely with key logic highlights, potential edge cases, and time/space complexity.";
      prompt = `Explain the following ${language || "code"} snippet step by step:\n\n\`\`\`${language || ""}\n${input}\n\`\`\``;
    } else if (task === "refactor") {
      systemPrompt += " You refactor code for performance, readability, type safety, and modern best practices.";
      prompt = `Refactor and improve the following ${language || "code"}. Provide the refactored code block along with brief explanations of the improvements:\n\n\`\`\`${language || ""}\n${input}\n\`\`\``;
    } else if (task === "commit") {
      systemPrompt += " You write clean, conventional commit messages (e.g. feat:, fix:, docs:, refactor:, perf:) based on git diff or change notes.";
      prompt = `Generate a concise Conventional Commit message (with a short title and bulleted description) for these changes:\n\n${input}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ result: response.text || "No response generated." });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to process AI request. Make sure GEMINI_API_KEY is configured." 
    });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevCraft Studio server running on http://localhost:${PORT}`);
  });
}

startServer();
