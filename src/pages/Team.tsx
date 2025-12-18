import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Sparkles, Brain, Heart, Users, Shield, CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { PolygonalBackground } from '@/components/PolygonalBackground';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Placeholder avatar URLs - these would be replaced with real photos
const coachImages: Record<string, string> = {
  somatic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  ifs: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  nvc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  bodywork: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  psychology: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
};

const supportImages = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
];

const coachAreas = [
  { key: 'somatic', icon: Sparkles, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { key: 'ifs', icon: Brain, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { key: 'nvc', icon: Heart, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { key: 'bodywork', icon: Users, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { key: 'psychology', icon: Shield, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
];

const Team = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div {...fadeInUp} className="text-center">
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

      {/* Disclaimer Banner */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('team.disclaimer')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg text-muted-foreground text-center leading-relaxed"
          >
            {t('team.intro')}
          </motion.p>
        </div>
      </section>

      {/* Expert Coaches */}
      <section className="py-16 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
              {t('team.coaches.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('team.coaches.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-8">
            {coachAreas.map((area, index) => {
              const Icon = area.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={area.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Image */}
                    <div className="md:w-1/3 aspect-square md:aspect-auto">
                      <img
                        src={coachImages[area.key]}
                        alt={t(`team.coaches.${area.key}.name`)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${area.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {t(`team.coaches.${area.key}.role`)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-serif text-foreground mb-3">
                        {t(`team.coaches.${area.key}.name`)}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {t(`team.coaches.${area.key}.bio`)}
                      </p>
                      
                      <p className="text-sm text-accent font-medium">
                        {t(`team.coaches.${area.key}.qualifications`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-16 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-3">
              {t('team.support.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('team.support.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-border">
                  <img
                    src={supportImages[idx]}
                    alt={t(`team.support.members.${idx}.name`)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-medium text-foreground text-sm sm:text-base">
                  {t(`team.support.members.${idx}.name`)}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t(`team.support.members.${idx}.role`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
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
                  transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}
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
            transition={{ delay: 1.0, duration: 0.6 }}
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
