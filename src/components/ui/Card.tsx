/**
 * Card Component
 * Reusable card container with consistent styling
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, title, subtitle, padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#151717] rounded-lg shadow-md border border-[#D6DADB] dark:border-[#323738]',
        paddingClasses[padding],
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-[#333333] dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

