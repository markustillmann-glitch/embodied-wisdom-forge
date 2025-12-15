import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle2, Sparkles, Heart, TrendingUp, Brain, MessageCircle, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PolygonalBackground, ConnectionLines, OwlSymbol, InsightSymbol, MoonSymbol, GrowthSpiral } from "@/components/PolygonalBackground";
import { SeminarContactForm } from "@/components/SeminarContactForm";
import bbOwlLogo from "@/assets/bb-owl-new.png";
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const mehrwerte = [
  {
    id: "zufriedenheit",
    icon: Heart,
    title: "Persönliche Zufriedenheit",
    summary: "Innere Balance finden, eigene Bedürfnisse erkennen und erfüllen, Stress und innere Konflikte reduzieren.",
    details: [
      {
        heading: "Innere Zufriedenheit steigern",
        text: "Durch die Kombination der Methoden lernen Sie, besser für die eigenen Bedürfnisse zu sorgen und innere Konflikte zu lösen. Statt im Autopilot-Stress gefangen zu bleiben, entwickeln Sie bewusste Strategien.",
      },
      {
        heading: "Eigene Bedürfnisse erkennen",
        text: "Indem Sie lernen, hinter Gefühlen die bedrohten oder unerfüllten Bedürfnisse zu identifizieren, können Sie gezielt dafür sorgen, dass diese erfüllt werden.",
      },
      {
        heading: "Reduzierter Stress",
        text: "Durch IFS-Arbeit wird das innere Team harmonisiert. Grübeleien, Selbstvorwürfe oder innere Zerreißproben nehmen ab.",
      },
    ],
    example: {
      name: "Anna, Projektmanagerin",
      text: "Fühlte sich ständig ausgelaugt. Im Coaching lernte sie, die Körpersignale ihres impliziten Gedächtnisses ernst zu nehmen. Sie erkannte ihr Bedürfnis nach Autonomie und Ruhe, sprach offen mit ihrem Vorgesetzten und fühlt sich heute deutlich zufriedener.",
    },
  },
  {
    id: "entwicklung",
    icon: TrendingUp,
    title: "Entwicklungsprozesse",
    summary: "Tiefgreifendes persönliches Wachstum, alte Muster auflösen und neue Fähigkeiten entwickeln.",
    details: [
      {
        heading: "Persönliches Wachstum",
        text: "Über 12 Monate durchlaufen Sie einen nachhaltigen Wandel – alte Muster werden bewusst gemacht und durch neue, gesündere Verhaltensweisen ersetzt.",
      },
      {
        heading: "Gesteigerte Selbstwahrnehmung",
        text: "Durch Meditation und Achtsamkeitsübungen schulen Sie Ihre Wahrnehmung – Sie bemerken Gedankenmuster, emotionale Reaktionen und Körpersignale immer früher.",
      },
      {
        heading: "Auflösen alter Muster",
        text: "Sie erkennen die Kette: Trigger → Körperreaktion → automatischer Schutzmechanismus → unerfülltes Bedürfnis. So werden aus Attacke oder Flucht zunehmend achtsame Reaktionen.",
      },
    ],
    example: {
      name: "Tom, Führungskraft",
      text: "War in Stressphasen autoritär und ungeduldig. Er entdeckte seinen ‚Kontrolleur'-Anteil und lernte, ihm nicht die Führung zu überlassen. Sein Team bemerkt heute, dass er gelassener und zugänglicher geworden ist.",
    },
  },
  {
    id: "gefuehle",
    icon: Brain,
    title: "Zugang zu Gefühlen & Körperweisheit",
    summary: "Emotionale und körperliche Bewusstheit entwickeln, Intuition stärken und Bedürfnisse als Kompass nutzen.",
    details: [
      {
        heading: "Gefühle im Körper erkennen",
        text: "Sie lernen körperliche Symptome wie einen Kloß im Hals, flache Atmung oder Anspannung bewusst zu registrieren und korrekt zu deuten.",
      },
      {
        heading: "Bedürfnisse als Kompass",
        text: "Hinter jedem starken Gefühl steckt ein Bedürfnis. Das Programm schult die Fähigkeit, diese Ebene bewusst zu erreichen und stimmiger zu handeln.",
      },
      {
        heading: "Somatische Intelligenz stärken",
        text: "Je öfter Sie auf den eigenen Körper hören, desto mehr Vertrauen entwickeln Sie in Ihre Intuition. Entscheidungen werden weniger bereut.",
      },
    ],
    example: {
      name: "Daniel, Abteilungsleiter",
      text: "War es gewohnt, Gefühle wegzudrücken. Im Coaching lernte er, seine Körpersignale ernst zu nehmen – heute nimmt er sich 10 Minuten Pause, wenn er gereizt heimkommt, und kann dann viel liebevoller reagieren.",
    },
  },
  {
    id: "beziehungen",
    icon: MessageCircle,
    title: "Beziehungen & Kommunikation",
    summary: "Authentisch kommunizieren, empathischer zuhören und Konflikte konstruktiv lösen.",
    details: [
      {
        heading: "Klareres Ausdrücken",
        text: "Statt ‚Du bist immer so gemein!' lernen Sie: ‚Wenn du mich unterbrichst, bin ich irritiert, weil mir Respekt wichtig ist.' Dieser Wechsel verändert die Atmosphäre dramatisch.",
      },
      {
        heading: "Mehr Empathie",
        text: "Wer eigene verletzliche Anteile kennengelernt hat, reagiert mit mehr Mitgefühl, wenn andere emotional reagieren.",
      },
      {
        heading: "Konstruktiver Konfliktumgang",
        text: "Sie lernen, in Konflikten innerlich einen Schritt zurückzutreten, anstatt sofort zurückzuschießen. Aus potentiellen Machtkämpfen werden Dialoge.",
      },
    ],
    example: {
      name: "Julia, Partnerin",
      text: "Zog sich bei Streit zurück, ihr Partner wurde lauter. Im Coaching lernte sie, verletzliche Gefühle auszudrücken. Das erste offene Gespräch verlief völlig anders – beide fanden einen Kompromiss.",
    },
  },
  {
    id: "resilienz",
    icon: Shield,
    title: "Selbstführung, Resilienz & Klarheit",
    summary: "Innere Führungskraft entwickeln, widerstandsfähiger werden und Entscheidungen klar treffen.",
    details: [
      {
        heading: "Selbst als Führungsinstanz",
        text: "Sie erleben, wie es ist, ruhig und mitfühlend auf eigene Gedanken zu blicken, ohne überwältigt zu werden. Diese innere Führungsinstanz gibt Gelassenheit.",
      },
      {
        heading: "Resilienz und Stressbewältigung",
        text: "Sie lernen, Ihren Nervensystem-Zustand wahrzunehmen und passende Hilfen anzuwenden – Atemübungen, Meditation oder unterstützende Gedanken.",
      },
      {
        heading: "Innere Klarheit und Fokus",
        text: "Die anfängliche ‚mentale Zettelwirtschaft' sortiert sich. Sie kennen Ihre Prioritäten und lassen sich weniger von kurzfristigen Emotionen verrennen.",
      },
    ],
    example: {
      name: "Martin, Teilnehmer",
      text: "Verlor während des Coaching-Jahres seinen Job. Dank der gelernten Techniken konnte er erstaunlich gefasst bleiben und bereits am nächsten Tag aktiv Schritte planen, statt wochenlang gelähmt zu sein.",
    },
  },
];

