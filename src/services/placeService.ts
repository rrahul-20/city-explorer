import type { Place } from '../types/place';
import { API_BASE_URL } from '../config/api';

const BASE_API_URL = `${API_BASE_URL}/api`;

/**
 * Fetches all places from the backend API.
 * @param signal AbortSignal to cancel the request.
 * @returns Promise with an array of Place objects.
 */
export async function fetchPlaces(signal?: AbortSignal): Promise<Place[]> {
    const response = await fetch(`${BASE_API_URL}/places`, { signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch places: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Fetches a single place by its ID from the backend API.
 * @param id The ID of the place to fetch.
 * @param signal AbortSignal to cancel the request.
 * @returns Promise with a Place object.
 */
export async function fetchPlaceById(id: string, signal?: AbortSignal): Promise<Place> {
    const response = await fetch(`${BASE_API_URL}/places/${id}`, { signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch place with ID ${id}: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Marks a place as saved in the backend.
 * @param id The ID of the place to save.
 * @returns Promise with the updated Place object.
 */
export async function savePlace(id: string): Promise<Place> {
    const response = await fetch(`${BASE_API_URL}/places/${id}/save`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error(`Failed to save place with ID ${id}: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Marks a place as unsaved in the backend.
 * @param id The ID of the place to unsave.
 * @returns Promise with the updated Place object.
 */
export async function unsavePlace(id: string): Promise<Place> {
    const response = await fetch(`${BASE_API_URL}/places/${id}/unsave`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error(`Failed to unsave place with ID ${id}: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Fetches all saved places from the backend API.
 * @param signal AbortSignal to cancel the request.
 * @returns Promise with an array of saved Place objects.
 */
export async function fetchSavedPlaces(signal?: AbortSignal): Promise<Place[]> {
    const response = await fetch(`${BASE_API_URL}/places/saved`, { signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch saved places: ${response.statusText}`);
    }
    return response.json();
}
