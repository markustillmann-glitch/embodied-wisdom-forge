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
import { Header } from "@/components/Header";
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
      <Header showAdminLink />
      
      <ChapterNav
        chapters={chapters}
        activeChapter={activeChapter}
        onChapterClick={scrollToChapter}
      />

      {/* Hero / Cover */}
      <section id="cover" className="min-h-[100svh] flex items-center justify-center relative overflow-hidden pt-20 pb-12 sm:pt-16 md:pt-0 md:pb-0">
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
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
            <img src={bbOwlLogo} alt="Beyond Constant Overload Logo" className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground leading-tight text-center sm:text-left tracking-tight">
              Beyond Constant Overload
              <br />
              <span className="text-accent whitespace-nowrap">Through Memories</span>
            </h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans max-w-xl mx-auto mt-6 sm:mt-8 leading-relaxed px-2"
          >
            {t('index.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 sm:mt-12 flex flex-col items-center gap-5 sm:gap-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <a
                href="/coach"
                className="inline-flex flex-col items-center gap-0.5 text-sm font-sans tracking-wider bg-accent text-accent-foreground px-5 py-2.5 rounded-full hover:bg-accent/90 transition-colors"
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
                <span>{language === 'de' ? 'Inner Compass' : 'Inner Compass'}</span>
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
      <section className="py-10 sm:py-14 md:py-16 border-t border-chapter-divider relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-foreground/80 mb-3 sm:mb-4">
              {t('index.tagline')}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-xl mx-auto">
              {t('index.taglineDesc')}
            </p>
            <p className="text-muted-foreground font-sans mt-3 sm:mt-4 text-xs sm:text-sm">
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
                ? 'Wir leben in einer Zeit permanenter Überforderung. Nicht, weil wir zu schwach sind – sondern weil zu vieles gleichzeitig auf uns einwirkt: Erwartungen, Erinnerungen, innere Stimmen, ungelöste Bedürfnisse, ein Körper im Dauer-Alarm.'
                : 'We live in a time of constant overload. Not because we are too weak – but because too much is affecting us simultaneously: expectations, memories, inner voices, unresolved needs, a body in permanent alarm.'}
            </p>
            <Highlight>
              {language === 'de'
                ? 'Beyond Constant Overload lädt dazu ein, diesen Zustand nicht länger zu bekämpfen oder zu optimieren, sondern ihn zu verstehen.'
                : 'Beyond Constant Overload invites you to no longer fight or optimize this state, but to understand it.'}
            </Highlight>
            <p className="text-muted-foreground mt-6 mb-4">
              {language === 'de'
                ? 'Auf der Grundlage des Inner Compass-Frameworks – Resonanz · Bedürfnisse · Körper · Erinnerung · Beziehung – erklärt Beyond Constant Overload, wie innere Klarheit und Regulation entstehen können, ohne analysiert, bewertet oder repariert zu werden. Es verbindet Erkenntnisse aus Bedürfnisarbeit, körperbasierter Selbstwahrnehmung, moderner Erinnerungsforschung und beziehungsorientierten Modellen zu einer sanften, alltagstauglichen Landkarte für innere Orientierung.'
                : 'Based on the Inner Compass Framework – Resonance · Needs · Body · Memory · Relationship – this book shows how inner clarity and regulation can emerge without being analyzed, judged, or repaired. It combines insights from needs work, body-based self-perception, modern memory research, and relationship-oriented models into a gentle, everyday-friendly map for inner orientation.'}
            </p>
            <p className="text-muted-foreground mb-4">
              {language === 'de'
                ? 'Im Mittelpunkt stehen keine Methoden, die „besser funktionieren" versprechen, sondern eine Haltung des Zuhörens:'
                : 'The focus is not on methods that promise to "work better," but on an attitude of listening:'}
            </p>
            <p className="text-muted-foreground italic mb-4">
              {language === 'de'
                ? 'Was ist jetzt wirklich relevant? Was braucht Raum – und was darf leiser werden?'
                : 'What is really relevant now? What needs space – and what can become quieter?'}
            </p>
            <p className="text-muted-foreground mb-6">
              {language === 'de'
                ? 'Beyond Constant Overload richtet sich an Menschen, die spüren, dass konstante Überforderung kein persönliches Versagen ist, sondern ein Systemzustand – und dass der Weg aus der Überforderung heraus nicht ist, mehr, schneller, effizienter zu werden sondern zu verstehen was einen in die Überforderung treibt und wie man dem stimmig begegnen kann.'
                : 'This book is for people who sense that constant overload is not a personal failure, but a systemic state – and that the way beyond it becomes not faster, but more coherent.'}
            </p>
            <Highlight>
              {language === 'de'
                ? 'Beyond Constant Overload ist eine Einladung, wieder in Resonanz zu kommen – mit sich selbst, dem eigenen Körper, der eigenen Geschichte und den Beziehungen, die uns tragen.'
                : 'Beyond Constant Overload is an invitation to come back into resonance – with yourself, your own body, your own history, and the relationships that support us.'}
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
                ? 'Das Inner Compass Framework hilft dabei, diese wohltuenden Erinnerungen bewusst zu aktivieren und zu stärken. So können sie im Alltag wieder spürbarer werden – als innere Ressource, als Gegengewicht zu Stress, Unsicherheit oder Überforderung.'
                : 'The Inner Compass Framework helps to consciously activate and strengthen these soothing memories. This way, they can become more palpable again in everyday life – as an inner resource, as a counterweight to stress, uncertainty, or overwhelm.'}
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
                ? 'Gleichzeitig berücksichtigt das Inner Compass Framework, dass viele Menschen mit:'
                : 'At the same time, the Inner Compass Framework acknowledges that many people live with:'}
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
                ? 'Statt diese Erfahrungen zu verdrängen oder zu analysieren, unterstützt das Inner Compass Framework dabei:'
                : 'Instead of suppressing or analyzing these experiences, the Inner Compass Framework supports:'}
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
                ? 'Erinnerungen sind oft eng mit Beziehungen verbunden. Beyond Constant Overload · Through Memories hilft dabei:'
                : 'Memories are often closely connected to relationships. Beyond Constant Overload · Through Memories helps with:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['wohltuende, stärkende Beziehungen bewusster wahrzunehmen', 'Nähe, Vertrauen und Verbundenheit zu aktivieren', 'zu erkennen, welche Begegnungen guttun']
              : ['becoming more aware of nurturing, strengthening relationships', 'activating closeness, trust, and connection', 'recognizing which encounters are good for you']}
            />
            <p className="mt-6 mb-4">
              {language === 'de'
                ? 'Gleichzeitig unterstützt das Inner Compass Framework dabei, einen klareren und gesünderen Umgang mit belastenden Beziehungen zu entwickeln – zum Beispiel durch:'
                : 'At the same time, the Inner Compass Framework supports developing a clearer and healthier way of dealing with difficult relationships – for example through:'}
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
              {language === 'de' ? 'Das Inner Compass Framework unterstützt dabei:' : 'The Inner Compass Framework helps with:'}
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
            <p className="mb-6 text-lg text-muted-foreground">
              {language === 'de'
                ? 'Oria wurde mit dem Ziel entwickelt, ein täglicher Begleiter zu sein – mit dem man schöne oder schwierige Erinnerungen erfassen, analysieren und vertiefen kann. Und das wann immer man möchte. Darüber hinaus lassen sich mit Oria Gedanken, die in Coaching Sessions, auf Seminaren oder einfach so im Alltag entstanden sind, leicht fortführen und vertiefen. Oria basiert auf dem Inner Compass Framework und verbindet dessen wissenschaftliche Grundlagen mit einer einfühlsamen, persönlichen Begleitung.'
                : 'Oria was developed with the goal of being a daily companion – one that helps you capture, analyze, and deepen beautiful or difficult memories. Whenever you want. Beyond that, Oria makes it easy to continue and deepen thoughts that arose in coaching sessions, seminars, or simply in everyday life. Oria is based on the Inner Compass Framework and combines its scientific foundations with empathetic, personal guidance.'}
            </p>
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

        {/* Für wen ist das Inner Compass Framework geeignet? */}
        <div id="zielgruppe" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Für wen ist das Inner Compass Framework geeignet?' : 'Who Is the Inner Compass Framework Suitable For?'}>
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
                ? 'Das Inner Compass Framework hilft dabei, stärkende Erinnerungen zu vertiefen, belastenden Erfahrungen achtsam zu begegnen und über Erinnerung, Körper und Beziehung Wege zu mehr Wohlbefinden, Klarheit und passender Unterstützung zu finden.'
                : 'The Inner Compass Framework helps deepen strengthening memories, mindfully meet difficult experiences, and find paths to more well-being, clarity, and appropriate support through memory, body, and relationship.'}
            </Quote>
          </ChapterSection>
        </div>

        {/* Security Summary Section */}
        <div className="border-t border-chapter-divider py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/40 rounded-2xl p-6 sm:p-8 border border-border"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif text-foreground mb-2">
                  {language === 'de' ? 'Geprüfte Sicherheit' : 'Verified Security'}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                  {language === 'de'
                    ? 'Oria wird gemeinsam mit führenden IT-Sicherheitsexperten für maximale Sicherheit entwickelt. KI-Fachleute überwachen die Algorithmen, und Psychotherapeuten, GfK-Trainer sowie IFS-Coaches validieren die inhaltliche und psychologische Sicherheit.'
                    : 'Oria is developed together with leading IT security experts for maximum security. AI specialists monitor algorithms, and psychotherapists, NVC trainers, and IFS coaches validate content and psychological safety.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-background/60 px-2.5 py-1 rounded-full text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {language === 'de' ? 'Datenverschlüsselung' : 'Data Encryption'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-background/60 px-2.5 py-1 rounded-full text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {language === 'de' ? 'KI-Audits' : 'AI Audits'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-background/60 px-2.5 py-1 rounded-full text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {language === 'de' ? 'Psychologische Aufsicht' : 'Psychological Oversight'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-background/60 px-2.5 py-1 rounded-full text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {language === 'de' ? 'Testgruppen-Validierung' : 'Test Group Validation'}
                  </span>
                </div>
                <Link 
                  to="/sicherheit"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  {language === 'de' ? 'Alle Sicherheitsstandards ansehen' : 'View all security standards'}
                  <span>→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 sm:py-16 mt-8 sm:mt-12 border-t border-chapter-divider relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        <img 
          src={bbOwlLogo} 
          alt="Oria" 
          className="absolute top-8 right-8 h-16 w-auto opacity-20 hidden md:block"
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-xl sm:text-2xl text-foreground mb-2 tracking-tight">Beyond the Shallow Through Memories</p>
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
