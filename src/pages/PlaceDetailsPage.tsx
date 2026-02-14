import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, SavedIcon, ArrowLeftIcon, MapPinIcon } from '../components/common/Icons';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { fetchPlaceById } from '../services/placeService';
import type { Place } from '../types/place';

export default function PlaceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        const loadPlace = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPlaceById(id, controller.signal);
                setPlace(data);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setError('Failed to load place details.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPlace();

        return () => controller.abort();
    }, [id]);

    const handleToggleSave = async () => {
        if (!place || !id) return;

        const currentSavedState = place.isSaved;

        // Optimistic update
        setPlace(prev => prev ? { ...prev, isSaved: !currentSavedState } : null);

        try {
            const { savePlace, unsavePlace } = await import('../services/placeService');
            const updatedPlace = currentSavedState
                ? await unsavePlace(id)
                : await savePlace(id);

            // Sync with backend
            setPlace(updatedPlace);
        } catch (err) {
            console.error('Failed to toggle save:', err);
            // Revert on error
            setPlace(prev => prev ? { ...prev, isSaved: currentSavedState } : null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-4">
                <div className="w-12 h-12 border-4 border-neutral-800 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-neutral-400 animate-pulse">Loading experience...</p>
            </div>
        );
    }

    if (error || !place) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-4 text-center">
                <p className="text-red-400 font-medium mb-4">{error || 'Place not found'}</p>
                <Button onClick={() => navigate('/')} variant="secondary">
                    Back to Exploration
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24 md:pb-0">
            {/* Hero Section */}
            <div className="relative aspect-[4/3] w-full md:h-[400px] md:aspect-auto overflow-hidden">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                {/* Header Actions */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-neutral-900/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-neutral-800 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleToggleSave}
                        className="w-10 h-10 rounded-full bg-neutral-900/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-neutral-800 transition-colors"
                    >
                        <SavedIcon className={`w-5 h-5 ${place.isSaved ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    </button>
                </div>

                {/* Rating Badge Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-white">{place.rating}</span>
                    <span className="text-neutral-300 text-sm">({place.reviewCount} reviews)</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-3xl mx-auto px-4 pt-6 pb-28 space-y-6">

                {/* Header Section */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">{place.name}</h1>
                        <div className="flex items-center text-neutral-400 mt-1">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm">{place.city}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Chip variant="outlined" className="border-neutral-700">{place.category}</Chip>
                        <Chip variant="outlined" className="border-neutral-700">Recommended</Chip>
                    </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                    <h2 className="text-lg font-medium text-white">About</h2>
                    <div className="relative">
                        <p className={`text-neutral-400 text-sm leading-relaxed transition-all duration-300 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                            {place.description}
                        </p>
                        <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="text-white text-sm font-medium mt-1 hover:underline focus:outline-none"
                        >
                            {isDescriptionExpanded ? 'Read less' : 'Read more'}
                        </button>
                    </div>

                    {place.mapUrl && (
                        <Button
                            variant="primary"
                            className="w-full mt-4"
                            onClick={() => window.open(place.mapUrl!, "_blank")}
                        >
                            Get Directions
                        </Button>
                    )}
                </div>





                {/* Map Preview Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-white">Location</h2>
                    <div className="h-48 bg-neutral-900 rounded-xl border border-neutral-800 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <div className="text-center z-10 space-y-2">
                            <MapPinIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                            <p className="text-neutral-500 text-sm">Map Integration Coming Soon</p>
                        </div>
                        <Button variant="secondary" className="absolute bottom-4 right-4 text-xs">
                            Get Directions
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/80 backdrop-blur-xl border-t border-white/5 z-40 md:static md:bg-transparent md:border-t-0 md:p-0">
                <div className="max-w-3xl mx-auto">
                    <Button className="w-full md:w-auto md:min-w-[200px]" size="lg">
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
