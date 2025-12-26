import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConnectionBannerProps {
  isOnline: boolean;
  isSlowConnection: boolean;
  className?: string;
}

const ConnectionBanner: React.FC<ConnectionBannerProps> = ({
  isOnline,
  isSlowConnection,
  className,
}) => {
  const { language } = useLanguage();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  const getMessage = () => {
    if (!isOnline) {
      return language === 'de' 
        ? 'Keine Internetverbindung. Bitte überprüfe deine Verbindung.'
        : 'No internet connection. Please check your connection.';
    }
    if (isSlowConnection) {
      return language === 'de'
        ? 'Langsame Verbindung erkannt. Antworten können länger dauern.'
        : 'Slow connection detected. Responses may take longer.';
    }
    return '';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all',
        !isOnline 
          ? 'bg-destructive/10 text-destructive border-b border-destructive/20' 
          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-b border-amber-500/20',
        className
      )}
    >
      {!isOnline ? (
        <WifiOff className="h-4 w-4" />
      ) : (
        <Wifi className="h-4 w-4 animate-pulse" />
      )}
      <span>{getMessage()}</span>
    </div>
  );
};

export default ConnectionBanner;
