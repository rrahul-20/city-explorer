import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to protect admin routes using a secret header.
 */
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const adminSecret = req.headers['x-admin-secret'];

    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin secret.' });
    }

    next();
};
