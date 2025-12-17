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
    { id: "cover", title: language === 'de' ? 'Titel' : 'Cover' },
    { id: "intro", title: language === 'de' ? 'Worum geht es?' : 'What is it about?' },
    { id: "positive", title: language === 'de' ? 'Positive Erinnerungen' : 'Positive Memories' },
    { id: "belastend", title: language === 'de' ? 'Belastende Erfahrungen' : 'Difficult Experiences' },
    { id: "beziehungen", title: language === 'de' ? 'Beziehungen' : 'Relationships' },
    { id: "konkret", title: language === 'de' ? 'Wie hilft das?' : 'How does it help?' },
    { id: "oria", title: 'Oria' },
    { id: "zielgruppe", title: language === 'de' ? 'Für wen?' : 'For whom?' },
    { id: "fazit", title: language === 'de' ? 'Fazit' : 'Summary' },
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
            <img src={bbOwlLogo} alt="Beyond the Shallow Logo" className="h-16 sm:h-[5.5rem] md:h-[6.875rem] lg:h-[8.25rem] w-auto" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-foreground leading-tight text-center sm:text-left">
              Beyond the Shallow
              <br />
              <span className="text-accent whitespace-nowrap">Through Memories</span>
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
                href="/modell"
                className="inline-flex items-center gap-2 text-sm font-sans tracking-wider text-foreground hover:text-accent transition-colors border border-border px-4 py-2 rounded-full"
              >
                <span>{language === 'de' ? 'Das Modell' : 'The Model'}</span>
                <span>📖</span>
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
        {/* Worum geht es? */}
        <div id="intro" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Worum geht es?' : 'What is it about?'}>
            <p className="text-lg text-muted-foreground mb-6">
              {language === 'de' 
                ? 'Viele Menschen leben im Alltag vor allem an der Oberfläche: in Rollen, Erwartungen, schnellen Reaktionen und Gedankenschleifen. Gleichzeitig wirken Erinnerungen, Beziehungen und Körperempfindungen oft im Hintergrund weiter.'
                : 'Many people live their daily lives mostly on the surface: in roles, expectations, quick reactions, and thought loops. At the same time, memories, relationships, and body sensations often continue to work in the background.'}
            </p>
            <Highlight>
              {language === 'de'
                ? 'Beyond the Shallow lädt dazu ein, sanft hinter diese Oberfläche zu schauen – und über Erinnerungen wieder Zugang zu innerer Tiefe, Orientierung und Verbindung zu finden.'
                : 'Beyond the Shallow invites you to gently look behind this surface – and through memories, find access to inner depth, orientation, and connection again.'}
            </Highlight>
          </ChapterSection>
        </div>

        {/* Die Kraft positiver Erinnerungen */}
        <div id="positive" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Die Kraft positiver Erinnerungen' : 'The Power of Positive Memories'}>
            <p className="mb-4">
              {language === 'de'
                ? 'Positive Erinnerungen sind mehr als schöne Gedanken. Sie tragen gespeicherte Erfahrungen von:'
                : 'Positive memories are more than beautiful thoughts. They carry stored experiences of:'}
            </p>
            <ListBlock items={language === 'de' 
              ? ['Sicherheit', 'Nähe', 'Vertrauen', 'Freude', 'innerer Ruhe']
              : ['Safety', 'Closeness', 'Trust', 'Joy', 'Inner calm']} 
            />
            <p className="mt-6">
              {language === 'de'
                ? 'Das Modell hilft dabei, diese wohltuenden Erinnerungen bewusst zu aktivieren und zu stärken. So können sie im Alltag wieder spürbarer werden – als innere Ressource, als Gegengewicht zu Stress, Unsicherheit oder Überforderung.'
                : 'The model helps to consciously activate and strengthen these soothing memories. This way, they can become more palpable again in everyday life – as an inner resource, as a counterweight to stress, uncertainty, or overwhelm.'}
            </p>
            <Quote>
              {language === 'de'
                ? 'Was sich gut angefühlt hat, darf wieder Raum bekommen.'
                : 'What felt good is allowed to have space again.'}
            </Quote>
          </ChapterSection>
        </div>

        {/* Auch für belastende Erfahrungen */}
        <div id="belastend" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Auch für belastende Erfahrungen' : 'Also for Difficult Experiences'}>
            <p className="mb-4">
              {language === 'de'
                ? 'Gleichzeitig berücksichtigt das Modell, dass viele Menschen mit:'
                : 'At the same time, the model acknowledges that many people live with:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['wiederkehrenden, schwierigen Erinnerungen', 'Gedankenschleifen', 'Ängsten', 'unangenehmen Körperempfindungen']
              : ['recurring, difficult memories', 'thought loops', 'fears', 'uncomfortable body sensations']}
            />
            <p className="mt-4 mb-2">
              {language === 'de' ? 'leben.' : ''}
            </p>
            <p className="mb-4">
              {language === 'de'
                ? 'Statt diese Erfahrungen zu verdrängen oder zu analysieren, unterstützt das Modell dabei:'
                : 'Instead of suppressing or analyzing these experiences, the model supports:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['ihnen achtsam und dosiert zu begegnen', 'innere Signale besser einzuordnen', 'erste Schritte zu mehr Entlastung zu finden']
              : ['meeting them mindfully and in measured doses', 'better understanding inner signals', 'finding first steps toward more relief']}
            />
            <Highlight>
              {language === 'de'
                ? 'Dabei geht es nicht um „Lösen um jeden Preis", sondern um einen besseren Umgang und mehr Selbstregulation.'
                : 'This is not about "solving at any cost," but about better coping and more self-regulation.'}
            </Highlight>
          </ChapterSection>
        </div>

        {/* Beziehungen bewusst gestalten */}
        <div id="beziehungen" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Beziehungen bewusst gestalten' : 'Consciously Shaping Relationships'}>
            <p className="mb-4">
              {language === 'de'
                ? 'Erinnerungen sind oft eng mit Beziehungen verbunden. Beyond the Shallow · Through Memories hilft dabei:'
                : 'Memories are often closely connected to relationships. Beyond the Shallow · Through Memories helps with:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['wohltuende, stärkende Beziehungen bewusster wahrzunehmen', 'Nähe, Vertrauen und Verbundenheit zu aktivieren', 'zu erkennen, welche Begegnungen guttun']
              : ['becoming more aware of nurturing, strengthening relationships', 'activating closeness, trust, and connection', 'recognizing which encounters are good for you']}
            />
            <p className="mt-6 mb-4">
              {language === 'de'
                ? 'Gleichzeitig unterstützt das Modell dabei, einen klareren und gesünderen Umgang mit belastenden Beziehungen zu entwickeln – zum Beispiel durch:'
                : 'At the same time, the model supports developing a clearer and healthier way of dealing with difficult relationships – for example through:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['bessere innere Abgrenzung', 'Verständnis für eigene Reaktionen', 'neue Perspektiven auf wiederkehrende Beziehungsmuster']
              : ['better inner boundaries', 'understanding your own reactions', 'new perspectives on recurring relationship patterns']}
            />
          </ChapterSection>
        </div>

        {/* Wie hilft das konkret? */}
        <div id="konkret" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Wie hilft das konkret?' : 'How Does This Help Concretely?'}>
            <p className="mb-4">
              {language === 'de' ? 'Das Modell unterstützt dabei:' : 'The model helps with:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['innere Muster zu erkennen', 'zwischen Vergangenheit und Gegenwart zu unterscheiden', 'Körperempfindungen als Hinweise zu verstehen', 'Ressourcen, Beziehungen und Unterstützung gezielt zu nutzen']
              : ['recognizing inner patterns', 'distinguishing between past and present', 'understanding body sensations as signals', 'purposefully using resources, relationships, and support']}
            />
            <p className="mt-6 mb-4">
              {language === 'de' ? 'Daraus entstehen Ansätze, wie:' : 'This leads to approaches for:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['das eigene Wohlbefinden gestärkt werden kann', 'man sich Themen in einem passenden Tempo nähert', 'welche Form von Coaching oder Begleitung sinnvoll sein könnte']
              : ['strengthening your own well-being', 'approaching topics at an appropriate pace', 'which form of coaching or support might be meaningful']}
            />
          </ChapterSection>
        </div>

        {/* Oria – dein täglicher Begleiter */}
        <div id="oria" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Oria – dein täglicher Begleiter' : 'Oria – Your Daily Companion'}>
            <p className="mb-4">
              {language === 'de'
                ? 'Oria steht als alltägliche Unterstützung zur Seite:'
                : 'Oria is there as everyday support:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['bei Fragen, Unsicherheiten oder innerer Unruhe', 'beim Reflektieren von Erinnerungen und Beziehungen', 'beim Stärken positiver Erfahrungen', 'beim Einordnen belastender Gedanken oder Situationen']
              : ['with questions, uncertainties, or inner unrest', 'when reflecting on memories and relationships', 'when strengthening positive experiences', 'when contextualizing difficult thoughts or situations']}
            />
            <p className="mt-6 mb-4">
              {language === 'de' ? 'Oria hilft dabei:' : 'Oria helps with:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['Zusammenhänge zu erkennen', 'kleine, machbare Schritte zu finden', 'und wahrzunehmen, wann professionelle therapeutische Unterstützung wichtig ist']
              : ['recognizing connections', 'finding small, manageable steps', 'and perceiving when professional therapeutic support is important']}
            />
            <Highlight>
              {language === 'de'
                ? 'Oria ersetzt keine Therapie – unterstützt aber Orientierung, Selbstverständnis und Selbstfürsorge im Alltag.'
                : 'Oria does not replace therapy – but supports orientation, self-understanding, and self-care in everyday life.'}
            </Highlight>
          </ChapterSection>
        </div>

        {/* Für wen ist das Modell geeignet? */}
        <div id="zielgruppe" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Für wen ist das Modell geeignet?' : 'Who Is the Model Suitable For?'}>
            <p className="mb-4">
              {language === 'de' ? 'Für Menschen, die:' : 'For people who:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['sich selbst besser verstehen möchten', 'positive Erfahrungen bewusster nutzen wollen', 'mit belastenden Erinnerungen oder Beziehungen umgehen möchten', 'mehr Verbindung, Leichtigkeit und Klarheit suchen', 'einen sanften, nicht überfordernden Zugang bevorzugen']
              : ['want to understand themselves better', 'want to use positive experiences more consciously', 'want to deal with difficult memories or relationships', 'seek more connection, lightness, and clarity', 'prefer a gentle, non-overwhelming approach']}
            />
          </ChapterSection>
        </div>

        {/* Fazit - In einem Satz */}
        <div id="fazit" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'In einem Satz' : 'In One Sentence'}>
            <Quote>
              {language === 'de'
                ? 'Beyond the Shallow · Through Memories ist ein Modell, das dabei hilft, stärkende Erinnerungen zu vertiefen, belastenden Erfahrungen achtsam zu begegnen und über Erinnerung, Körper und Beziehung Wege zu mehr Wohlbefinden, Klarheit und passender Unterstützung zu finden.'
                : 'Beyond the Shallow · Through Memories is a model that helps deepen strengthening memories, mindfully meet difficult experiences, and find paths to more well-being, clarity, and appropriate support through memory, body, and relationship.'}
            </Quote>
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
          <p className="font-serif text-lg sm:text-2xl text-foreground mb-2">Beyond the Shallow Through Memories</p>
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
