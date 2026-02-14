import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
    variant?: 'filled' | 'outlined';
}

const Chip = forwardRef<HTMLButtonElement, ChipProps>(
    ({ className, isActive = false, variant = 'outlined', children, ...props }, ref) => {
        const baseStyles = 'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20';

        // We use data attributes for active state styling to keep variants clean
        const variantStyles = {
            filled: 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:shadow-lg data-[active=true]:shadow-white/10 data-[active=true]:scale-105',
            outlined: 'bg-transparent border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-white',
        };

        return (
            <button
                ref={ref}
                data-active={isActive}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Chip.displayName = 'Chip';

export { Chip };
