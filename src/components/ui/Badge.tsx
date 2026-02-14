import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
    variant?: 'glass' | 'solid';
    children: ReactNode;
    className?: string;
}

export function Badge({ variant = 'glass', children, className }: BadgeProps) {
    const variants = {
        glass: 'bg-black/60 backdrop-blur-md border border-white/10 text-white',
        solid: 'bg-neutral-800 text-white',
    };

    return (
        <div
            className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold',
                variants[variant],
                className
            )}
        >
            {children}
        </div>
    );
}
