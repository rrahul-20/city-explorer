import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    label?: string; // Optional label for expanded FAB or accessibility
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
    ({ className, icon, label, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant="primary"
                size="lg"
                className={cn(
                    'fixed bottom-6 right-6 z-50 rounded-full shadow-2xl shadow-white/20 px-0 w-14 h-14 flex items-center justify-center', // Override px/py for circular shape
                    label && 'w-auto px-6', // If label exists, behave like a pill
                    className
                )}
                {...props}
            >
                {icon}
                {label && <span className="ml-2">{label}</span>}
            </Button>
        );
    }
);

FloatingActionButton.displayName = 'FloatingActionButton';
