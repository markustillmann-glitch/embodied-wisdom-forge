import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import markusTillmann from "@/assets/markus-tillmann.jpg";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const Impressum = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link 
            to="/" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">{t('nav.toHome')}</span>
            <span className="xs:hidden">{t('nav.back')}</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link 
              to="/seminare" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('nav.seminars')}
            </Link>
            <Link 
              to="/oria" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              {t('nav.oria')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-foreground mb-4"
          >
            {t('impressum.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-muted-foreground"
          >
            Beyond Constant Overload
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            
            {/* Gründer Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl border border-border p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img 
                  src={markusTillmann} 
                  alt="Markus Tillmann - Gründer" 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-accent/20"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-2">
                    Markus Tillmann
                  </h2>
                  <p className="text-accent font-medium mb-4">{t('impressum.founder')}</p>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t('impressum.founderBio')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Kontaktdaten */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {t('impressum.legalTitle')}
              </h2>
              
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">{t('impressum.responsible')}</h3>
                  <p className="text-muted-foreground">Beyond Bias gUG (haftungsbeschränkt)</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div className="text-muted-foreground">
                    <p>Markus Tillmann</p>
                    <p>Deutschland</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <a 
                    href="mailto:info@beyond-bias.net" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    info@beyond-bias.net
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Rechtliche Hinweise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {t('impressum.disclaimerTitle')}
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                <div>
                  <h3 className="font-medium text-foreground mb-2">{t('impressum.contentLiability')}</h3>
                  <p>{t('impressum.contentLiabilityText')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">{t('impressum.linkLiability')}</h3>
                  <p>{t('impressum.linkLiabilityText')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">{t('impressum.copyright')}</h3>
                  <p>{t('impressum.copyrightText')}</p>
                </div>
              </div>
            </motion.div>

            {/* Beyond Bias Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-quote-bg p-6 sm:p-8 rounded-xl border-l-4 border-accent"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={bbOwlLogo} alt="Oria" className="h-8 w-auto" />
                <h3 className="font-serif text-lg text-foreground">Beyond Constant Overload</h3>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {t('impressum.aboutBB')}
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Beyond Bias gUG. {t('index.footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Impressum;
