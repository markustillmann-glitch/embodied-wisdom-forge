import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, BookOpen, Users, Shield, FileText, Sparkles, Home } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdminLink } from "@/components/AdminLink";
import { useLanguage } from "@/contexts/LanguageContext";
import bbOwlLogo from "@/assets/bb-owl-new.png";

interface HeaderProps {
  showAdminLink?: boolean;
}

export const Header = ({ showAdminLink = false }: HeaderProps) => {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/", label: t('nav.toHome'), icon: Home },
    { to: "/oria", label: t('nav.discoverOria'), icon: BookOpen },
    { to: "/coach", label: t('nav.askOria'), icon: Sparkles },
    { to: "/oria-apps", label: "Oria Apps", icon: Sparkles },
    { to: "/seminare", label: t('nav.seminarOffers'), icon: Users },
    { to: "/sicherheit", label: "Sicherheit", icon: Shield },
    { to: "/impressum", label: t('nav.impressum'), icon: FileText },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
            >
              <img src={bbOwlLogo} alt="Logo" className="h-8 sm:h-10 w-auto" />
              <span className="hidden sm:inline font-serif text-sm">Beyond Constant Overload</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 py-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isAskOria = item.to === "/coach";
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isAskOria 
                          ? "text-accent font-medium hover:bg-accent/10" 
                          : "text-foreground hover:bg-accent/10 hover:text-accent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isAskOria ? "text-accent" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Right Side - Ask Oria Button + Controls */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/coach"
              className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-sans tracking-wider bg-accent text-accent-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-accent/90 transition-colors"
            >
              <span>{t('nav.askOria')}</span>
              <span className="hidden sm:inline">✦</span>
            </Link>
            {showAdminLink && <AdminLink />}
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
};
