import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface IOSCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: 'default' | 'grouped' | 'inset';
  children: React.ReactNode;
}

export const IOSCard: React.FC<IOSCardProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default: "ios-card shadow-sm",
    grouped: "ios-grouped-card",
    inset: "bg-card/50 rounded-[12px] border border-border/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface IOSCardRowProps {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  value?: React.ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IOSCardRow: React.FC<IOSCardRowProps> = ({
  icon,
  iconBg = "bg-accent",
  title,
  subtitle,
  value,
  chevron = false,
  onClick,
  className,
}) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        "ios-list-row w-full text-left",
        onClick && "cursor-pointer",
        className
      )}
    >
      {icon && (
        <div className={cn("w-[29px] h-[29px] rounded-[6px] flex items-center justify-center", iconBg)}>
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="ios-body text-foreground truncate">{title}</p>
        {subtitle && (
          <p className="ios-caption text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      {value && (
        <div className="text-muted-foreground ios-body shrink-0">
          {value}
        </div>
      )}

      {chevron && (
        <svg 
          className="w-4 h-4 text-muted-foreground/50 shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Component>
  );
};

export default IOSCard;
