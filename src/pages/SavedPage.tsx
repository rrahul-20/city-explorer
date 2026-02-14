import { useState, useEffect } from 'react';
import { fetchSavedPlaces, savePlace, unsavePlace } from '../services/placeService';
import PlaceCard from '../components/common/PlaceCard';
import { SavedIcon } from '../components/common/Icons';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import type { Place } from '../types/place';

export default function SavedPage() {
    const navigate = useNavigate();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadPlaces = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchSavedPlaces(controller.signal);
                setPlaces(data);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setError('Failed to load saved places.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPlaces();

        return () => controller.abort();
    }, []);

    const handleToggleSave = async (id: string, currentSavedState: boolean) => {
        // Optimistic update
        setPlaces(prev => prev.map(p =>
            p.id === id ? { ...p, isSaved: !currentSavedState } : p
        ));

        try {
            const updatedPlace = currentSavedState
                ? await unsavePlace(id)
                : await savePlace(id);

            // If unsaved, remove from list immediately
            if (!updatedPlace.isSaved) {
                setPlaces(prev => prev.filter(p => p.id !== id));
            } else {
                // Should not really happen on SavedPage if we only unsave, but good for consistency
                setPlaces(prev => prev.map(p =>
                    p.id === id ? updatedPlace : p
                ));
            }
        } catch (err) {
            console.error('Failed to toggle save:', err);
            // Revert on error
            setPlaces(prev => prev.map(p =>
                p.id === id ? { ...p, isSaved: currentSavedState } : p
            ));
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
            <div className="max-w-screen-xl mx-auto space-y-6">
                <header className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                        <SavedIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Saved Places</h1>
                </header>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-10 h-10 border-4 border-neutral-800 border-t-white rounded-full animate-spin mb-4" />
                        <p className="text-neutral-500">Loading your collection...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                        <p className="text-red-400 font-medium mb-3">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    places.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {places.map(place => (
                                <PlaceCard
                                    key={place.id}
                                    {...place}
                                    onToggleSave={handleToggleSave}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
                                <SavedIcon className="w-8 h-8 text-neutral-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">No saved places yet</h2>
                                <p className="text-neutral-500 mt-1 max-w-xs mx-auto">
                                    Start exploring and save your favorite places to create your personal collection.
                                </p>
                            </div>
                            <Button onClick={() => navigate('/')}>
                                Explore Places
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
