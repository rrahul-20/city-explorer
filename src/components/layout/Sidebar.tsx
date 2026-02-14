import { NavLink } from 'react-router-dom';
import { ExploreIcon, SavedIcon, ProfileIcon } from '../common/Icons';

export default function Sidebar() {
    const navItems = [
        { name: 'Explore', path: '/', icon: ExploreIcon },
        { name: 'Saved', path: '/saved', icon: SavedIcon },
        { name: 'Profile', path: '/profile', icon: ProfileIcon },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col z-50">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    City<span className="text-neutral-500">Explorer</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-white text-black font-medium shadow-lg shadow-white/5'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-neutral-800/50">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">John Doe</p>
                        <p className="text-xs text-neutral-500">Traveler</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
