import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatHandler } from './chat.js';
import { generateProjectHandler } from './generate-project.js';
import { uploadHandler, deleteUploadHandler } from './upload.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.post('/api/chat', chatHandler);
app.post('/api/generate-project', generateProjectHandler);
app.post('/api/upload', uploadHandler);
app.delete('/api/upload', deleteUploadHandler);

// Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`- POST /api/chat`);
    console.log(`- POST /api/generate-project`);
    console.log(`- POST /api/upload`);
});
