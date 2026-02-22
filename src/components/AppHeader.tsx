import { useNavigate } from 'react-router-dom';
import { Lock, Gamepad2, Lightbulb, Heart } from 'lucide-react';
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
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/30 pt-[max(env(safe-area-inset-top),20px)]">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOwlClick}
            className="w-11 h-11 rounded-full bg-foreground shadow-lg flex items-center justify-center"
            aria-label="Oria"
          >
            <img src={bbOwlLogo} alt="Oria" className="w-8 h-8 object-contain" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/summaries')}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Tresor öffnen"
          >
            <Lock className="w-5 h-5 text-foreground/70" />
          </motion.button>

          {user && onGamificationClick && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGamificationClick}
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
              aria-label="Fortschritt"
            >
              <Gamepad2 className="w-5 h-5 text-foreground/70" />
            </motion.button>
          )}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/help')}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Hilfe"
          >
            <Lightbulb className="w-5 h-5 text-foreground/70" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/modell')}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Über das Modell"
          >
            <Heart className="w-5 h-5 text-foreground/70" />
          </motion.button>

          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
