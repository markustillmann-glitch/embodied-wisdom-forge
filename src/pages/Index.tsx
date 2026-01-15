import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChapterNav } from "@/components/ChapterNav";
import { ChapterSection } from "@/components/ChapterSection";
import { SubSection } from "@/components/SubSection";
import { Quote } from "@/components/Quote";
import { Highlight } from "@/components/Highlight";
import { ListBlock } from "@/components/ListBlock";
import { ProcessFlow } from "@/components/ProcessFlow";
import { OriaProcessFlow } from "@/components/OriaProcessFlow";
import { PolygonalBackground, ConnectionLines, GrowthSpiral, OwlSymbol, InsightSymbol, MoonSymbol } from "@/components/PolygonalBackground";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import oriaOwl from "@/assets/oria-owl.png";
import bbOwlLogo from "@/assets/bb-owl-new.png";

// Daily impulse statements - comprehensive list matching SelfcareReflection
const DAILY_IMPULSES = [
  // Selfcare
  "Manchmal gewinnt man, manchmal lernt man",
  "Wachse und gedeihe",
  "Umgib dich mit Menschen, die dich wachsen sehen wollen",
  "Betrachte die Welt, als würdest du sie zum ersten Mal sehen",
  "Je stiller du bist, desto mehr wirst du hören",
  "Scheue dich nie, um die Hilfe zu bitten, die du brauchst",
  "Begrenze nicht die Herausforderungen, fordere die Grenzen heraus",
  "Vergleichen macht unglücklich",
  "Weniger scrollen, mehr leben",
  "Lass ab von dem, was war, und vertraue dem, was kommt",
  "Eine Umarmung macht alles besser",
  "Finde heraus, was du brauchst, scheue dich nicht, darum zu bitten",
  "Aus kleinen Samen wachsen mächtige Bäume",
  "Nimm jeden Tag, wie er kommt",
  "Ein Duft kann tausend Erinnerungen zurückbringen",
  "Es sind die kleinen Dinge, die den größten Unterschied machen",
  "Kreativität ist eine unendliche Ressource: je mehr du sie nutzt, desto mehr hast du",
  "Das Leben ist ein Song: Singe!",
  "To do: Lebe den Moment",
  "Aufgeräumtes Haus, aufgeräumte Seele",
  "Wenn nicht jetzt, wann dann?",
  "Manchmal ist Entspannung das Produktivste, was man tun kann",
  "Verwandle Angst in Energie",
  "Achte auf dich von innen heraus",
  "Entwickle gesunde Gewohnheiten, nicht Einschränkungen",
  "Kleine Schritte führen zu großen Veränderungen",
  "Entspannen, erfrischen, erholen",
  "Kreiere deine eigene Stille",
  "Lehre dich die Kunst des Ausruhens",
  "Dein Heim ist ein Zufluchtsort: erfülle es mit Frieden",
  "Tanke neue Kraft, erneuere deinen Geist",
  "Verliebe dich in deine Selbstpflege",
  "Nimm dir Zeit für Dinge, die deine Seele glücklich machen",
  "In der Selbstfreundlichkeit liegt die Kraft",
  "Verbringe Quality Time mit dir selbst",
  "Lass dich von der Natur beleben",
  "Auf Regen folgt immer Sonnenschein",
  "Folge keinem Weg – gehe deinen eigenen",
  "Beruhige deinen Geist, befreie deinen Körper",
  "Dein größter Reichtum ist deine Gesundheit",
  "Nähre dich, um zu gedeihen",
  "Beginne jeden Tag mit einem positiven Gedanken und sieh, wohin er dich führt",
  "Wie du mit dir selbst sprichst, macht viel aus",
  "Das Leben ist schöner, wenn man es mit einem Freund teilt",
  "Sei freundlich zu dir selbst – du gibst dein Bestes",
  "Es gibt immer etwas, für das man dankbar sein kann",
  "Sei kämpferisch, nicht grüblerisch",
  "So, wie du bist, bist du genug",
  "Das Leben ist schöner, wenn man lacht",
  "In der Einfachheit liegt so viel Schönheit",
  "Du darfst langsam sein",
  "Ruhe ist kein Stillstand, sondern Regeneration",
  "Höre auf deinen Körper – er spricht mit dir",
  "Selbstfürsorge ist kein Luxus, sondern eine Grundlage",
  "Du musst nicht alles heute schaffen",
  "Deine Bedürfnisse sind wichtig",
  "Atme ein – lass los",
  "Grenzen setzen ist ein Akt der Selbstachtung",
  "Nicht jeder Tag muss produktiv sein",
  "Du darfst Pausen machen, ohne sie zu rechtfertigen",
  "Sanftheit ist auch eine Stärke",
  "Dein Wert hängt nicht von deiner Leistung ab",
  "Manchmal ist genug wirklich genug",
  "Erholung ist Teil des Weges, nicht die Abweichung",
  "Sei geduldig mit deinem Prozess",
  // GfK
  "Ich wünsche mir, gehört zu werden, ohne mich rechtfertigen zu müssen",
  "Mir ist wichtig, dass mein Beitrag ernst genommen wird",
  "Ich brauche Raum, um mich in meinem Tempo zu entwickeln",
  "Ich sehne mich nach Klarheit darüber, was von mir erwartet wird",
  "Ich möchte mich sicher fühlen, wenn ich meine Meinung äußere",
  "Mir tut es gut, wenn meine Anstrengungen gesehen werden",
  "Ich brauche Verlässlichkeit, um entspannen zu können",
  "Ich wünsche mir Verbindung, ohne mich verbiegen zu müssen",
  "Mir ist wichtig, selbst entscheiden zu dürfen",
  "Ich brauche Pausen, um meine Kraft zu bewahren",
  "Ich möchte verstehen, was hinter dem Verhalten anderer steht",
  "Mir gibt es Ruhe, wenn Absprachen eingehalten werden",
  "Ich wünsche mir Wertschätzung – auch für kleine Schritte",
  "Ich brauche Orientierung, um mich sicher zu fühlen",
  "Ich möchte dazugehören, ohne mich anpassen zu müssen",
  "Mir ist Fairness wichtig, auch wenn Meinungen unterschiedlich sind",
  "Ich brauche Zeit, um Vertrauen aufzubauen",
  "Ich wünsche mir Offenheit für meine Perspektive",
  "Mir ist Ehrlichkeit wichtig, auch wenn sie unbequem ist",
  "Ich brauche Unterstützung, ohne dafür schwach zu sein",
  "Ich möchte mich wirksam erleben in dem, was ich tue",
  "Mir ist es wichtig, respektvoll behandelt zu werden",
  "Ich brauche Verständnis für meine Grenzen",
  "Ich wünsche mir Leichtigkeit neben all der Verantwortung",
  "Mir gibt es Kraft, wenn ich mich verbunden fühle",
  "Ich brauche Stabilität, um mutig sein zu können",
  "Ich möchte lernen dürfen, ohne bewertet zu werden",
  "Mir ist Transparenz wichtig, um Vertrauen zu entwickeln",
  "Ich brauche Anerkennung für das, was mir wichtig ist",
  "Ich wünsche mir Gleichwertigkeit im Miteinander",
  "Ich möchte mich zeigen dürfen, so wie ich bin",
  "Mir ist wichtig, dass meine Bedürfnisse Platz haben",
  "Ich brauche Ruhe, um meine Gedanken zu sortieren",
  "Ich wünsche mir Kooperation statt Konkurrenz",
  "Mir gibt es Sicherheit, wenn Konflikte offen angesprochen werden",
  "Ich brauche Sinn in dem, was ich tue",
  "Ich möchte mich respektiert fühlen – auch bei Unterschiedlichkeit",
  "Mir ist es wichtig, lernen und wachsen zu dürfen",
  "Ich brauche Verbundenheit, besonders in schwierigen Momenten",
  "Ich wünsche mir Vertrauen in meine Fähigkeiten",
  "Ich möchte Entscheidungen mittragen können, die mich betreffen",
  "Mir ist wichtig, dass Gefühle ernst genommen werden",
  "Ich brauche Erholung, um langfristig präsent zu sein",
  "Ich wünsche mir Mitgefühl – auch für mich selbst",
  "Mir gibt es Halt, wenn ich nicht alleine bin",
  "Ich brauche Freiheit innerhalb klarer Strukturen",
  "Ich möchte beitragen, auf eine Weise, die stimmig für mich ist",
  "Mir ist wichtig, gesehen zu werden – nicht nur meine Leistung",
  "Ich brauche Hoffnung, um dranzubleiben",
  "Ich wünsche mir ein Miteinander, das nährt statt erschöpft",
  // IFS
  "Ein Teil von mir meint es gut, auch wenn sein Verhalten mich belastet",
  "Ich darf neugierig auf meine inneren Reaktionen sein",
  "Nicht alles in mir will dasselbe – und das ist okay",
  "Manche Teile versuchen, mich vor alten Verletzungen zu schützen",
  "Ich kann mir selbst mit Freundlichkeit begegnen",
  "Gefühle sind Signale, keine Befehle",
  "Ich darf innehalten, bevor ich reagiere",
  "Es gibt in mir einen ruhigen, klaren Ort",
  "Auch widersprüchliche Anteile gehören zu mir",
  "Ich muss keinen Teil loswerden, um ganz zu sein",
  "Ein Teil von mir trägt eine Geschichte, die gehört werden will",
  "Ich kann beobachten, ohne mich zu verlieren",
  "Schutzstrategien entstanden aus Notwendigkeit",
  "Ich darf lernen, meine inneren Stimmen zu unterscheiden",
  "Nicht jeder Impuls braucht sofortige Handlung",
  "Ich kann meine Anteile würdigen, ohne ihnen zu folgen",
  "Manche Teile sind sehr alt, auch wenn sie sich heute melden",
  "Ich darf Tempo rausnehmen, wenn es sich zu viel anfühlt",
  "Ich bin mehr als meine stärksten Gefühle",
  "Es ist möglich, inneren Konflikten mit Mitgefühl zu begegnen",
  "Ein Teil von mir möchte Kontrolle, ein anderer Ruhe",
  "Ich kann Raum schaffen zwischen Reiz und Reaktion",
  "Auch innere Kritiker hatten einmal eine gute Absicht",
  "Ich darf meine Verletzlichkeit schützen, ohne mich zu verschließen",
  "Nicht jeder Teil braucht Veränderung – manche brauchen Verständnis",
  "Ich kann lernen, mir selbst Sicherheit zu geben",
  "Innere Anteile dürfen sich verändern, wenn sie sich gesehen fühlen",
  "Ich muss nichts erzwingen, um mich zu entwickeln",
  "Ich darf neugierig sein statt wertend",
  "Mein inneres Erleben ist komplex – und das ist menschlich",
  "Ich kann meine Aufmerksamkeit bewusst lenken",
  "Ein Teil von mir darf Pause machen",
  "Auch starke Emotionen können gehalten werden",
  "Ich bin nicht falsch, weil es in mir laut ist",
  "Ich darf Verantwortung übernehmen, ohne mich zu überfordern",
  "Meine inneren Erfahrungen verdienen Respekt",
  "Ich kann lernen, mir selbst zuzuhören",
  "Innere Führung fühlt sich ruhig und klar an",
  "Ich darf alte Muster würdigen und neue wählen",
  "Es ist möglich, innerlich verbunden zu sein, auch im Chaos",
  "Ich kann zwischen mir und meinen Anteilen unterscheiden",
  "Nicht alles, was dringend wirkt, ist wirklich dringend",
  "Ich darf mir selbst ein sicherer Ort sein",
  "Auch ungeliebte Teile gehören zu meinem System",
  "Veränderung beginnt oft mit Zuhören",
  "Ich kann meine innere Welt erforschen, ohne sie zu kontrollieren",
  "Manche Teile brauchen Geduld, keine Lösung",
  "Ich darf mir selbst vertrauen lernen",
  "In mir gibt es Ressourcen, auch wenn ich sie gerade nicht spüre",
  "Ich kann mich innerlich führen – Schritt für Schritt"
];

