import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Users, Brain, Heart, Sparkles, Shield, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { PolygonalBackground } from '@/components/PolygonalBackground';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Team = () => {
  const { t } = useLanguage();

  const expertAreas = [
    { key: 'somatic', icon: Sparkles, color: 'text-amber-500' },
    { key: 'ifs', icon: Brain, color: 'text-violet-500' },
    { key: 'nvc', icon: Heart, color: 'text-rose-500' },
    { key: 'bodywork', icon: Users, color: 'text-emerald-500' },
    { key: 'psychology', icon: Shield, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <Link 
              to="/seminare" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('nav.seminars')}
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">
              {t('team.title')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('team.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg text-muted-foreground text-center leading-relaxed"
          >
            {t('team.intro')}
          </motion.p>
        </div>
      </section>

      {/* Expert Areas */}
      <section className="py-16 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
              {t('team.experts.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('team.experts.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="bg-card rounded-xl border border-border p-6 hover:border-accent/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-muted ${area.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg text-foreground">
                      {t(`team.experts.${area.key}.role`)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`team.experts.${area.key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-16 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-card rounded-xl border border-border p-6 sm:p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
                {t('team.quality.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('team.quality.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {[0, 1, 2, 3].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-foreground">
                    {t(`team.quality.items.${idx}`)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
              {t('team.cta.title')}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t('team.cta.desc')}
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/seminare#kontakt" className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('team.cta.button')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} beyond bias gUG
          </p>
          <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.impressum')}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Team;
