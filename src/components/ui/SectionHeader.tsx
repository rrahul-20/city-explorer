import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface SectionHeaderProps {
    title: string;
    icon?: ReactNode;
    actionText?: string;
    onActionClick?: () => void;
    className?: string;
}

export function SectionHeader({
    title,
    icon,
    actionText,
    onActionClick,
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                {icon && <span className="w-5 h-5 text-neutral-400">{icon}</span>}
                <span>{title}</span>
            </h2>
            {actionText && onActionClick && (
                <Button variant="ghost" size="sm" onClick={onActionClick}>
                    {actionText}
                </Button>
            )}
        </div>
    );
}