const Index = () => {
  const navigate = useNavigate();
  const { t, tArray, language } = useLanguage();
  const [activeChapter, setActiveChapter] = useState("cover");
  
  // Generate random impulse - increment counter on every page visit to ensure new impulse
  const [currentImpulse] = useState(() => {
    const counter = parseInt(sessionStorage.getItem('impulseCounter') || '0', 10) + 1;
    sessionStorage.setItem('impulseCounter', counter.toString());
    const index = (counter + Math.floor(Math.random() * 10)) % DAILY_IMPULSES.length;
    return DAILY_IMPULSES[index];
  });

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
            <img src={bbOwlLogo} alt="Inner Guidance Through Lived Memories Logo" className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto" />
          <h1 className="font-serif font-medium text-foreground leading-tight text-center sm:text-left tracking-tight">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl block">Inner Guidance</span>
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-accent whitespace-nowrap block mt-1">Through Lived Memories</span>
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
                href="/oria-coach"
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

      {/* Impuls des Tages Section */}
      <section className="py-8 sm:py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-rose-500/10 to-pink-500/5" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-pink-500/80 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'de' ? 'Impuls des Tages' : 'Daily Impulse'}</span>
              <Sparkles className="w-4 h-4" />
            </div>
            
            <motion.div
              className="relative bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-fuchsia-500/10 rounded-2xl p-6 md:p-8 border border-pink-400/30 backdrop-blur-sm"
            >
              <div className="absolute top-2 left-4 text-pink-400/30 text-4xl font-serif">"</div>
              <div className="absolute bottom-2 right-4 text-pink-400/30 text-4xl font-serif rotate-180">"</div>
              
              <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed px-4">
                {currentImpulse}
              </p>
            </motion.div>
            
            <Button
              onClick={() => {
                navigate(`/selfcare-reflection?impulse=${encodeURIComponent(currentImpulse)}&autostart=true`);
              }}
              className="mt-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Jetzt reflektieren' : 'Reflect now'}
            </Button>
          </motion.div>
        </div>
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
            <p className="text-lg text-muted-foreground mb-4">
              {language === 'de' 
                ? 'Wir leben in einer Zeit permanenter Überforderung. Nicht, weil wir zu schwach sind – sondern weil zu vieles gleichzeitig auf uns einwirkt: Erwartungen, Erinnerungen, innere Stimmen, ungelöste Bedürfnisse, ein Körper im Dauer-Alarm.'
                : 'We live in a time of constant overload. Not because we are too weak – but because too much is affecting us simultaneously: expectations, memories, inner voices, unresolved needs, a body in permanent alarm.'}
            </p>
            <Link 
              to="/ueberforderung" 
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 group"
            >
              <span className="underline underline-offset-4">
                {language === 'de' ? 'Dauerhafte Überforderung hat viele Ursachen' : 'Chronic overwhelm has many causes'}
              </span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Highlight>
              {language === 'de'
                ? <><strong>Inner Guidance</strong> Through Lived Memories lädt dazu ein, diesen Zustand nicht länger zu bekämpfen oder zu optimieren, sondern darunterliegende Ursachen zu verstehen und bewusste Haltungsänderungen zu ermöglichen.</>
                : <><strong>Inner Guidance</strong> Through Lived Memories invites you to no longer fight or optimize this state, but to understand underlying causes and enable conscious shifts in attitude.</>}
            </Highlight>
            <p className="text-muted-foreground mt-6 mb-4">
              {language === 'de'
                ? <>Auf der Grundlage des Inner Compass-Frameworks – Resonanz · Bedürfnisse · Körper · Erinnerung · Beziehung – erklärt <strong>Inner Guidance</strong> Through Lived Memories, wie innere Klarheit und Regulation entstehen können, ohne analysiert, bewertet oder repariert zu werden. Es verbindet Erkenntnisse aus Bedürfnisarbeit, körperbasierter Selbstwahrnehmung, moderner Erinnerungsforschung und beziehungsorientierten Modellen zu einer sanften, alltagstauglichen Landkarte für innere Orientierung.</>
                : <>Based on the Inner Compass Framework – Resonance · Needs · Body · Memory · Relationship – <strong>Inner Guidance</strong> Through Lived Memories shows how inner clarity and regulation can emerge without being analyzed, judged, or repaired. It combines insights from needs work, body-based self-perception, modern memory research, and relationship-oriented models into a gentle, everyday-friendly map for inner orientation.</>}
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
                ? <><strong>Inner Guidance</strong> Through Lived Memories richtet sich an Menschen, die spüren, dass konstante Überforderung kein persönliches Versagen ist, sondern ein Systemzustand – und dass der Weg aus der Überforderung heraus nicht ist, mehr, schneller, effizienter zu werden, sondern zu verstehen, was einen in die Überforderung treibt und wie man dem stimmig begegnen kann.</>
                : <><strong>Inner Guidance</strong> Through Lived Memories is for people who sense that constant overload is not a personal failure, but a systemic state – and that the way beyond it becomes not faster, but more coherent.</>}
            </p>
            <Highlight>
              {language === 'de'
                ? <><strong>Inner Guidance</strong> Through Lived Memories ist eine Einladung, wieder in Resonanz zu kommen – mit sich selbst, dem eigenen Körper, der eigenen Geschichte und den Beziehungen, die uns tragen.</>
                : <><strong>Inner Guidance</strong> Through Lived Memories is an invitation to come back into resonance – with yourself, your own body, your own history, and the relationships that support us.</>}
            </Highlight>
          </ChapterSection>
        </div>

        {/* Die Kraft positiver Erinnerungen nutzen */}
        <div id="positive" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Die Kraft positiver Erinnerungen nutzen' : 'Harnessing the Power of Positive Memories'}>
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

        {/* Belastende Erfahrungen nicht ignorieren */}
        <div id="belastend" className="border-t border-chapter-divider">
          <ChapterSection title={language === 'de' ? 'Belastende Erfahrungen nicht ignorieren' : "Don't Ignore Difficult Experiences"}>
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
                ? 'Statt diese Erfahrungen zu verdrängen oder auf der Sachebene zu analysieren, unterstützt das Inner Compass Framework dabei:'
                : 'Instead of suppressing or analyzing these experiences on a purely factual level, the Inner Compass Framework supports:'}
            </p>
            <ListBlock items={language === 'de'
              ? ['ihnen achtsam und dosiert zu begegnen', 'innere Signale besser einzuordnen', 'die Gefühls- und Erinnerungsebene zu aktivieren', 'erste Schritte zu mehr Entlastung zu finden']
              : ['meeting them mindfully and in measured doses', 'better understanding inner signals', 'activating the emotional and memory level', 'finding first steps toward more relief']}
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
                ? <><strong>Inner Guidance</strong> Through Lived Memories hilft dabei, Erinnerungen die oft eng mit Beziehungen verbunden sind, bewusster wahrzunehmen:</>
                : <><strong>Inner Guidance</strong> Through Lived Memories helps with memories that are often closely connected to relationships:</>}
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
          <ChapterSection title={language === 'de' ? 'Der Oria-Prozess' : 'The Oria Process'}>
            <p className="mb-6 text-lg text-muted-foreground">
              {language === 'de'
                ? 'Oria begleitet dich Schritt für Schritt – von der ersten Reflexion bis zur dauerhaften Selbsterkenntnis. Du bestimmst Tempo und Tiefe.'
                : 'Oria guides you step by step – from the first reflection to lasting self-insight. You determine the pace and depth.'}
            </p>
            
            <OriaProcessFlow />

            <div className="mt-8 space-y-4">
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Oria steht dir als alltägliche Unterstützung zur Seite:'
                  : 'Oria is there as everyday support:'}
              </p>
              <ListBlock items={language === 'de'
                ? ['bei Fragen, Unsicherheiten oder innerer Unruhe', 'beim Reflektieren von Erinnerungen und Beziehungen', 'beim Stärken positiver Erfahrungen', 'beim Einordnen belastender Gedanken oder Situationen']
                : ['with questions, uncertainties, or inner unrest', 'when reflecting on memories and relationships', 'when strengthening positive experiences', 'when contextualizing difficult thoughts or situations']}
              />
            </div>
            
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
          <p className="font-serif text-xl sm:text-2xl text-foreground mb-2 tracking-tight">Inner Guidance Through Lived Memories</p>
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
            <Link 
              to="/oria-landkarte" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Oria für Partner
            </Link>
            <Link 
              to="/oria-unternehmen" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              {language === 'de' ? 'Oria für Unternehmen' : 'Oria for Companies'}
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
