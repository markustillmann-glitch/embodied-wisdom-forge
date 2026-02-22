import { useNavigate } from 'react-router-dom';
import { Lightbulb, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppFooterProps {
  className?: string;
}

const AppFooter = ({ className = '' }: AppFooterProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <footer className={`py-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] px-4 text-center ${className}`}>
      <div className="flex items-center justify-center gap-4 mb-2">
        <button onClick={() => navigate('/help')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5" />
          FAQ
        </button>
        <span className="text-muted-foreground/30">·</span>
        <button onClick={() => navigate('/modell')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <MessageCircleQuestion className="w-3.5 h-3.5" />
          {language === 'de' ? 'Das Modell' : 'The Model'}
        </button>
        <span className="text-muted-foreground/30">·</span>
        <button onClick={() => navigate('/pricing')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2025 Oria · Selfcare Impulse
      </p>
    </footer>
  );
};

export default AppFooter;
