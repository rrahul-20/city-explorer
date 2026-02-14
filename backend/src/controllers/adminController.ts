import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { parseCoordinatesFromGoogleMapsUrl } from '../utils/urlHelper';

/**
 * Admin: Create a new place.
 * Automatically parses coordinates from Google Maps URL.
 */
export const createPlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, category, city, rating, reviewCount, description, image, mapUrl } = req.body;

        // 1. Basic validation
        if (!name || !category || !city || !mapUrl) {
            return res.status(400).json({ error: 'Missing required fields: name, category, city, mapUrl' });
        }

        // 2. Parse coordinates
        let coordinates;
        try {
            coordinates = parseCoordinatesFromGoogleMapsUrl(mapUrl);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }

        const { lat, lng } = coordinates;

        // 3. Create place
        const newPlace = await prisma.place.create({
            data: {
                name,
                category,
                city,
                rating: rating || 0,
                reviewCount: reviewCount || 0,
                description: description || '',
                image: image || '',
                mapUrl,
                lat,
                lng,
                distance: 0, // Placeholder
            },
        });

        res.status(201).json(newPlace);
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Delete a place.
 */
export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Check if place exists
        const place = await prisma.place.findUnique({
            where: { id },
        });

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        await prisma.place.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
