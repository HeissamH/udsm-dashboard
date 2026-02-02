import { cn } from '@/lib/utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                    {
                        'bg-[#FFD900] text-[#334E68] hover:bg-[#FACC15] focus:ring-[#FFD900]': variant === 'primary',
                        'bg-[#334E68] text-white hover:bg-[#243B53] focus:ring-[#334E68]': variant === 'secondary',
                        'border-2 border-[#334E68] text-[#334E68] hover:bg-[#334E68] hover:text-white focus:ring-[#334E68]': variant === 'outline',
                        'text-[#334E68] hover:bg-slate-100 focus:ring-slate-200': variant === 'ghost',
                    },
                    {
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-base': size === 'md',
                        'px-6 py-3 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };
