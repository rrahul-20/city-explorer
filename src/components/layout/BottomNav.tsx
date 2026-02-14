import { NavLink } from 'react-router-dom';
import { ExploreIcon, SavedIcon, ProfileIcon } from '../common/Icons';

export default function BottomNav() {
    const navItems = [
        { name: 'Explore', path: '/', icon: ExploreIcon },
        { name: 'Saved', path: '/saved', icon: SavedIcon },
        { name: 'Profile', path: '/profile', icon: ProfileIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-md rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-white/20 flex items-center justify-around z-50 pb-2">
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'
                        }`
                    }
                >
                    <item.icon className="w-6 h-6" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">
                        {item.name}
                    </span>
                </NavLink>
            ))}
        </nav>
    );
}
