import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChapterNav } from "@/components/ChapterNav";
import { ChapterSection } from "@/components/ChapterSection";
import { SubSection } from "@/components/SubSection";
import { Quote } from "@/components/Quote";
import { Highlight } from "@/components/Highlight";
import { ListBlock } from "@/components/ListBlock";
import { ProcessFlow } from "@/components/ProcessFlow";
import { PolygonalBackground, ConnectionLines, GrowthSpiral, OwlSymbol, InsightSymbol, MoonSymbol } from "@/components/PolygonalBackground";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdminLink } from "@/components/AdminLink";
import { useLanguage } from "@/contexts/LanguageContext";
import oriaOwl from "@/assets/oria-owl.png";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const Index = () => {
  const { t, tArray, language } = useLanguage();
  const [activeChapter, setActiveChapter] = useState("cover");

  const chapters = [
    { id: "cover", title: t('index.chapters.cover') },
    { id: "vorwort", title: t('index.chapters.vorwort') },
    { id: "kap1", title: t('index.chapters.erinnerung'), number: "1" },
    { id: "kap2", title: t('index.chapters.bodyMemory'), number: "2" },
    { id: "kap3", title: t('index.chapters.meditation'), number: "3" },
    { id: "kap4", title: t('index.chapters.ifs'), number: "4" },
    { id: "kap5", title: t('index.chapters.nvc'), number: "5" },
    { id: "kap6", title: t('index.chapters.processModel'), number: "6" },
    { id: "kap7", title: t('index.chapters.bias'), number: "7" },
    { id: "kap8", title: t('index.chapters.journaling'), number: "8" },
    { id: "fazit", title: t('index.chapters.fazit') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = chapters.map((ch) => ({
        id: ch.id,
        el: document.getElementById(ch.id),
      }));

      for (const section of sections) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveChapter(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [language]);

  const scrollToChapter = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <ChapterNav
        chapters={chapters}
        activeChapter={activeChapter}
        onChapterClick={scrollToChapter}
      />

      {/* Language Switcher & Admin Link - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <AdminLink />
        <LanguageSwitcher />
      </div>

      {/* Hero / Cover */}
      <section id="cover" className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 md:py-0">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        {/* Decorative elements */}
        <ConnectionLines className="absolute top-20 right-10 w-32 h-32 opacity-60 hidden lg:block" />
        <GrowthSpiral className="absolute bottom-32 left-10 opacity-40 hidden lg:block" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
        >
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-[30px] mb-4 sm:mb-6">
            <img src={bbOwlLogo} alt="Beyond Bias Logo" className="h-16 sm:h-[5.5rem] md:h-[6.875rem] lg:h-[8.25rem] w-auto" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-foreground leading-tight text-center sm:text-left">
              Beyond Bias
              <br />
              <span className="text-accent whitespace-nowrap">through memories</span>
            </h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mt-4 sm:mt-8 leading-relaxed px-2"
          >
            {t('index.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 sm:mt-16 flex flex-col items-center gap-4"
          >
            <button
              onClick={() => scrollToChapter("vorwort")}
              className="group inline-flex items-center gap-2 text-sm font-sans tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{t('index.begin')}</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ↓
              </motion.span>
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <a
                href="/coach"
                className="inline-flex flex-col items-center gap-0.5 text-sm font-sans tracking-wider bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{t('nav.askOria')}</span>
                  <span>✦</span>
                </span>
                <span className="text-xs opacity-80">{t('nav.yourPersonalCoach')}</span>
              </a>
              <a
                href="/oria"
                className="inline-flex items-center gap-2 text-sm font-sans tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <img src={bbOwlLogo} alt="Oria" className="h-5 sm:h-6 w-auto opacity-70" />
                <span>{t('index.meetOria')}</span>
              </a>
              <span className="text-muted-foreground/50 hidden sm:inline">|</span>
              <a
                href="/seminare"
                className="inline-flex items-center gap-2 text-sm font-sans tracking-wider text-accent hover:text-accent/80 transition-colors"
              >
                <span>{t('index.discoverSeminars')}</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Impressum & Intention */}
      <section className="py-12 sm:py-20 border-t border-chapter-divider relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-foreground/80 mb-4">
              {t('index.tagline')}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-xl mx-auto">
              {t('index.taglineDesc')}
            </p>
            <p className="text-muted-foreground font-sans mt-4 text-xs sm:text-sm">
              {t('index.taglineNote')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vorwort */}
        <div id="vorwort" className="border-t border-chapter-divider">
          <ChapterSection title={t('index.vorwort.title')}>
            <p className="text-xl text-muted-foreground italic mb-8">
              {t('index.vorwort.subtitle')}
            </p>
            <p>{t('index.vorwort.p1')}</p>
            <Highlight>{t('index.vorwort.highlight1')}</Highlight>
            <p>{t('index.vorwort.p2')}</p>
            <Quote>{t('index.vorwort.quote1')}</Quote>
            <p>{t('index.vorwort.p3')}</p>
            <p className="font-medium text-foreground">{t('index.vorwort.p4')}</p>
          </ChapterSection>
        </div>

        {/* Kapitel 1 */}
        <div id="kap1" className="border-t border-chapter-divider">
          <ChapterSection number="1" title={t('index.kap1.title')}>
            <SubSection number="1.1" title={t('index.kap1.s1.title')}>
              <p>{t('index.kap1.s1.p1')}</p>
              <Highlight>{t('index.kap1.s1.highlight')}</Highlight>
              <p>{t('index.kap1.s1.p2')}</p>
              <ListBlock items={tArray('index.kap1.s1.list')} />
              <p className="text-accent font-medium mt-6">{t('index.kap1.s1.fazit')}</p>
            </SubSection>

            <SubSection number="1.2" title={t('index.kap1.s2.title')}>
              <p>{t('index.kap1.s2.p1')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-card p-4 sm:p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2 text-sm sm:text-base">
                    1. {t('index.kap1.s2.explicit.title')}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t('index.kap1.s2.explicit.subtitle')}</p>
                  <ListBlock items={tArray('index.kap1.s2.explicit.items')} />
                  <p className="text-xs sm:text-sm italic text-muted-foreground mt-3">{t('index.kap1.s2.explicit.example')}</p>
                </div>
                <div className="bg-card p-4 sm:p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2 text-sm sm:text-base">
                    2. {t('index.kap1.s2.implicit.title')}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t('index.kap1.s2.implicit.subtitle')}</p>
                  <ListBlock items={tArray('index.kap1.s2.implicit.items')} />
                  <p className="text-xs sm:text-sm italic text-muted-foreground mt-3">{t('index.kap1.s2.implicit.example')}</p>
                </div>
              </div>
              <Quote>{t('index.kap1.s2.quote')}</Quote>
            </SubSection>

            <SubSection number="1.3" title={t('index.kap1.s3.title')}>
              <p>{t('index.kap1.s3.p1')}</p>
              <div className="bg-quote-bg p-6 rounded-lg mt-4 text-center">
                <p className="font-sans font-medium text-foreground">{t('index.kap1.s3.chain')}</p>
                <p className="text-muted-foreground mt-3 text-sm">{t('index.kap1.s3.chainDesc')}</p>
              </div>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 2 */}
        <div id="kap2" className="border-t border-chapter-divider">
          <ChapterSection number="2" title={t('index.kap2.title')}>
            <SubSection number="2.1" title={t('index.kap2.s1.title')}>
              <p>{t('index.kap2.s1.p1')}</p>
              <ListBlock items={tArray('index.kap2.s1.list')} />
              <Highlight>{t('index.kap2.s1.highlight')}</Highlight>
            </SubSection>

            <SubSection number="2.2" title={t('index.kap2.s2.title')}>
              <p>{t('index.kap2.s2.p1')}</p>
              <Quote>{t('index.kap2.s2.quote')}</Quote>
              <p>{t('index.kap2.s2.p2')}</p>
            </SubSection>

            <SubSection number="2.3" title={t('index.kap2.s3.title')}>
              <p>{t('index.kap2.s3.p1')}</p>
            </SubSection>

            <SubSection number="2.4" title={t('index.kap2.s4.title')}>
              <p>{t('index.kap2.s4.p1')}</p>
              <p className="font-medium text-foreground mt-4">{t('index.kap2.s4.p2')}</p>
              <ListBlock items={tArray('index.kap2.s4.list')} />
              <Quote>{t('index.kap2.s4.quote')}</Quote>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 3 */}
        <div id="kap3" className="border-t border-chapter-divider">
          <ChapterSection number="3" title={t('index.kap3.title')}>
            <SubSection number="3.1" title={t('index.kap3.s1.title')}>
              <p>{t('index.kap3.s1.p1')}</p>
              <ListBlock ordered items={tArray('index.kap3.s1.list')} />
              <Highlight>{t('index.kap3.s1.highlight')}</Highlight>
            </SubSection>

            <SubSection number="3.2" title={t('index.kap3.s2.title')}>
              <p>{t('index.kap3.s2.p1')}</p>
            </SubSection>

            <SubSection number="3.3" title={t('index.kap3.s3.title')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-accent/10 p-4 sm:p-5 rounded-lg border border-accent/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 text-sm sm:text-base">
                    {t('index.kap3.s3.integrative.title')}
                  </h4>
                  <ListBlock items={tArray('index.kap3.s3.integrative.items')} />
                </div>
                <div className="bg-destructive/10 p-4 sm:p-5 rounded-lg border border-destructive/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 text-sm sm:text-base">
                    {t('index.kap3.s3.retraumatizing.title')}
                  </h4>
                  <ListBlock items={tArray('index.kap3.s3.retraumatizing.items')} />
                </div>
              </div>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 4 */}
        <div id="kap4" className="border-t border-chapter-divider">
          <ChapterSection number="4" title={t('index.kap4.title')}>
            <p>{t('index.kap4.intro')}</p>

            <SubSection number="4.1" title={t('index.kap4.s1.title')}>
              <p>{t('index.kap4.s1.p1')}</p>
              <Highlight>{t('index.kap4.s1.highlight')}</Highlight>
            </SubSection>

            <SubSection number="4.2" title={t('index.kap4.s2.title')}>
              <div className="space-y-4 my-6">
                <div className="bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">
                    {t('index.kap4.s2.manager.title')} <span className="font-sans text-sm text-muted-foreground">{t('index.kap4.s2.manager.subtitle')}</span>
                  </h4>
                  <p className="text-muted-foreground">{t('index.kap4.s2.manager.desc')}</p>
                </div>
                <div className="bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">
                    {t('index.kap4.s2.firefighter.title')} <span className="font-sans text-sm text-muted-foreground">{t('index.kap4.s2.firefighter.subtitle')}</span>
                  </h4>
                  <p className="text-muted-foreground">{t('index.kap4.s2.firefighter.desc')}</p>
                </div>
                <div className="bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">
                    {t('index.kap4.s2.exile.title')} <span className="font-sans text-sm text-muted-foreground">{t('index.kap4.s2.exile.subtitle')}</span>
                  </h4>
                  <p className="text-muted-foreground">{t('index.kap4.s2.exile.desc')}</p>
                </div>
              </div>
            </SubSection>

            <SubSection number="4.3" title={t('index.kap4.s3.title')}>
              <p>{t('index.kap4.s3.p1')}</p>
            </SubSection>

            <SubSection number="4.4" title={t('index.kap4.s4.title')}>
              <p>{t('index.kap4.s4.p1')}</p>
            </SubSection>

            <SubSection number="4.5" title={t('index.kap4.s5.title')}>
              <p>{t('index.kap4.s5.p1')}</p>
              <ListBlock items={[
                <span key="1"><strong>{t('index.kap4.s5.copiedManager')}</strong> {t('index.kap4.s5.copiedManagerDesc')}</span>,
                <span key="2"><strong>{t('index.kap4.s5.inheritedFear')}</strong> {t('index.kap4.s5.inheritedFearDesc')}</span>,
              ]} />
              <Quote>{t('index.kap4.s5.quote')}</Quote>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 5 */}
        <div id="kap5" className="border-t border-chapter-divider">
          <ChapterSection number="5" title={t('index.kap5.title')}>
            <p>{t('index.kap5.intro')}</p>

            <SubSection number="5.1" title={t('index.kap5.s1.title')}>
              <p>{t('index.kap5.s1.p1')}</p>
            </SubSection>

            <SubSection number="5.2" title={t('index.kap5.s2.title')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6">
                {[
                  { num: "1", titleKey: 'index.kap5.s2.step1.title', descKey: 'index.kap5.s2.step1.desc' },
                  { num: "2", titleKey: 'index.kap5.s2.step2.title', descKey: 'index.kap5.s2.step2.desc' },
                  { num: "3", titleKey: 'index.kap5.s2.step3.title', descKey: 'index.kap5.s2.step3.desc' },
                  { num: "4", titleKey: 'index.kap5.s2.step4.title', descKey: 'index.kap5.s2.step4.desc' },
                ].map((step) => (
                  <div key={step.num} className="bg-card p-3 sm:p-4 rounded-lg border border-border">
                    <span className="inline-block w-7 h-7 sm:w-8 sm:h-8 bg-accent text-accent-foreground rounded-full text-center leading-7 sm:leading-8 font-semibold text-xs sm:text-sm mb-2">
                      {step.num}
                    </span>
                    <h4 className="font-serif font-semibold text-foreground mb-1 text-sm sm:text-base">{t(step.titleKey)}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t(step.descKey)}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection number="5.3" title={t('index.kap5.s3.title')}>
              <p>{t('index.kap5.s3.p1')}</p>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 6 */}
        <div id="kap6" className="border-t border-chapter-divider">
          <ChapterSection number="6" title={t('index.kap6.title')}>
            <p>{t('index.kap6.intro')}</p>

            <SubSection number="6.1" title={t('index.kap6.s1.title')}>
              <ProcessFlow />
            </SubSection>

            <SubSection number="6.2" title={t('index.kap6.s2.title')}>
              <div className="bg-card p-6 rounded-lg border border-border my-6">
                <p className="font-medium text-foreground mb-4">
                  <strong>{t('index.kap6.s2.situation')}</strong> {t('index.kap6.s2.situationDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6">
                <div className="bg-destructive/10 p-4 sm:p-5 rounded-lg border border-destructive/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                    {t('index.kap6.s2.automatic.title')}
                  </h4>
                  <ListBlock items={[
                    <span key="1"><strong>{t('index.kap6.s2.automatic.trigger')}</strong> {t('index.kap6.s2.automatic.triggerDesc')}</span>,
                    <span key="2"><strong>{t('index.kap6.s2.automatic.somatic')}</strong> {t('index.kap6.s2.automatic.somaticDesc')}</span>,
                    <span key="3"><strong>{t('index.kap6.s2.automatic.part')}</strong> {t('index.kap6.s2.automatic.partDesc')}</span>,
                    <span key="4"><strong>{t('index.kap6.s2.automatic.reaction')}</strong> {t('index.kap6.s2.automatic.reactionDesc')}</span>,
                  ]} />
                </div>

                <div className="bg-accent/10 p-4 sm:p-5 rounded-lg border border-accent/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                    {t('index.kap6.s2.integrated.title')}
                  </h4>
                  <ListBlock items={[
                    <span key="1"><strong>{t('index.kap6.s2.integrated.trigger')}</strong> {t('index.kap6.s2.integrated.triggerDesc')}</span>,
                    <span key="2"><strong>{t('index.kap6.s2.integrated.somatic')}</strong> {t('index.kap6.s2.integrated.somaticDesc')}</span>,
                    <span key="3"><strong>{t('index.kap6.s2.integrated.pause')}</strong> {t('index.kap6.s2.integrated.pauseDesc')}</span>,
                    <span key="4"><strong>{t('index.kap6.s2.integrated.translation')}</strong> {t('index.kap6.s2.integrated.translationDesc')}</span>,
                    <span key="5"><strong>{t('index.kap6.s2.integrated.action')}</strong> {t('index.kap6.s2.integrated.actionDesc')}</span>,
                  ]} />
                </div>
              </div>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 7 */}
        <div id="kap7" className="border-t border-chapter-divider">
          <ChapterSection number="7" title={t('index.kap7.title')}>
            <SubSection number="7.1" title={t('index.kap7.s1.title')}>
              <p>{t('index.kap7.s1.p1')}</p>
              <div className="bg-quote-bg p-6 rounded-lg my-6">
                <p className="font-medium text-foreground mb-2">{t('index.kap7.s1.scan')}</p>
                <ListBlock items={tArray('index.kap7.s1.items')} />
              </div>
              <Highlight>{t('index.kap7.s1.highlight')}</Highlight>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 8 */}
        <div id="kap8" className="border-t border-chapter-divider">
          <ChapterSection number="8" title={t('index.kap8.title')}>
            <SubSection number="8.1" title={t('index.kap8.s1.title')}>
              <p>{t('index.kap8.s1.p1')}</p>
            </SubSection>

            <SubSection number="8.2" title={t('index.kap8.s2.title')}>
              <p>{t('index.kap8.s2.p1')}</p>
              <p className="font-medium text-foreground mt-4 mb-2">{t('index.kap8.s2.p2')}</p>
              <ListBlock items={tArray('index.kap8.s2.items')} />
            </SubSection>
          </ChapterSection>
        </div>

        {/* Fazit */}
        <div id="fazit" className="border-t border-chapter-divider">
          <ChapterSection title={t('index.fazit.adjacentTitle')}>
            <p>{t('index.fazit.adjacentIntro')}</p>
            <ListBlock items={tArray('index.fazit.adjacentItems')} />
          </ChapterSection>

          <ChapterSection title={t('index.fazit.thesisTitle')}>
            <p>{t('index.fazit.thesisIntro')}</p>
            <Quote>{t('index.fazit.thesisQuote')}</Quote>
            <p>{t('index.fazit.thesisP1')}</p>
            <Highlight>{t('index.fazit.thesisHighlight')}</Highlight>
            <p className="mt-6">{t('index.fazit.thesisP2')}</p>
            <ListBlock items={tArray('index.fazit.thesisItems')} />
          </ChapterSection>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 sm:py-16 mt-10 sm:mt-16 border-t border-chapter-divider relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        <img 
          src={bbOwlLogo} 
          alt="Oria" 
          className="absolute top-8 right-8 h-16 w-auto opacity-20 hidden md:block"
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-lg sm:text-2xl text-foreground mb-2">Beyond Bias through memories</p>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6">
            {t('index.footer.subtitle')}
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
            <Link 
              to="/oria" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              {t('nav.discoverOria')}
            </Link>
            <Link 
              to="/seminare" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              {t('nav.seminarOffers')}
            </Link>
            <Link 
              to="/impressum" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              {t('nav.impressum')}
            </Link>
          </div>
          
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Beyond Bias gUG. {t('index.footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
