import { Link } from 'react-router-dom';
import { StarIcon, SavedIcon } from '../common/Icons';

interface PlaceCardProps {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    category: string;
    image: string;
    isSaved: boolean;
    distance?: number;
    onToggleSave?: (id: string, currentSavedState: boolean) => void;
}

export default function PlaceCard({
    id,
    name,
    rating,
    reviewCount,
    category,
    image,
    isSaved,
    distance = 1.2,
    onToggleSave,
}: PlaceCardProps) {
    const handleSaveClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSave?.(id, isSaved);
    };

    return (
        <Link to={`/place/${id}`} className="block group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-sm">
                    <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-neutral-900">{rating}</span>
                    <span className="text-[10px] text-neutral-500">({reviewCount})</span>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSaveClick}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                >
                    <SavedIcon className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-neutral-900'}`} />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight mb-1.5 line-clamp-1">{name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-neutral-400 font-medium">
                            <span>{category}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-600" />
                            <span>{distance} km</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
