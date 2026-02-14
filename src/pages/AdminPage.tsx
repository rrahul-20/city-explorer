import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowLeftIcon } from '../components/common/Icons';

type PlaceCategory = 'beach' | 'restaurant' | 'heritage' | 'shopping';

interface FormData {
    name: string;
    category: PlaceCategory;
    city: string;
    image: string;
    description: string;
    rating: number;
    reviewCount: number;
    distance: number;
    lat: number;
    lng: number;
    mapUrl: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function AdminPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        category: 'beach',
        city: 'Kozhikode',
        image: '',
        description: '',
        rating: 0,
        reviewCount: 0,
        distance: 0,
        lat: 0,
        lng: 0,
        mapUrl: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.mapUrl.trim()) {
            newErrors.mapUrl = 'Map URL is required';
        } else if (!formData.mapUrl.startsWith('http')) {
            newErrors.mapUrl = 'Must be a valid URL';
        }

        if (formData.rating < 0 || formData.rating > 5) {
            newErrors.rating = 'Rating must be between 0 and 5';
        }

        if (formData.reviewCount < 0) {
            newErrors.reviewCount = 'Review count cannot be negative';
        }

        if (formData.distance < 0) {
            newErrors.distance = 'Distance cannot be negative';
        }

        if (formData.lat < -90 || formData.lat > 90) {
            newErrors.lat = 'Latitude must be between -90 and 90';
        }

        if (formData.lng < -180 || formData.lng > 180) {
            newErrors.lng = 'Longitude must be between -180 and 180';
        }

        // Custom validation based on user feedback
        if (formData.rating > 0 && formData.reviewCount <= 0) {
            newErrors.reviewCount = 'Review count must be > 0 if rating is > 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);
        setSuccess(false);

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/admin/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET || '',
                },
                body: JSON.stringify({
                    ...formData,
                    // Ensure lat/lng are sent as numbers even if validation passed
                    lat: Number(formData.lat),
                    lng: Number(formData.lng),
                    rating: Number(formData.rating),
                    reviewCount: Number(formData.reviewCount),
                    distance: Number(formData.distance),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add place');
            }

            setSuccess(true);
            setFormData({
                name: '',
                category: 'beach',
                city: 'Kozhikode',
                image: '',
                description: '',
                rating: 0,
                reviewCount: 0,
                distance: 0,
                lat: 0,
                lng: 0,
                mapUrl: '',
            });

            // Redirect after short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err: any) {
            setGlobalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (name: string) => `
        w-full bg-neutral-900 border ${errors[name] ? 'border-red-500' : 'border-neutral-800'} 
        rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 
        ${errors[name] ? 'focus:ring-red-500/50' : 'focus:ring-white/10'} transition-all
    `;

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900 px-4 py-4 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 mr-2 hover:bg-neutral-900 rounded-full transition-colors"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Add New Place</h1>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {globalError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">
                            {globalError}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl text-sm">
                            Place added successfully! Redirecting...
                        </div>
                    )}

                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Place Name *</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Kozhikode Beach"
                                className={inputClasses('name')}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Category *</span>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={inputClasses('category')}
                                >
                                    <option value="beach">Beach</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="heritage">Heritage</option>
                                    <option value="shopping">Shopping</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-neutral-400 mb-1.5 block">City *</span>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={inputClasses('city')}
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </label>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-900">
                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Image URL</span>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/..."
                                className={inputClasses('image')}
                            />
                        </label>

                        {formData.image && formData.image.startsWith('http') && (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-800">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}

                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Description</span>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about this place..."
                                className={`${inputClasses('description')} resize-none`}
                            />
                        </label>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-900">
                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Rating (0-5)</span>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                max="5"
                                className={inputClasses('rating')}
                            />
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Review Count</span>
                            <input
                                type="number"
                                name="reviewCount"
                                value={formData.reviewCount}
                                onChange={handleChange}
                                min="0"
                                className={inputClasses('reviewCount')}
                            />
                            {errors.reviewCount && <p className="text-red-500 text-xs mt-1">{errors.reviewCount}</p>}
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Distance (km)</span>
                            <input
                                type="number"
                                name="distance"
                                value={formData.distance}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                className={inputClasses('distance')}
                            />
                            {errors.distance && <p className="text-red-500 text-xs mt-1">{errors.distance}</p>}
                        </label>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Latitude *</span>
                                <input
                                    type="number"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    step="0.000001"
                                    className={inputClasses('lat')}
                                />
                                {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Longitude *</span>
                                <input
                                    type="number"
                                    name="lng"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    step="0.000001"
                                    className={inputClasses('lng')}
                                />
                                {errors.lng && <p className="text-red-500 text-xs mt-1">{errors.lng}</p>}
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm font-medium text-neutral-400 mb-1.5 block">Google Maps URL *</span>
                            <input
                                type="text"
                                name="mapUrl"
                                value={formData.mapUrl}
                                onChange={handleChange}
                                placeholder="https://www.google.com/maps/..."
                                className={inputClasses('mapUrl')}
                            />
                            {errors.mapUrl && <p className="text-red-500 text-xs mt-1">{errors.mapUrl}</p>}
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-8"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Adding Place...' : 'Add Place'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
