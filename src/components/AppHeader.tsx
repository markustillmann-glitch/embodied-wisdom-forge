import { useNavigate } from 'react-router-dom';
import { Lock, Gamepad2, Lightbulb, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LanguageToggle from '@/components/LanguageToggle';
import bbOwlLogo from '@/assets/bb-owl-new.png';

interface AppHeaderProps {
  onOwlClick?: () => void;
  onGamificationClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onOwlClick, onGamificationClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOwlClick = () => {
    if (onOwlClick) {
      onOwlClick();
    } else {
      navigate('/selfcare');
    }
  };

  const handleGamificationClick = () => {
    if (onGamificationClick) {
      onGamificationClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 pt-[max(env(safe-area-inset-top),20px)]">
      <div className="flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex gap-1.5 sm:gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOwlClick}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-foreground shadow-lg flex items-center justify-center"
            aria-label="Oria"
          >
            <img src={bbOwlLogo} alt="Oria" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/summaries')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Tresor öffnen"
          >
            <Lock className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-foreground/70" />
          </motion.button>

          {user && onGamificationClick && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGamificationClick}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
              aria-label="Fortschritt"
            >
              <Gamepad2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-foreground/70" />
            </motion.button>
          )}
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/help')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Hilfe"
          >
            <Lightbulb className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-foreground/70" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/modell')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Über das Modell"
          >
            <Compass className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-foreground/70" />
          </motion.button>

          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
