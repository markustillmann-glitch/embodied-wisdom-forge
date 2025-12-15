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
import oriaOwl from "@/assets/oria-owl.png";
import bbOwlLogo from "@/assets/bb-owl-new.png";
const chapters = [
  { id: "cover", title: "Cover" },
  { id: "vorwort", title: "Vorwort" },
  { id: "kap1", title: "Erinnerung", number: "1" },
  { id: "kap2", title: "Body Memory", number: "2" },
  { id: "kap3", title: "Meditation", number: "3" },
  { id: "kap4", title: "IFS", number: "4" },
  { id: "kap5", title: "NVC", number: "5" },
  { id: "kap6", title: "Prozessmodell", number: "6" },
  { id: "kap7", title: "Bias", number: "7" },
  { id: "kap8", title: "Journaling", number: "8" },
  { id: "fazit", title: "Fazit" },
];

const Index = () => {
  const [activeChapter, setActiveChapter] = useState("cover");

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
  }, []);

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
            Ein erinnerungsbasiertes Handlungsmodell zum Umgang mit Stress, Bias und Prägungen
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
              <span>Beginnen</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ↓
              </motion.span>
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <a
                href="/oria"
                className="inline-flex items-center gap-2 text-sm font-sans tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <img src={bbOwlLogo} alt="Oria" className="h-5 sm:h-6 w-auto opacity-70" />
                <span>Oria kennenlernen</span>
              </a>
              <span className="text-muted-foreground/50 hidden sm:inline">|</span>
              <a
                href="/seminare"
                className="inline-flex items-center gap-2 text-sm font-sans tracking-wider text-accent hover:text-accent/80 transition-colors"
              >
                <span>Seminarangebot entdecken</span>
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
              Für mehr Klarheit in Zeiten konstanter Überforderung.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-xl mx-auto">
              Das Handlungsmodell von Beyond Bias verbindet moderne Neurobiologie 
              und Epigenetik mit praktischer Selbstführungskompetenz.
            </p>
            <p className="text-muted-foreground font-sans mt-4 text-xs sm:text-sm">
              Kein Ratgeber oder Theoriemodell, sondern Landkarte, praktischer Wegweiser und Transformationshilfe für das menschliche Betriebssystem unter Druck.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vorwort */}
        <div id="vorwort" className="border-t border-chapter-divider">
          <ChapterSection title="Vorwort: Wenn viel auf dem Spiel steht">
            <p className="text-xl text-muted-foreground italic mb-8">
              Weshalb dieses Wissen entscheidend ist für Führung und Selbststeuerung.
            </p>
            <p>
              In der modernen Führung – sei es von Unternehmen, Teams oder dem eigenen Leben – stoßen 
              rein kognitive Strategien an ihre Grenzen. Wir wissen oft intellektuell, was die richtige 
              Entscheidung oder die richtige Art der Kommunikation wäre. Doch unter Druck, Zeitmangel 
              oder in Konflikten greifen wir auf automatisierte Muster zurück.
            </p>
            <Highlight>
              Wir handeln nicht nach unserem besten Wissen, sondern nach unserem am tiefsten verankerten Zustand.
            </Highlight>
            <p>
              Dieses Mini-Buch schließt die Lücke zwischen dem Anspruch („Ich will besonnen und 
              strategisch handeln") und der Realität („Ich wurde getriggert und habe reagiert").
            </p>
            <Quote>
              Der Mensch ist kein denkendes Wesen mit einem Körper – sondern ein verkörpertes Wesen, 
              das denken gelernt hat.
            </Quote>
            <p>
              Erinnerungen, Impulse, Vorurteile (Bias) und Selbstbilder entstehen nicht primär im Kopf. 
              Sie entstehen in einem Zusammenspiel aus Körperzustand, uralten Überlebensprogrammen, 
              epigenetischem Erbe und inneren Anteilen.
            </p>
            <p className="font-medium text-foreground">
              Wer führt, führt nicht nur Köpfe, sondern reguliert Nervensysteme – zuerst das eigene, 
              dann das des Systems. Dieses Kompendium liefert die Architektur dafür.
            </p>
          </ChapterSection>
        </div>

        {/* Kapitel 1 */}
        <div id="kap1" className="border-t border-chapter-divider">
          <ChapterSection number="1" title="Was Erinnerung wirklich ist">
            <SubSection number="1.1" title="Erinnerung ist kein Archiv">
              <p>
                Die verbreitetste Illusion über unser Gedächtnis ist die des „Videoarchivs". 
                Wir glauben, wir rufen ab, was exakt gespeichert wurde. Das ist falsch.
              </p>
              <Highlight>
                Erinnerungen sind keine gespeicherten Filme, sondern rekonstruierte Zustände.
              </Highlight>
              <p>
                Bei jedem Erinnern werden verschiedene Fragmente im Gehirn neu kombiniert:
              </p>
              <ListBlock items={[
                "Sinneseindrücke (Gerüche, Geräusche)",
                "Damalige Emotionen",
                "Aktuelle Körperzustände",
                "Bedeutungen, die wir dem Ereignis heute geben",
              ]} />
              <p className="text-accent font-medium mt-6">
                Fazit: Jede Erinnerung ist keine Reise in die Vergangenheit, sondern aktive 
                Gegenwartsarbeit. Wie wir uns heute fühlen, bestimmt, was wir von gestern erinnern.
              </p>
            </SubSection>

            <SubSection number="1.2" title="Explizites vs. implizites Gedächtnis">
              <p>
                Um menschliches Verhalten zu verstehen, müssen wir zwei Speichersysteme unterscheiden:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-card p-4 sm:p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2 text-sm sm:text-base">1. Explizites Gedächtnis</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">(Der Verstand)</p>
                  <ListBlock items={[
                    "Fakten, Geschichten, chronologische Abläufe",
                    "Sprachlich und bewusst zugänglich",
                  ]} />
                  <p className="text-xs sm:text-sm italic text-muted-foreground mt-3">
                    „Ich weiß noch, dass…"
                  </p>
                </div>
                <div className="bg-card p-4 sm:p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2 text-sm sm:text-base">2. Implizites Gedächtnis</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">(Der Körper & das Gefühl)</p>
                  <ListBlock items={[
                    "Körperreaktionen, automatisierte Erwartungen",
                    "Vorsprachlich, schneller und unbewusst",
                  ]} />
                  <p className="text-xs sm:text-sm italic text-muted-foreground mt-3">
                    „Es fühlt sich plötzlich so an, als ob…"
                  </p>
                </div>
              </div>
              <Quote>
                Das implizite Gedächtnis ist älter, schneller und hochgradig auf Sicherheit und 
                Beziehung ausgerichtet. Es steuert unsere Sofortreaktionen.
              </Quote>
            </SubSection>

            <SubSection number="1.3" title="Memory Trigger">
              <p>
                Ein Trigger (Auslöser durch Musik, Orte, Tonlagen, soziale Situationen wie Kritik) 
                öffnet nicht nur eine mentale Datei. Er aktiviert eine ganze „Zustandslandschaft".
              </p>
              <div className="bg-quote-bg p-6 rounded-lg mt-4 text-center">
                <p className="font-sans font-medium text-foreground">
                  Ein Trigger aktiviert eine Kette:
                </p>
                <p className="text-muted-foreground mt-3 text-sm">
                  Erinnerung (implizit) + Alter Körperzustand + Schutzstrategie + Aktuelles Bedürfnis
                </p>
              </div>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 2 */}
        <div id="kap2" className="border-t border-chapter-divider">
          <ChapterSection number="2" title="Das somatische Gedächtnis (Body Memory)">
            <SubSection number="2.1" title="Was der Körper speichert">
              <p>
                Während der Verstand die „Story" speichert, speichert der Körper die „Energie" 
                der Situation. Er registriert vor allem:
              </p>
              <ListBlock items={[
                "Alarm- vs. Sicherheitszustände",
                "Bindungserfahrungen (War ich willkommen? War ich allein?)",
                "Ohnmacht vs. Handlungsspielraum",
                "Rhythmus, Atemmuster, muskuläre Spannung",
              ]} />
              <Highlight>
                Der Körper speichert nicht primär „was passiert ist", sondern die Antwort auf 
                die Frage: „Wie sicher war ich?"
              </Highlight>
            </SubSection>

            <SubSection number="2.2" title="Warum der Körper schneller ist als das Denken">
              <p>
                Dies ist der entscheidende Punkt für Führung und Selbstmanagement unter Stress: 
                Neurobiologisch reagieren der Körper und das limbische System (Emotionszentrum) 
                in Millisekunden auf einen Reiz. Die Kognition (das bewusste Denken) folgt deutlich verzögert.
              </p>
              <Quote>
                Das Denken ist oft nur der „Pressesprecher", der nachträglich erklärt 
                (oder rationalisiert), was der Körper längst entschieden hat.
              </Quote>
              <p>
                Das erklärt Phänomene wie emotionale Überreaktionen und den Satz: 
                „Ich weiß es rational besser, aber ich kann gerade nicht anders."
              </p>
            </SubSection>

            <SubSection number="2.3" title="Body Memory ist nicht pathologisch">
              <p>
                Das somatische Gedächtnis ist nicht „kaputt" oder irrational. Es ist ein 
                hocheffizientes Schutzsystem, das auf vergangenen Erfahrungen basiert.
              </p>
            </SubSection>

            <SubSection number="2.4" title="Das Erbe in den Zellen: Epigenetik">
              <p>
                Das implizite Gedächtnis beginnt nicht erst mit der eigenen Geburt. Die Forschung 
                der Epigenetik zeigt, dass traumatische Erfahrungen, langanhaltende Stresszustände 
                oder existenzielle Krisen Marker auf der DNA hinterlassen, die vererbt werden können.
              </p>
              <p className="font-medium text-foreground mt-4">Das bedeutet:</p>
              <ListBlock items={[
                "Ein Nervensystem kann mit einer erhöhten Alarmbereitschaft auf die Welt kommen, ohne selbst je Gefahr erlebt zu haben.",
                "Bestimmte Trigger (z.B. Autorität, Mangel, Plötzlichkeit) aktivieren Ängste, die eigentlich die Realität der Eltern oder Großeltern widerspiegeln.",
              ]} />
              <Quote>
                Wir erinnern uns biologisch an die Krisen unserer Vorfahren. Das erklärt oft 
                diffuse Ängste oder Blockaden, die „keinen Sinn ergeben", wenn wir nur auf 
                die eigene Biografie schauen.
              </Quote>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 3 */}
        <div id="kap3" className="border-t border-chapter-divider">
          <ChapterSection number="3" title="Meditation als Zugang (und Risiko)">
            <SubSection number="3.1" title="Was Meditation wirklich macht">
              <p>
                In diesem Kontext ist Meditation keine Entspannungstechnik, sondern ein 
                Wahrnehmungswerkzeug. Sie tut drei Dinge:
              </p>
              <ListBlock ordered items={[
                "Sie reduziert äußere Reize (Stille).",
                "Sie erhöht die Interozeption (die Fähigkeit, Signale aus dem Körperinneren wahrzunehmen).",
                'Sie senkt die kognitive Kontrolle (das „Gedankenkarussell" wird leiser).',
              ]} />
              <Highlight>
                Das öffnet den direkten Zugang zum impliziten Gedächtnis. Der „Lärm" des 
                Alltags übertönt nicht mehr die Signale des Körpers.
              </Highlight>
            </SubSection>

            <SubSection number="3.2" title='Warum in Meditation „alte Dinge" auftauchen'>
              <p>
                Wenn es still wird, wird es oft nicht ruhig, sondern laut im Inneren. 
                Nicht weil Meditation Probleme macht, sondern weil der Körper endlich 
                den Raum bekommt, „zu sprechen" und unvollständige Prozesse sichtbar werden.
              </p>
            </SubSection>

            <SubSection number="3.3" title="Die entscheidende Unterscheidung: Heilung vs. Überforderung">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-accent/10 p-4 sm:p-5 rounded-lg border border-accent/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 text-sm sm:text-base">
                    Meditation wirkt integrativ, wenn:
                  </h4>
                  <ListBlock items={[
                    "das Tempo stimmt und eine Grundsicherheit im Hier und Jetzt vorhanden ist.",
                    "Selbstmitgefühl aktiv ist (nicht wertendes Beobachten).",
                  ]} />
                </div>
                <div className="bg-destructive/10 p-4 sm:p-5 rounded-lg border border-destructive/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 text-sm sm:text-base">
                    Meditation wirkt retraumatisierend, wenn:
                  </h4>
                  <ListBlock items={[
                    'sie als „Durchbruchtechnik" genutzt wird („no pain no gain").',
                    "intensive Körperreaktionen (Zittern, Panik) ignoriert werden.",
                  ]} />
                </div>
              </div>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 4 */}
        <div id="kap4" className="border-t border-chapter-divider">
          <ChapterSection number="4" title="IFS: Die innere Architektur">
            <p>
              Wenn wir verstehen, dass der Körper Erinnerungen speichert, hilft uns das 
              Modell der „Internal Family Systems" (IFS), die daraus resultierenden 
              Verhaltensweisen zu ordnen.
            </p>

            <SubSection number="4.1" title="Grundannahme von IFS">
              <p>
                Wir bestehen aus vielen verschiedenen inneren Anteilen (Teilen), ähnlich 
                einem inneren Team.
              </p>
              <Highlight>
                Es gibt keine schlechten Teile. Jeder Teil hat – oder hatte ursprünglich – 
                eine schützende Funktion für das System.
              </Highlight>
            </SubSection>

            <SubSection number="4.2" title="Die drei zentralen Teiltypen">
              <div className="space-y-4 my-6">
                <div className="bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">
                    Manager <span className="font-sans text-sm text-muted-foreground">(Proaktive Beschützer)</span>
                  </h4>
                  <p className="text-muted-foreground">
                    Wollen Schmerz verhindern durch Kontrolle, Perfektionismus, Planung, Intellektualisieren.
                  </p>
                </div>
                <div className="bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">
                    Firefighter <span className="font-sans text-sm text-muted-foreground">(Reaktive Beschützer)</span>
                  </h4>
                  <p className="text-muted-foreground">
                    Wenn Schmerz durchbricht, sorgen sie für sofortige Ablenkung (Wut, Sucht, Rückzug).
                  </p>
                </div>
                <div className="bg-card p-5 rounded-lg border border-border">
                  <h4 className="font-serif font-semibold text-foreground mb-2">
                    Exile <span className="font-sans text-sm text-muted-foreground">(Die Verbannten)</span>
                  </h4>
                  <p className="text-muted-foreground">
                    Verletzte Anteile, die Scham oder Angst tragen und von den anderen geschützt werden.
                  </p>
                </div>
              </div>
            </SubSection>

            <SubSection number="4.3" title='Self-Energy (Das Selbst)'>
              <p>
                Das „Selbst" ist kein Teil, sondern ein Zustand von Präsenz: ruhig, neugierig, 
                klar, mitfühlend. Führung (im Innen wie im Außen) aus dem „Selbst" heraus 
                reguliert, ohne Druck auszuüben.
              </p>
            </SubSection>

            <SubSection number="4.4" title="Verbindung zum Körper">
              <p>
                Teile zeigen sich immer auch somatisch (Spannung, Übelkeit, Unruhe). 
                Der Körper ist der Kompass.
              </p>
            </SubSection>

            <SubSection number="4.5" title='Übernommene Lasten („Legacy Burdens")'>
              <p>
                Nicht alle unsere Teile sind durch eigene Erfahrung entstanden. In Systemen 
                übernehmen Kinder oft unbewusst die Rollenbilder und Glaubenssätze der Eltern, 
                um die Bindung zu sichern.
              </p>
              <ListBlock items={[
                <span key="1"><strong>Der kopierte Manager:</strong> Agiert dein innerer Antreiber so, wie du es brauchst, oder exakt so, wie dein Vater mit Stress umging?</span>,
                <span key="2"><strong>Die übernommene Angst:</strong> Trägt ein Teil vielleicht die unaufgelöste Panik der Mutter vor Ausgrenzung?</span>,
              ]} />
              <Quote>
                Die entscheidende Frage ist: „Gehört dieses Gefühl eigentlich mir – oder 
                trage ich es für jemand anderen?"
              </Quote>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 5 */}
        <div id="kap5" className="border-t border-chapter-divider">
          <ChapterSection number="5" title="NVC: Sprache für innere Wahrheit">
            <p>
              IFS hilft zu verstehen, wer in uns spricht. Gewaltfreie Kommunikation (NVC) 
              hilft dabei, wie wir dies ausdrücken, um Verbindung herzustellen.
            </p>

            <SubSection number="5.1" title="Warum NVC hier passt">
              <p>
                NVC moralisiert und pathologisiert nicht. Es ist ein Präzisionswerkzeug, 
                um somatische Zustände in beziehungsfähige Sprache zu übersetzen.
              </p>
            </SubSection>

            <SubSection number="5.2" title="Die vier Schritte – verkörpert gedacht">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6">
                {[
                  { num: "1", title: "Beobachtung", desc: "Was ist faktisch passiert? (Beruhigt das Alarmsystem)" },
                  { num: "2", title: "Gefühl", desc: "Was fühle ich? (Verbindung zum impliziten Gedächtnis)" },
                  { num: "3", title: "Bedürfnis", desc: "Was braucht gerade Schutz oder Erfüllung? (Der Kernantrieb)" },
                  { num: "4", title: "Bitte", desc: "Was wäre ein konkreter nächster Schritt?" },
                ].map((step) => (
                  <div key={step.num} className="bg-card p-3 sm:p-4 rounded-lg border border-border">
                    <span className="inline-block w-7 h-7 sm:w-8 sm:h-8 bg-accent text-accent-foreground rounded-full text-center leading-7 sm:leading-8 font-semibold text-xs sm:text-sm mb-2">
                      {step.num}
                    </span>
                    <h4 className="font-serif font-semibold text-foreground mb-1 text-sm sm:text-base">{step.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection number="5.3" title="Bedürfnisse als Brücke">
              <p>
                Bedürfnisse sind der gemeinsame Nenner aller Teile. Auch ein destruktiver 
                Teil versucht oft nur, ein Bedürfnis nach Sicherheit zu erfüllen.
              </p>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 6 */}
        <div id="kap6" className="border-t border-chapter-divider">
          <ChapterSection number="6" title="Das integrierte Prozessmodell">
            <p>
              Wir fügen die Ebenen zusammen. Dies ist die Architektur einer bewussten 
              Reaktion unter Druck.
            </p>

            <SubSection number="6.1" title="Die Gesamtbewegung (Der Flow)">
              <ProcessFlow />
            </SubSection>

            <SubSection number="6.2" title="Praxis-Beispiel: Die kritische Situation">
              <div className="bg-card p-6 rounded-lg border border-border my-6">
                <p className="font-medium text-foreground mb-4">
                  <strong>Die Situation:</strong> Sie stellen ein Projekt vor. Ein Stakeholder 
                  unterbricht genervt: „Das funktioniert hier nicht. Nächster Punkt."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6">
                <div className="bg-destructive/10 p-4 sm:p-5 rounded-lg border border-destructive/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                    Automatik-Modus
                  </h4>
                  <ListBlock items={[
                    <span key="1"><strong>Trigger:</strong> Unterbrechung & Tonfall</span>,
                    <span key="2"><strong>Somatik:</strong> Stich im Magen, Hitze</span>,
                    <span key="3"><strong>Teil:</strong> „Verteidiger" wehrt Inkompetenzgefühle ab</span>,
                    <span key="4"><strong>Reaktion:</strong> Zynismus oder Gegenangriff → Eskalation</span>,
                  ]} />
                </div>

                <div className="bg-accent/10 p-4 sm:p-5 rounded-lg border border-accent/30">
                  <h4 className="font-serif font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                    Integrierter Modus
                  </h4>
                  <ListBlock items={[
                    <span key="1"><strong>Trigger:</strong> Unterbrechung</span>,
                    <span key="2"><strong>Somatik:</strong> Sie spüren Stich und Hitze</span>,
                    <span key="3"><strong>Pause:</strong> Ausatmen, Impuls erkennen, nicht ausagieren</span>,
                    <span key="4"><strong>Übersetzung:</strong> „Ich bin irritiert, weil ich möchte, dass die Arbeit gesehen wird."</span>,
                    <span key="5"><strong>Handlung:</strong> Deeskalierende Frage → Verbindung</span>,
                  ]} />
                </div>
              </div>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Kapitel 7 & 8 */}
        <div id="kap7" className="border-t border-chapter-divider">
          <ChapterSection number="7" title="Unconscious Bias neu verstanden">
            <SubSection number="7.1" title="Bias als Körperphänomen">
              <p>
                Bias ist kein reiner Denkfehler, sondern ein somatischer Sicherheitsmechanismus 
                unter Zeitdruck.
              </p>
              <div className="bg-quote-bg p-6 rounded-lg my-6">
                <p className="font-medium text-foreground mb-2">Das Gehirn scannt: „Sicher oder unsicher?"</p>
                <ListBlock items={[
                  "Bias = Ein Schutzteil unter Stress",
                  "Gefühl: Unsicherheit, Angst vor dem Fremden",
                  "Bedürfnis: Vorhersagbarkeit, Zugehörigkeit",
                ]} />
              </div>
              <Highlight>
                Regulation schlägt Belehrung. Wenn ich mich sicher fühle, brauche ich meine 
                Vorurteile weniger dringend als Schutzschild.
              </Highlight>
            </SubSection>
          </ChapterSection>
        </div>

        <div id="kap8" className="border-t border-chapter-divider">
          <ChapterSection number="8" title="Erinnerungskultur & Journaling">
            <SubSection number="8.1" title="Erinnerungen sind formbar">
              <p>
                Wir können die emotionale Ladung einer Erinnerung verändern, indem wir 
                den Zustand ändern, in dem wir uns erinnern.
              </p>
            </SubSection>

            <SubSection number="8.2" title="Integratives Journaling">
              <p>Fragen Sie beim Reflektieren nicht nur: „Was ist passiert?"</p>
              <p className="font-medium text-foreground mt-4 mb-2">Sondern:</p>
              <ListBlock items={[
                "Wie hat es sich im Körper angefühlt?",
                "Welcher Teil war aktiv?",
                "Gehört dieses Gefühl mir oder ist es ein Erbe?",
                "Welches Bedürfnis war lebendig?",
              ]} />
            </SubSection>
          </ChapterSection>
        </div>

        {/* Ausblick & Fazit */}
        <div id="fazit" className="border-t border-chapter-divider">
          <ChapterSection title="Angrenzende Themenfelder">
            <p>Dieses Modell bildet das Fundament für die Arbeit mit:</p>
            <ListBlock items={[
              "Polyvagal-Theorie (Nervensystem & Sicherheit)",
              "Window of Tolerance (Stresstoleranz-Fenster)",
              "Bindungsstile (Beziehungsmuster)",
              "Embodied Cognition (Verkörpertes Denken)",
            ]} />
          </ChapterSection>

          <ChapterSection title="Die zentrale These">
            <p>
              Wenn wir die Ebenen von Körpergedächtnis, Epigenetik, inneren Anteilen und 
              Bedürfnissen zusammenführen, kommen wir zu einer radikalen Schlussfolgerung:
            </p>
            <Quote>
              Viele menschliche Probleme sind keine Denkprobleme, sondern Zustandsprobleme.
            </Quote>
            <p>
              Wir versuchen oft, Konflikte durch mehr Analyse zu lösen. Doch wenn das 
              Nervensystem im Alarmzustand ist, ist der Zugang zu Lösungen blockiert.
            </p>
            <Highlight>
              Die Arbeit beginnt bei der Regulation des Zustands.
            </Highlight>
            <p className="mt-6">Wenn der Zustand reguliert ist:</p>
            <ListBlock items={[
              "werden Teile kooperativ.",
              "werden Bedürfnisse verhandelbar.",
              "können wir unterscheiden: Was ist mein Stress, und was ist altes Erbe?",
              "wird echte Beziehung möglich.",
            ]} />
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
            Ein erinnerungsbasiertes Handlungsmodell zum Umgang mit Stress, Bias und Prägungen
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
            <Link 
              to="/oria" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Oria entdecken
            </Link>
            <Link 
              to="/seminare" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Seminarangebote
            </Link>
            <Link 
              to="/impressum" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Impressum
            </Link>
          </div>
          
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Beyond Bias gUG. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
