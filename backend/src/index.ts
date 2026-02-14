import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import placeRoutes from './routes/placeRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/places', placeRoutes);
app.use('/api/admin/places', adminRoutes);

// Root endpoint for testing
app.get('/', (req: Request, res: Response) => {
    res.send('City Explorer API is running');
});

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/places`);
});
