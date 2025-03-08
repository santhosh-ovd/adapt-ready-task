import express, { Application } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import cors from 'cors';
import authRouter from './router/auth/index';
import dishesRouter from './router/dishes/index';

const app: Application = express();

// CORS configuration for development
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware before other middlewares
app.use(cors(corsOptions));
app.use(express.json());

/**
 * Health check endpoint to verify API is running
 * @returns 200 OK with status message
 */
const healthCheck: RequestHandler = (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};


// Public routes
app.get('/health', healthCheck);
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/dishes', dishesRouter);

// 404 handler should be last
const notFoundHandler: RequestHandler = (req, res) => {
  console.log('404 for path:', req.path);
  res.status(404).json({ error: `Path ${req.path} not found` });
};

app.use(notFoundHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});