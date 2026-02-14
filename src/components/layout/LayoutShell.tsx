import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function LayoutShell() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            {/* Desktop Sidebar - Hidden on mobile/tablet, visible on lg+ */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full pb-20 lg:pb-0 lg:ml-0 overflow-x-hidden">
                <div className="max-w-screen-xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav - Visible on mobile/tablet, hidden on lg+ */}
            <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-50">
                <BottomNav />
            </div>
        </div>
    );
}