const MehrwertCard = ({ item, isExpanded, onToggle }: { 
  item: typeof mehrwerte[0]; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  const Icon = item.icon;
  
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
          <h3 className="text-xl font-serif text-foreground mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
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
            {item.details.map((detail, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-medium text-foreground mb-1">{detail.heading}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{detail.text}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-quote-bg p-4 rounded-lg border-l-4 border-accent">
            <p className="text-xs font-sans tracking-wider text-accent uppercase mb-1">Praxis-Beispiel</p>
            <p className="text-sm text-foreground font-medium mb-1">{item.example.name}</p>
            <p className="text-sm text-muted-foreground italic leading-relaxed">{item.example.text}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const MehrwerteSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  return (
    <section className="py-20 relative overflow-hidden">
      <PolygonalBackground variant="warm" />
      
      {/* Decorative elements */}
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
            Konkrete Mehrwerte des Jahresprogramms
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Das Programm integriert Meditation, IFS und GFK als komplementäre Zugänge zum selben 
            menschlichen Betriebssystem – statt isolierter Techniken. Die zentrale Erkenntnis: 
            Viele persönliche Herausforderungen sind keine reinen Denkprobleme, sondern „Zustandsprobleme".
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {mehrwerte.map((item) => (
            <MehrwertCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Seminare = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Zum Kompendium</span>
            <span className="xs:hidden">Zurück</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link 
              to="/oria" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Oria
            </Link>
            <p className="font-serif text-xs sm:text-sm text-foreground hidden sm:block">Beyond Bias through memories</p>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-20 md:py-32 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        {/* Decorative elements */}
        <ConnectionLines className="top-20 right-10 w-32 h-32 opacity-60 hidden lg:block" />
        <GrowthSpiral className="absolute bottom-20 left-10 opacity-40 hidden lg:block" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs sm:text-sm font-sans tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase mb-4 sm:mb-6"
          >
            Seminarangebot
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground leading-tight mb-4 sm:mb-6"
          >
            Integrierte Selbstwahrnehmung
            <br />
            <span className="text-accent">&amp; Selbstführung</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed px-2"
          >
            Ein ganzheitlicher Entwicklungsprozess, der Denken, Fühlen, Körper und 
            Kommunikation verbindet – basierend auf IFS, GFK und somatischer Intelligenz.
          </motion.p>
        </div>
      </section>

      {/* Zielgruppe */}
      <section className="py-16 border-t border-chapter-divider">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">
              Für wen ist dieses Programm?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Das Programm richtet sich an entwicklungsorientierte Menschen in intensiven 
              Lebensphasen – persönliche Übergänge, berufliche Neuorientierung, 
              Beziehungskrisen oder andere Umbruchsituationen.
            </p>
            <div className="bg-quote-bg p-6 rounded-lg border-l-4 border-accent">
              <p className="text-foreground italic">
                In solchen Phasen wissen wir oft theoretisch, was gut für uns wäre, 
                fallen unter Stress aber in alte Autopilot-Muster zurück.
              </p>
            </div>
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
            Unsere Formate
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
                  Einstieg
                </span>
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">Schnupperabend</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                Ein unverbindlicher Einblick in das Coaching-Konzept. Erleben Sie erste 
                Aha-Momente und verstehen Sie, wie Kopf, Herz und Körper zusammenspielen.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2 Stunden</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Online</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Inhalt:</p>
                <ul className="text-sm text-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Interaktive Achtsamkeitsübung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Einführung in IFS, GFK & Körpergedächtnis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Offene Fragerunde</span>
                  </li>
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
                  Grundlagen
                </span>
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">Einführungsseminar</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                Gründliche Vorbereitung auf das Jahresprogramm oder eigenständiger 
                kompakter Workshop für einen grundlegenden Einstieg.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>4 Stunden (Digital) oder 1 Tag (Präsenz)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Online oder vor Ort</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Inhalt:</p>
                <ul className="text-sm text-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Implizites vs. explizites Gedächtnis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>IFS-Grundlagen: Das innere Team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>GFK: Sprache des Erlebens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Praktische Selbsterfahrungsübungen</span>
                  </li>
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
                Hauptprogramm
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-sans tracking-wider text-muted-foreground uppercase">
                  Transformation
                </span>
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">Jahrescoaching</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                Ein intensiver Blended-Learning-Prozess über 12 Monate mit Online-Modulen, 
                Peer-Austausch und drei Präsenzphasen.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>12 Monate, ca. 4–8h/Monat</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Blended Learning</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Enthält:</p>
                <ul className="text-sm text-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Auftakt-Wochenende (2 Tage)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>12 thematische Monatsmodule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Intensiv-Retreat (7 Tage)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Abschluss-Wochenende (2 Tage)</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jahresprogramm Details */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="flow" />
        
        {/* Decorative growth spiral */}
        <GrowthSpiral className="absolute top-1/4 right-8 opacity-30 hidden lg:block" />
        <ConnectionLines className="absolute bottom-1/3 left-4 w-24 h-24 opacity-40 hidden lg:block" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              Das Jahresprogramm im Detail
            </h2>
            <p className="text-muted-foreground">
              Ein strukturierter Weg von der Selbstwahrnehmung zur Selbstführung
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-chapter-divider md:-translate-x-px" />

            {[
              {
                phase: "Start",
                title: "Auftakt-Wochenende",
                desc: "Kennenlernen, Vertrauensaufbau und erste Einführung in Meditation, IFS und GFK. Jeder formuliert eine persönliche Intention für das Jahr.",
              },
              {
                phase: "Monat 1–3",
                title: "Grundlagen der Selbstwahrnehmung",
                desc: "Selbstkontakt entwickeln, Trigger und Reaktionsmuster verstehen, somatische Intelligenz und Körpergedächtnis erkunden.",
              },
              {
                phase: "Monat 4–5",
                title: "Innere Anteile (IFS)",
                desc: "Manager-Anteile erkennen, Firefighter und Exiles verstehen. Erste Dialoge mit den inneren Beschützern.",
              },
              {
                phase: "Monat 6",
                title: "GFK-Grundlagen",
                desc: "Gefühle benennen, Bedürfnisse navigieren. Das innere Erleben in beziehungsfähige Sprache übersetzen.",
              },
              {
                phase: "Mitte",
                title: "Intensiv-Retreat (7 Tage)",
                desc: "Tiefe Präsenzwoche mit Körperarbeit, Teile-Heilung, Visionsarbeit und Integration. Der Höhepunkt der ersten Programmhälfte.",
                highlight: true,
              },
              {
                phase: "Monat 7–9",
                title: "Integration & Resilienz",
                desc: "Selbstführung im Alltag verankern, authentische Kommunikation üben, Umgang mit Rückschlägen und Stress.",
              },
              {
                phase: "Monat 10–11",
                title: "Ausrichtung & Vision",
                desc: "Lebensvision und Werte klären, das neue Selbstbild festigen, Zukunftsplan erstellen.",
              },
              {
                phase: "Abschluss",
                title: "Abschluss-Wochenende",
                desc: "Integration, Wertschätzungsrunden, symbolische Übergabe. Mit gestärkter Selbstverbindung in den Alltag zurückkehren.",
              },
            ].map((item, index) => (
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
                      {item.phase}
                    </span>
                    <h3 className="font-serif text-lg text-foreground mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mehrwerte Section */}
      <MehrwerteSection />

      {/* Methodik */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="accent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h2
            {...fadeInUp}
            className="text-2xl md:text-3xl font-serif text-foreground text-center mb-12"
          >
            Die vier Säulen des Programms
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                title: "Meditation",
                desc: "Achtsamkeitsübungen als Wahrnehmungswerkzeug, um Zugang zum impliziten Gedächtnis zu erhalten.",
              },
              {
                title: "IFS (Internal Family Systems)",
                desc: "Die innere Architektur verstehen: Manager, Firefighter, Exiles und das führende Selbst.",
              },
              {
                title: "GFK (Gewaltfreie Kommunikation)",
                desc: "Innere Zustände in klare Worte übersetzen: Beobachtung, Gefühl, Bedürfnis, Bitte.",
              },
              {
                title: "Körpergedächtnis",
                desc: "Somatische Signale lesen und den Körper als Verbündeten in herausfordernden Momenten nutzen.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="kontakt" className="py-24 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        
        {/* Warm glow effect */}
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
              Interesse geweckt?
            </h2>
            <p className="text-muted-foreground">
              Senden Sie uns eine unverbindliche Anfrage – wir melden uns persönlich bei Ihnen 
              und beantworten Ihre Fragen.
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
          <Link to="/" className="font-serif text-xl text-foreground hover:text-accent transition-colors">
            Beyond Bias through memories
          </Link>
          <p className="text-muted-foreground text-sm mt-2 mb-4">
            Ein Handlungsmodell zum Umgang mit Stress, Bias und Prägungen
          </p>
          <Link 
            to="/impressum" 
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            Impressum
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Seminare;
