import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { geminiService } from './services/geminiService.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Middleware to parse JSON payloads
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Trip Generation Endpoint
app.post('/api/generate-trip', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    // Body Validation
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'A valid text prompt is required in the body payload.' });
      return;
    }

    if (prompt.trim().length < 10) {
      res.status(400).json({ error: 'Your trip description is too short (minimum 10 characters).' });
      return;
    }

    console.log(`✈️ Generating itinerary for request: "${prompt.slice(0, 60)}..."`);
    
    // Call generative service (handles Gemini call / fallback internally)
    const itinerary = await geminiService.generateTrip(prompt);

    res.status(200).json(itinerary);
  } catch (error) {
    console.error('❌ Express handler error in /api/generate-trip:', error);
    res.status(500).json({
      error: 'An internal server error occurred while crafting your trip itinerary.',
    });
  }
});

// Start listening
app.listen(port, () => {
  console.log(`🚀 PlanSmart AI Server successfully listening on http://localhost:${port}`);
  console.log(`👉 Backend accepts CORS requests from: ${allowedOrigin}`);
});
