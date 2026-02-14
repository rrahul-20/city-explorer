/**
 * Place category types
 */
export type PlaceCategory = "beach" | "restaurant" | "heritage" | "shopping";

/**
 * Core Place interface
 * Single source of truth for place data structure
 */
export interface Place {
    id: string;
    name: string;
    category: PlaceCategory;
    city: string;
    rating: number;
    reviewCount: number;
    distance: number; // in kilometers
    image: string;
    description: string;
    isSaved: boolean;
    lat: number;
    lng: number;
    mapUrl?: string;
    tags?: string[];
}
