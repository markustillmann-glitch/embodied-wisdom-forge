import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const IOSButton: React.FC<IOSButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "ios-font font-semibold transition-all duration-200 ease-out flex items-center justify-center gap-2 active:scale-[0.97]";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    text: "bg-transparent text-accent",
    destructive: "bg-destructive text-destructive-foreground",
  };

  const sizeStyles = {
    sm: "text-[15px] px-4 py-2 min-h-[36px] rounded-[10px]",
    md: "text-[17px] px-5 py-3 min-h-[50px] rounded-[12px]",
    lg: "text-[17px] px-6 py-4 min-h-[56px] rounded-[14px]",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed active:scale-100",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

export default IOSButton;
