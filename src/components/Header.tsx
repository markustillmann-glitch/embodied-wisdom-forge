import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdminLink } from "@/components/AdminLink";
import { useLanguage } from "@/contexts/LanguageContext";
import bbOwlLogo from "@/assets/bb-owl-new.png";

interface HeaderProps {
  showAdminLink?: boolean;
}

export const Header = ({ showAdminLink = false }: HeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Home Link */}
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <img src={bbOwlLogo} alt="Logo" className="h-8 sm:h-10 w-auto" />
            <span className="hidden sm:inline font-serif text-sm">Beyond the Shallow</span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/coach"
              className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-sans tracking-wider bg-accent text-accent-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-accent/90 transition-colors"
            >
              <span>{t('nav.askOria')}</span>
              <span className="hidden sm:inline">✦</span>
            </Link>
            <Link
              to="/oria"
              className="hidden sm:inline-flex items-center text-xs sm:text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Oria</span>
            </Link>
            <Link
              to="/seminare"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-accent hover:text-accent/80 transition-colors"
            >
              <span>{t('index.discoverSeminars')}</span>
            </Link>
            {showAdminLink && <AdminLink />}
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
};
