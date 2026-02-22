import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const LanguageToggle = ({ className = '' }: { className?: string }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center relative ${className}`}
      aria-label={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
      title={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-foreground/70" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[8px] sm:text-[9px] font-bold bg-accent text-accent-foreground rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center leading-none">
        {language === 'de' ? 'EN' : 'DE'}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;
