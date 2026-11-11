import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { setupMcpRoutes } from './server/mcp.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Shared server-side Gemini client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Initialize Model Context Protocol (MCP) Server endpoints
setupMcpRoutes(app, {
  ai,
  appUrl: process.env.APP_URL || 'http://localhost:3000',
});

// API Route: AI Instant Doubt Solver (Camera OCR / Voice / Text)
app.post('/api/solve-doubt', async (req, res) => {
  try {
    const { question, imageBase64, mimeType, classLevel = 'ALL', language = 'EN' } = req.body;

    if (!question && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either a question string or an image.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Falling back to local offline solution database.',
      });
    }

    const promptText = `
You are the master doubt-solving AI engine for 'studys', the 100% free learning and doubt-solving app for NCERT, CBSE, State Boards (Bihar, UP, Rajasthan, MP, Telangana), IIT JEE (Mains & Advanced), NEET, and Govt Exams (SSC, IBPS, NDA, CTET).

User requested class/level: ${classLevel}
Language preference: ${language === 'HI' ? 'Hindi Medium' : 'English + Hindi Bilingual'}

Question / Equation / Query: ${question || 'Analyze the provided image containing an academic question, equation, diagram, or circuit.'}

Please solve this question with extreme clarity and educational rigor. Provide:
1. title: Clean problem statement title.
2. equation: The core mathematical equation, chemical reaction, or concept formula.
3. classLevel: Suitable class/exam (e.g. Class 12, Class 10, IIT JEE, NEET).
4. examTag: e.g. "IIT JEE / Class 12 Maths" or "NEET / Class 12 Physics".
5. bookSource: Referenced textbook (e.g., "NCERT Class 12 & Cengage", "RD Sharma", "KC Sinha").
6. subject: One of "Mathematics", "Physics", "Chemistry", "Biology", or "General Studies".
7. steps: An array of 3 to 5 clear, logical, step-by-step solution steps (labeled Step 1:, Step 2:, etc.) with exact calculations.
8. shortcut: A 5-to-10-second shortcut trick, mnemonic, or quick elimination method for competitive exams.
9. hindiSummary: A clear 1-2 sentence Hindi translation/explanation of the core solution for Hindi medium students.
10. boardTip: Important exam tip, marks weightage, or common trap to avoid.
`;

    let contents: any;
    if (imageBase64) {
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
            },
          },
          { text: promptText },
        ],
      };
    } else {
      contents = promptText;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Clear title of the question or problem' },
            equation: { type: Type.STRING, description: 'Core formula, equation, or balanced reaction' },
            classLevel: { type: Type.STRING, description: 'Target class or exam' },
            examTag: { type: Type.STRING, description: 'Exam category tag' },
            bookSource: { type: Type.STRING, description: 'Recommended textbook source' },
            subject: { type: Type.STRING, description: 'Subject name' },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step solution steps',
            },
            shortcut: { type: Type.STRING, description: 'Shortcut trick or 5-second hack' },
            hindiSummary: { type: Type.STRING, description: 'Hindi medium explanation summary' },
            boardTip: { type: Type.STRING, description: 'Board/JEE exam weightage and tip' },
          },
          required: ['title', 'equation', 'steps', 'shortcut', 'hindiSummary', 'boardTip'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      doubt: {
        id: 'ai_' + Date.now(),
        title: parsed.title || question || 'Scanned Problem Solution',
        equation: parsed.equation || 'Solution Derivation',
        classLevel: parsed.classLevel || classLevel,
        examTag: parsed.examTag || 'Competitive & Board Exam',
        bookSource: parsed.bookSource || 'NCERT & Standard Reference Textbooks',
        subject: parsed.subject || 'Science & Mathematics',
        steps: Array.isArray(parsed.steps) && parsed.steps.length > 0 ? parsed.steps : ['Step 1: Analyzed question.', 'Step 2: Computed exact solution.'],
        shortcut: parsed.shortcut || 'Master standard textbook properties to save time in exams.',
        hindiSummary: parsed.hindiSummary || 'हल चरणबद्ध रूप से प्रस्तुत किया गया है।',
        boardTip: parsed.boardTip || 'Frequently asked in Board & Entrance examinations.',
      },
    });
  } catch (error: any) {
    console.error('Gemini solve error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate solution via Gemini API.',
    });
  }
});

// Setup Vite Dev Middleware or Serve Production Bundle
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`studys app running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
