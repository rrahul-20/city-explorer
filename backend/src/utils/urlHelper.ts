/**
 * Helper to parse latitude and longitude from Google Maps URLs.
 */
export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Extracts coordinates from Google Maps URL.
 * Supports:
 * - ?q=LAT,LNG
 * - @LAT,LNG
 * 
 * @param url The Google Maps URL string.
 * @returns Coordinates object { lat, lng }.
 * @throws Error if parsing fails.
 */
export function parseCoordinatesFromGoogleMapsUrl(url: string): Coordinates {
    try {
        // Attempt 1: Check for @LAT,LNG format
        // Example: https://www.google.com/maps/@11.2588,75.7804,15z
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) {
            return {
                lat: parseFloat(atMatch[1]),
                lng: parseFloat(atMatch[2]),
            };
        }

        // Attempt 2: Check for ?q=LAT,LNG format
        // Example: https://maps.google.com/?q=11.2588,75.7804
        const urlObj = new URL(url);
        const qParam = urlObj.searchParams.get('q');
        if (qParam) {
            const parts = qParam.split(',');
            if (parts.length >= 2) {
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                    return { lat, lng };
                }
            }
        }

        throw new Error('Could not parse coordinates from the provided Google Maps URL.');
    } catch (error: any) {
        if (error instanceof Error) throw error;
        throw new Error('Invalid URL provided.');
    }
}
