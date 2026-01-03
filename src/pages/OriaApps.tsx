import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Puzzle, Trash2, Lock, ArrowRight, Heart, Ear, HeartHandshake, Users, Sun } from "lucide-react";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const OriaApps = () => {
  const { t } = useLanguage();

  const activeApps = [
    {
      icon: Heart,
      title: t('oriaApps.apps.resonanzradar.title'),
      description: t('oriaApps.apps.resonanzradar.desc'),
      link: "/resonanzradar",
    },
    {
      icon: Sun,
      title: "Daily Check-in",
      description: "Entdecke dein Kernbedürfnis des Tages mit dem Peeling the Onion Modell. Speichere deine Erkenntnisse für die monatliche Reflexion.",
      link: "/daily-checkin",
    },
    {
      icon: Users,
      title: t('oriaApps.apps.oriaYouth.title'),
      description: t('oriaApps.apps.oriaYouth.desc'),
      link: "/oria-youth",
    },
  ];

  const upcomingApps = [
    {
      icon: Ear,
      title: t('oriaApps.apps.empatheticListening.title'),
      description: t('oriaApps.apps.empatheticListening.desc'),
    },
    {
      icon: HeartHandshake,
      title: t('oriaApps.apps.selfEmpathy.title'),
      description: t('oriaApps.apps.selfEmpathy.desc'),
    },
    {
      icon: Sparkles,
      title: t('oriaApps.apps.breathwork.title'),
      description: t('oriaApps.apps.breathwork.desc'),
    },
    {
      icon: Puzzle,
      title: t('oriaApps.apps.bodyCheck.title'),
      description: t('oriaApps.apps.bodyCheck.desc'),
    },
    {
      icon: Sparkles,
      title: t('oriaApps.apps.gratitude.title'),
      description: t('oriaApps.apps.gratitude.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-6"
            >
              <Link to="/oria" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('oriaApps.backToOria')}
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mb-4 sm:mb-5"
            >
              <img
                src={bbOwlLogo}
                alt="Oria"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight tracking-tight">
                {t('oriaApps.title')}
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground font-sans max-w-2xl leading-relaxed px-2"
            >
              {t('oriaApps.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
              {t('oriaApps.intro')}
            </p>
            
            {/* Data Handling Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-2">
                    {t('oriaApps.dataHandling.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('oriaApps.dataHandling.desc')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Vault Option */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-2">
                    {t('oriaApps.vaultOption.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('oriaApps.vaultOption.desc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Apps */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-3">
              {t('oriaApps.availableApps')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
            {activeApps.map((app, index) => {
              const Icon = app.icon;
              return (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link
                    to={app.link}
                    className="block bg-card rounded-xl border border-border p-6 hover:border-accent/50 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-base font-serif text-foreground mb-2 group-hover:text-accent transition-colors">{app.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{app.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-accent font-medium">
                      {t('oriaApps.openApp')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Upcoming Apps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 mt-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full mb-2">
              <span className="text-sm font-medium text-muted-foreground">{t('oriaApps.comingSoon')}</span>
            </div>
            <h3 className="text-lg font-serif text-muted-foreground">
              {t('oriaApps.comingSoonNote')}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcomingApps.map((app, index) => {
              const Icon = app.icon;
              return (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-card/50 rounded-xl border border-border/50 p-5 relative opacity-60"
                >
                  <div className="absolute top-3 right-3 px-2 py-1 bg-muted rounded-full">
                    <span className="text-xs font-medium text-muted-foreground">{t('oriaApps.comingSoon')}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-serif text-foreground/70 mb-1">{app.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{app.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back to Oria CTA */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/oria"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('oriaApps.backToOria')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 text-center border-t border-chapter-divider">
        <p className="text-xs sm:text-sm text-muted-foreground">
          © 2025 Beyond Constant Overload. {t('nav.impressum')}: <Link to="/impressum" className="underline hover:text-accent transition-colors">Impressum</Link>
        </p>
      </footer>
    </div>
  );
};

export default OriaApps;
