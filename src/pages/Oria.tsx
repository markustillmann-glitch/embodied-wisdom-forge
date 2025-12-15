import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Moon, Ear, Compass, Heart, Sparkles } from "lucide-react";
import { PolygonalBackground, ConnectionLines } from "@/components/PolygonalBackground";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import bbOwlLogo from "@/assets/bb-owl-new.png";
import oriaOwlFine from "@/assets/oria-owl-fine.png";
import oriaBracelet from "@/assets/oria-bracelet.png";

const Oria = () => {
  const { t } = useLanguage();

  const qualities = [
    {
      icon: Eye,
      title: t('oria.qualities.wisdom.title'),
      description: t('oria.qualities.wisdom.desc'),
    },
    {
      icon: Moon,
      title: t('oria.qualities.seeing.title'),
      description: t('oria.qualities.seeing.desc'),
    },
    {
      icon: Sparkles,
      title: t('oria.qualities.mindfulness.title'),
      description: t('oria.qualities.mindfulness.desc'),
    },
    {
      icon: Heart,
      title: t('oria.qualities.intuition.title'),
      description: t('oria.qualities.intuition.desc'),
    },
    {
      icon: Compass,
      title: t('oria.qualities.transformation.title'),
      description: t('oria.qualities.transformation.desc'),
    },
  ];

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
            <span className="hidden xs:inline">{t('nav.toCompendium')}</span>
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
            <p className="font-serif text-xs sm:text-sm text-foreground hidden sm:block">Beyond Bias through memories</p>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero with Background Owl */}
      <section className="py-16 sm:py-20 md:py-32 relative overflow-hidden min-h-[60vh] sm:min-h-[80vh] flex items-center">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        {/* Owl background image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.img
            src={oriaOwlFine}
            alt=""
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-[280px] sm:w-[400px] md:w-[650px] lg:w-[800px] h-auto object-contain"
          />
        </div>
        
        <ConnectionLines className="top-20 right-10 w-32 h-32 opacity-60 hidden lg:block" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs sm:text-sm font-sans tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase mb-4 sm:mb-6"
            >
              {t('oria.symbolOf')}
            </motion.p>
            
            {/* Owl + Heading inline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-[30px] mb-4 sm:mb-6"
            >
              <img
                src={bbOwlLogo}
                alt="Oria - Die weise Eule"
                className="h-10 sm:h-[2.5rem] md:h-[3rem] lg:h-[3.75rem] w-auto object-contain"
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground leading-tight">
                {t('oria.title')}
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-accent font-serif mb-6 sm:mb-8"
            >
              {t('oria.subtitle')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg text-muted-foreground font-sans max-w-2xl leading-relaxed px-2"
            >
              {t('oria.intro')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
              {t('oria.intro2')} <strong className="text-foreground">{t('oria.intro2Bold')}</strong>
            </p>
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
              {t('oria.intro3')}
            </p>
            <div className="bg-quote-bg p-5 sm:p-8 rounded-lg border-l-4 border-accent">
              <p className="text-lg sm:text-xl font-serif italic text-foreground">
                {t('oria.intro3Quote')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warum eine Eule */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-3 sm:mb-4">
              {t('oria.whyOwl')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('oria.whyOwlDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {qualities.map((quality, index) => {
              const Icon = quality.icon;
              return (
                <motion.div
                  key={quality.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-card rounded-xl border border-border p-4 sm:p-6"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-foreground mb-2">{quality.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{quality.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Name Section */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        
        {/* Subtle owl in background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-15 hidden lg:block">
          <img src={oriaOwlFine} alt="" className="w-[400px] h-auto" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5 sm:space-y-8"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Ear className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground">
                {t('oria.whyName')}
              </h2>
            </div>
            
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
              {t('oria.whyNameP1')} <strong className="text-accent">Oria</strong> {t('oria.whyNameP2')}
            </p>
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
              {t('oria.whyNameP3')} <em>{t('oria.whyNameP3Ohr')}</em> {t('oria.whyNameP3Listen')} <em>{t('oria.whyNameP3Orient')}</em> {t('oria.whyNameP3Guide')} <em>{t('oria.whyNameP3Order')}</em>{t('oria.whyNameP3End')}
            </p>
            
            <div className="bg-quote-bg p-5 sm:p-8 rounded-lg border-l-4 border-accent">
              <p className="text-lg sm:text-xl font-serif italic text-foreground mb-2">
                {t('oria.oriaVoice')}
              </p>
              <p className="text-xl sm:text-2xl font-serif text-accent">
                {t('oria.oriaVoiceQuote')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Begleitung Section */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-serif text-foreground">
              {t('oria.accompanies')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t('oria.accompaniesDesc')}
            </p>
          </motion.div>
          
          {/* Bracelet Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 sm:mt-12"
          >
            <div className="relative max-w-sm mx-auto">
              <img 
                src={oriaBracelet} 
                alt="Oria Armband mit Eulensymbol" 
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 italic">
                {t('oria.braceletCaption')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed">
              {t('oria.finalQuote')}
            </blockquote>
            <p className="text-accent font-serif text-base sm:text-lg">— Oria</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <p className="text-base sm:text-lg text-muted-foreground">
              {t('oria.ready')}
            </p>
            <Link 
              to="/seminare" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base"
            >
              {t('oria.toSeminars')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            © {new Date().getFullYear()} Beyond Bias through memories
          </p>
          <Link 
            to="/impressum" 
            onClick={() => window.scrollTo(0, 0)}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            {t('nav.impressum')}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Oria;
