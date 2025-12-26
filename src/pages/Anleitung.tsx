import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Heart, 
  Phone, 
  BookOpen,
  Clock,
  MessageCircle,
  User,
  Brain,
  Lock
} from "lucide-react";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const Anleitung = () => {
  const { t } = useLanguage();

  const optimalUsageBefore = [
    { icon: User, text: t('anleitung.optimal.before.profile') },
    { icon: Heart, text: t('anleitung.optimal.before.environment') },
    { icon: Brain, text: t('anleitung.optimal.before.grounded') },
    { icon: Lock, text: t('anleitung.optimal.before.vaultPassword') },
  ];

  const optimalUsageDuring = [
    t('anleitung.optimal.during.honest'),
    t('anleitung.optimal.during.ask'),
    t('anleitung.optimal.during.modes'),
    t('anleitung.optimal.during.memories'),
  ];

  const notReplacement = [
    t('anleitung.risks.notReplacement.therapy'),
    t('anleitung.risks.notReplacement.psychiatry'),
    t('anleitung.risks.notReplacement.crisis'),
    t('anleitung.risks.notReplacement.diagnosis'),
  ];

  const limitations = [
    t('anleitung.risks.limitations.context'),
    t('anleitung.risks.limitations.childhood'),
    t('anleitung.risks.limitations.epigenetics'),
  ];

  const immediateHelp = [
    t('anleitung.humanCoach.immediate.suicidal'),
    t('anleitung.humanCoach.immediate.trauma'),
    t('anleitung.humanCoach.immediate.depression'),
    t('anleitung.humanCoach.immediate.addiction'),
  ];

  const recommendedHelp = [
    t('anleitung.humanCoach.recommended.childhood'),
    t('anleitung.humanCoach.recommended.conflicts'),
    t('anleitung.humanCoach.recommended.career'),
    t('anleitung.humanCoach.recommended.reactions'),
    t('anleitung.humanCoach.recommended.worse'),
    t('anleitung.humanCoach.recommended.stuck'),
  ];

  const usagePatterns = [
    { situation: t('anleitung.patterns.daily.situation'), recommendation: t('anleitung.patterns.daily.recommendation') },
    { situation: t('anleitung.patterns.deep.situation'), recommendation: t('anleitung.patterns.deep.recommendation') },
    { situation: t('anleitung.patterns.stress.situation'), recommendation: t('anleitung.patterns.stress.recommendation') },
    { situation: t('anleitung.patterns.psychogram.situation'), recommendation: t('anleitung.patterns.psychogram.recommendation') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link 
            to="/oria" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">{t('anleitung.nav.backToOria')}</span>
            <span className="xs:hidden">{t('nav.back')}</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link 
              to="/oria-coach" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('nav.coach')}
            </Link>
            <p className="font-serif text-xs sm:text-sm text-foreground hidden sm:block">Beyond Constant Overload</p>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={bbOwlLogo} alt="Oria" className="h-10 sm:h-12 w-auto" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground">
                {t('anleitung.title')}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('anleitung.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Optimal Usage */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {t('anleitung.optimal.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-4">
                  {t('anleitung.optimal.before.title')}
                </h3>
                <ul className="space-y-3">
                  {optimalUsageBefore.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                        <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-4">
                  {t('anleitung.optimal.during.title')}
                </h3>
                <ul className="space-y-3">
                  {optimalUsageDuring.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
                      <MessageCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Risks and Limits */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {t('anleitung.risks.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-amber-500/30 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-4">
                  {t('anleitung.risks.notReplacement.title')}
                </h3>
                <ul className="space-y-2">
                  {notReplacement.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/90">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-4">
                  {t('anleitung.risks.limitations.title')}
                </h3>
                <ul className="space-y-2">
                  {limitations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Seek Human Coach */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {t('anleitung.humanCoach.title')}
              </h2>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-medium text-red-500 mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t('anleitung.humanCoach.immediate.title')}
              </h3>
              <ul className="space-y-2">
                {immediateHelp.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent" />
                {t('anleitung.humanCoach.recommended.title')}
              </h3>
              <ul className="space-y-2">
                {recommendedHelp.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Usage Patterns */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {t('anleitung.patterns.title')}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">{t('anleitung.patterns.situation')}</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">{t('anleitung.patterns.recommendation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {usagePatterns.map((pattern, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground/90">{pattern.situation}</td>
                      <td className="py-3 px-4 text-muted-foreground">{pattern.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Note */}
      <section className="py-12 sm:py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-quote-bg p-6 sm:p-8 rounded-xl border-l-4 border-accent">
              <p className="text-base sm:text-lg font-serif italic text-foreground mb-4">
                {t('anleitung.finalNote')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('anleitung.finalNoteDesc')}
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/oria-coach" 
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                {t('anleitung.cta.coach')}
              </Link>
              <Link 
                to="/seminare" 
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border font-medium rounded-lg hover:bg-secondary/50 transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                {t('anleitung.cta.seminars')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            © {new Date().getFullYear()} Beyond Constant Overload
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

export default Anleitung;
