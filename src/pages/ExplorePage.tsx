import { useState, useEffect, useMemo } from 'react';
import { SearchIcon, MapPinIcon, ChevronDownIcon } from '../components/common/Icons';
import PlaceCard from '../components/common/PlaceCard';
import { fetchPlaces } from '../services/placeService';
import type { Place } from '../types/place';

const CATEGORIES = ['all', 'beach', 'restaurant', 'heritage', 'shopping'] as const;

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch places on mount
    useEffect(() => {
        const controller = new AbortController();

        const loadPlaces = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPlaces(controller.signal);
                setPlaces(data);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setError('Failed to load places. Please check the backend server.');
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPlaces();

        return () => controller.abort();
    }, []);

    // Combined filtering logic: search + category
    const filteredPlaces = useMemo(() => {
        return places.filter(place => {
            const matchesCategory = activeCategory === 'all' ||
                place.category.toLowerCase() === activeCategory.toLowerCase();

            const matchesSearch = !searchQuery.trim() ||
                place.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                place.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                place.city.toLowerCase().includes(searchQuery.toLowerCase().trim());

            return matchesCategory && matchesSearch;
        });
    }, [places, searchQuery, activeCategory]);

    // Smooth scroll to top when category or search changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeCategory, searchQuery]);

    const handleToggleSave = async (id: string, currentSavedState: boolean) => {
        // Optimistic update
        setPlaces(prev => prev.map(p =>
            p.id === id ? { ...p, isSaved: !currentSavedState } : p
        ));

        try {
            const { savePlace, unsavePlace } = await import('../services/placeService');
            const updatedPlace = currentSavedState
                ? await unsavePlace(id)
                : await savePlace(id);

            // Sync with backend response just in case
            setPlaces(prev => prev.map(p =>
                p.id === id ? updatedPlace : p
            ));
        } catch (err) {
            console.error('Failed to toggle save:', err);
            // Revert on error
            setPlaces(prev => prev.map(p =>
                p.id === id ? { ...p, isSaved: currentSavedState } : p
            ));
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Sticky Search Header */}
            <div className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-xl px-4 pt-6 pb-4 md:px-6 md:pt-8 md:pb-5 lg:px-8 lg:pt-8 lg:pb-6 border-b border-neutral-800 space-y-4">

                {/* City Header */}
                <div className="space-y-1">
                    <button className="flex items-center space-x-1 group focus:outline-none">
                        <span className="text-lg font-semibold text-white">Kozhikode, Kerala</span>
                        <ChevronDownIcon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                    <p className="text-sm text-neutral-400">Discover beautiful places around you</p>
                </div>
                {/* Search Input */}
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search places..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-800 ring-1 ring-neutral-700 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    />
                </div>

                {/* Categories */}
                <div className="flex space-x-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                ? 'bg-white text-black font-bold shadow-lg shadow-white/5'
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 md:p-6 lg:p-8 space-y-6">

                {/* Featured Section Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                        <MapPinIcon className="w-5 h-5 text-neutral-400" />
                        <span>Featured Places</span>
                    </h2>
                    <button className="text-sm text-neutral-500 hover:text-white transition-colors">
                        View All
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-10 h-10 border-4 border-neutral-800 border-t-white rounded-full animate-spin mb-4" />
                        <p className="text-neutral-500">Discovering places...</p>
                    </div>
                )}

                {/* Error State */}
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

                {/* Places Grid or Empty State */}
                {!loading && !error && (
                    filteredPlaces.length > 0 ? (
                        <div
                            key={activeCategory}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up transition-opacity transition-transform duration-300"
                        >
                            {filteredPlaces.map((place) => (
                                <PlaceCard
                                    key={place.id}
                                    {...place}
                                    onToggleSave={handleToggleSave}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-16 animate-fade-in-up space-y-2">
                            <p className="text-lg text-neutral-400 font-medium">No places found</p>
                            <p className="text-sm text-neutral-500">Try a different search or category</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
