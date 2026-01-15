import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface IOSNavBarProps {
  title?: string;
  largeTitle?: boolean;
  showBack?: boolean;
  backLabel?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export const IOSNavBar: React.FC<IOSNavBarProps> = ({
  title,
  largeTitle = false,
  showBack = false,
  backLabel = 'Zurück',
  onBack,
  rightAction,
  transparent = false,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "ios-nav-bar ios-font",
        transparent && "bg-transparent backdrop-blur-none border-none",
        className
      )}
    >
      <div className="flex items-center justify-between h-[44px] px-4">
        {/* Left side - Back button or spacer */}
        <div className="flex-1 flex items-start">
          {showBack && (
            <button
              onClick={handleBack}
              className="ios-button-text flex items-center gap-0.5 -ml-2 active:opacity-50 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
              <span className="text-[17px]">{backLabel}</span>
            </button>
          )}
        </div>

        {/* Center - Title (only shown for non-large title) */}
        {!largeTitle && title && (
          <div className="flex-shrink-0">
            <h1 className="ios-headline text-foreground text-center truncate max-w-[200px]">
              {title}
            </h1>
          </div>
        )}

        {/* Right side - Actions or spacer */}
        <div className="flex-1 flex justify-end">
          {rightAction}
        </div>
      </div>

      {/* Large title (below nav bar) */}
      {largeTitle && title && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="px-4 pb-2"
        >
          <h1 className="ios-large-title text-foreground">{title}</h1>
        </motion.div>
      )}
    </motion.header>
  );
};

export default IOSNavBar;
