import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
      aria-label={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="uppercase font-medium">{language === 'de' ? 'EN' : 'DE'}</span>
    </button>
  );
};
