import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, MapPin, CheckCircle2, Sparkles, Heart, TrendingUp, Brain, MessageCircle, Shield, ChevronDown, ChevronUp, Zap, RefreshCw, Palette, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PolygonalBackground, ConnectionLines, OwlSymbol, InsightSymbol, MoonSymbol, GrowthSpiral } from "@/components/PolygonalBackground";
import { SeminarContactForm } from "@/components/SeminarContactForm";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const iconMap = {
  satisfaction: Heart,
  development: TrendingUp,
  feelings: Brain,
  relationships: MessageCircle,
  resilience: Shield,
};

const MehrwertCard = ({ 
  benefitKey, 
  isExpanded, 
  onToggle,
  t 
}: { 
  benefitKey: string;
  isExpanded: boolean; 
  onToggle: () => void;
  t: (key: string) => string;
}) => {
  const Icon = iconMap[benefitKey as keyof typeof iconMap] || Heart;
  const title = t(`seminare.benefits.${benefitKey}.title`);
  const summary = t(`seminare.benefits.${benefitKey}.summary`);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-serif text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
        <div className="shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6 pt-2 border-t border-border"
        >
          <div className="space-y-4 mb-6">
            {[0, 1, 2].map((idx) => {
              const heading = t(`seminare.benefits.${benefitKey}.details.${idx}.heading`);
              const text = t(`seminare.benefits.${benefitKey}.details.${idx}.text`);
              if (heading.includes('.heading')) return null;
              return (
                <div key={idx}>
                  <h4 className="text-sm font-medium text-foreground mb-1">{heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
          
          <div className="bg-quote-bg p-4 rounded-lg border-l-4 border-accent">
            <p className="text-xs font-sans tracking-wider text-accent uppercase mb-1">{t('seminare.practiceExample')}</p>
            <p className="text-sm text-foreground font-medium mb-1">{t(`seminare.benefits.${benefitKey}.example.name`)}</p>
            <p className="text-sm text-muted-foreground italic leading-relaxed">{t(`seminare.benefits.${benefitKey}.example.text`)}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const MehrwerteSection = () => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const benefitKeys = ['satisfaction', 'development', 'feelings', 'relationships', 'resilience'];
  
  return (
    <section className="py-20 relative overflow-hidden">
      <PolygonalBackground variant="warm" />
      
      <OwlSymbol className="absolute top-12 left-8 opacity-30 hidden md:block" />
      <InsightSymbol className="absolute bottom-20 right-12 opacity-20 hidden md:block" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
            {t('seminare.benefitsTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('seminare.benefitsSubtitle')}
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {benefitKeys.map((key) => (
            <MehrwertCard
              key={key}
              benefitKey={key}
              isExpanded={expandedId === key}
              onToggle={() => setExpandedId(expandedId === key ? null : key)}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Seminare = () => {
  const { t } = useLanguage();
  
  const timelineItems = [
    { key: 'start', highlight: false },
    { key: 'm1_3', highlight: false },
    { key: 'm4_5', highlight: false },
    { key: 'm6', highlight: false },
    { key: 'mid', highlight: true },
    { key: 'm7_9', highlight: false },
    { key: 'm10_11', highlight: false },
    { key: 'end', highlight: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 md:pb-24 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        <ConnectionLines className="top-20 right-10 w-32 h-32 opacity-60 hidden lg:block" />
        <GrowthSpiral className="absolute bottom-20 left-10 opacity-40 hidden lg:block" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs sm:text-sm font-sans tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground uppercase mb-4 sm:mb-5"
          >
            {t('seminare.label')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-foreground leading-tight mb-4 sm:mb-5 tracking-tight"
          >
            {t('seminare.title')}
            <br />
            <span className="text-accent">{t('seminare.titleAccent')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans max-w-xl mx-auto leading-relaxed px-2"
          >
            {t('seminare.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Zielgruppe */}
      <section className="py-16 border-t border-chapter-divider">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">
              {t('seminare.forWhom')}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('seminare.forWhomDesc')}
            </p>
            <div className="bg-quote-bg p-6 rounded-lg border-l-4 border-accent">
              <p className="text-foreground italic">
                {t('seminare.forWhomQuote')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compact Target Groups */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-3">
              {t('seminare.targetGroups.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('seminare.targetGroups.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'hsp', icon: Zap },
              { key: 'crisis', icon: RefreshCw },
              { key: 'therapy', icon: Brain },
              { key: 'mindfulness', icon: Eye },
              { key: 'creative', icon: Palette },
            ].map((group, index) => {
              const Icon = group.icon;
              return (
                <motion.div
                  key={group.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-card rounded-xl border border-border p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-sm sm:text-base font-serif text-foreground">
                      {t(`oria.progress.groups.${group.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {t(`seminare.targetGroups.${group.key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-8"
          >
            <Link
              to="/oria#progress"
              onClick={() => setTimeout(() => document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth' }), 100)}
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              {t('seminare.targetGroups.learnMore')}
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Formate */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.h2 
            {...fadeInUp}
            className="text-2xl md:text-3xl font-serif text-foreground text-center mb-12"
          >
            {t('seminare.formats')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Schnupperabend */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-card rounded-xl border border-border p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-sans tracking-wider text-muted-foreground uppercase">
                  {t('seminare.taster.label')}
                </span>
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">{t('seminare.taster.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                {t('seminare.taster.desc')}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('seminare.taster.duration')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t('seminare.taster.location')}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">{t('seminare.taster.content')}</p>
                <ul className="text-sm text-foreground space-y-1">
                  {[0, 1, 2].map((idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{t(`seminare.taster.items.${idx}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Einführungsseminar */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card rounded-xl border border-border p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-sans tracking-wider text-muted-foreground uppercase">
                  {t('seminare.intro.label')}
                </span>
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">{t('seminare.intro.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                {t('seminare.intro.desc')}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('seminare.intro.duration')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t('seminare.intro.location')}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">{t('seminare.intro.content')}</p>
                <ul className="text-sm text-foreground space-y-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{t(`seminare.intro.items.${idx}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Jahresprogramm */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-card rounded-xl border-2 border-accent p-8 flex flex-col relative"
            >
              <div className="absolute -top-3 right-6 bg-accent text-accent-foreground text-xs font-sans px-3 py-1 rounded-full">
                {t('seminare.annual.badge')}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-sans tracking-wider text-muted-foreground uppercase">
                  {t('seminare.annual.label')}
                </span>
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">{t('seminare.annual.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                {t('seminare.annual.desc')}
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('seminare.annual.duration')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t('seminare.annual.location')}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">{t('seminare.annual.contains')}</p>
                <ul className="text-sm text-foreground space-y-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{t(`seminare.annual.items.${idx}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jahresprogramm Details */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="flow" />
        
        <GrowthSpiral className="absolute top-1/4 right-8 opacity-30 hidden lg:block" />
        <ConnectionLines className="absolute bottom-1/3 left-4 w-24 h-24 opacity-40 hidden lg:block" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {t('seminare.detailTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('seminare.detailSubtitle')}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-chapter-divider md:-translate-x-px" />

            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative flex items-start gap-6 mb-10 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden md:block w-1/2" />
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent -translate-x-1/2 mt-1.5 z-10" />
                <div className={`ml-10 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className={`p-6 rounded-lg ${item.highlight ? "bg-accent/10 border border-accent/30" : "bg-card border border-border"}`}>
                    <span className="text-xs font-sans tracking-wider text-accent uppercase">
                      {t(`seminare.timeline.${item.key}.phase`)}
                    </span>
                    <h3 className="font-serif text-lg text-foreground mt-1 mb-2">
                      {t(`seminare.timeline.${item.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`seminare.timeline.${item.key}.desc`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Link to Team */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/team#top"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              {t('seminare.meetTeam')}
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mehrwerte Section */}
      <MehrwerteSection />

      {/* Practice Offerings */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {t('seminare.practiceTitle')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('seminare.practiceSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {['ifsmed', 'breathing', 'bodyscan', 'selfempathy', 'nvctraining', 'bodywork'].map((practice, index) => (
              <motion.div
                key={practice}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <h3 className="font-serif text-lg text-foreground mb-2">{t(`seminare.practices.${practice}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`seminare.practices.${practice}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Integration */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        
        <OwlSymbol className="absolute top-12 right-8 opacity-30 hidden md:block" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {t('seminare.coachIntegration.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('seminare.coachIntegration.subtitle')}
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="space-y-6">
            <div className="bg-card p-6 sm:p-8 rounded-xl border border-border">
              <p className="text-foreground/90 leading-relaxed mb-4">
                {t('seminare.coachIntegration.p1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('seminare.coachIntegration.p2')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-serif text-lg text-foreground mb-2">{t('seminare.coachIntegration.permanent')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('seminare.coachIntegration.permanentDesc')}</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-serif text-lg text-foreground mb-2">{t('seminare.coachIntegration.presence')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('seminare.coachIntegration.presenceDesc')}</p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Link 
                to="/oria-coach" 
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                {t('seminare.coachIntegration.tryCoach')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Methodik */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="accent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h2
            {...fadeInUp}
            className="text-2xl md:text-3xl font-serif text-foreground text-center mb-12"
          >
            {t('seminare.pillarsTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {['meditation', 'ifs', 'nvc', 'body'].map((pillar, index) => (
              <motion.div
                key={pillar}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <h3 className="font-serif text-lg text-foreground mb-2">{t(`seminare.pillars.${pillar}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`seminare.pillars.${pillar}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="kontakt" className="py-24 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <img 
            src={bbOwlLogo} 
            alt="Oria" 
            className="mx-auto mb-6 h-12 w-auto opacity-60"
          />
          
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              {t('seminare.contactTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('seminare.contactDesc')}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 rounded-xl border border-border shadow-lg"
          >
            <SeminarContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-chapter-divider">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="font-serif text-xl text-foreground hover:text-accent transition-colors">
            Inner Guidance Through Lived Memories
          </Link>
          <p className="text-muted-foreground text-sm mt-2 mb-4">
            {t('index.footer.subtitle')}
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

export default Seminare;
