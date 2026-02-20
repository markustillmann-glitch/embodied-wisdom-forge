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
      className={`w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center relative ${className}`}
      aria-label={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
      title={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <Globe className="w-5 h-5 text-foreground/70" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center leading-none">
        {language === 'de' ? 'EN' : 'DE'}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;
