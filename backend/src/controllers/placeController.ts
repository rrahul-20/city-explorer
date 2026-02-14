import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getAllPlaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const places = await prisma.place.findMany();
        res.json(places);
    } catch (error) {
        next(error);
    }
};

export const getPlaceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const place = await prisma.place.findUnique({
            where: { id },
        });
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.json(place);
    } catch (error) {
        next(error);
    }
};

export const createPlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, category, city, rating, reviewCount, distance, image, description, mapUrl, lat, lng } = req.body;
        const newPlace = await prisma.place.create({
            data: {
                name,
                category,
                city,
                rating,
                reviewCount,
                distance,
                image,
                description,
                mapUrl,
                lat: lat || 0,
                lng: lng || 0,
            },
        });
        res.status(201).json(newPlace);
    } catch (error) {
        next(error);
    }
};

export const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, category, city, rating, reviewCount, distance, image, description, mapUrl, lat, lng } = req.body;
        const updatedPlace = await prisma.place.update({
            where: { id },
            data: {
                name,
                category,
                city,
                rating,
                reviewCount,
                distance,
                image,
                description,
                mapUrl,
                lat,
                lng,
            },
        });
        res.json(updatedPlace);
    } catch (error) {
        next(error);
    }
};

export const savePlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updatedPlace = await prisma.place.update({
            where: { id },
            data: { isSaved: true },
        });
        res.json(updatedPlace);
    } catch (error) {
        next(error);
    }
};

export const unsavePlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updatedPlace = await prisma.place.update({
            where: { id },
            data: { isSaved: false },
        });
        res.json(updatedPlace);
    } catch (error) {
        next(error);
    }
};

export const getSavedPlaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const places = await prisma.place.findMany({
            where: { isSaved: true },
        });
        res.json(places);
    } catch (error) {
        next(error);
    }
};

export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.place.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
