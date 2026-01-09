import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Heart, 
  Target, 
  Clock, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Compass,
  Zap,
  RefreshCw,
  Shield,
  Eye,
  Activity,
  BookOpen,
  Calendar,
  TrendingUp,
  Layers
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Button } from "@/components/ui/button";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface ResilienzCardProps {
  letter: string;
  title: string;
  description: string;
  effects: string[];
  resilienzNutzen: string;
  icon: React.ReactNode;
  delay: number;
}

const ResilienzCard = ({ letter, title, description, effects, resilienzNutzen, icon, delay }: ResilienzCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-card/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-border hover:border-accent/30 transition-all duration-300"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-accent font-medium text-sm">{letter}</span>
        <h3 className="font-serif text-xl sm:text-2xl text-foreground mt-1">{title}</h3>
      </div>
    </div>
    
    <p className="text-muted-foreground text-sm mb-4 italic">{description}</p>
    
    <ul className="space-y-2 mb-4">
      {effects.map((effect, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <span>{effect}</span>
        </li>
      ))}
    </ul>
    
    <div className="pt-4 border-t border-border">
      <p className="text-sm text-accent font-medium flex items-start gap-2">
        <TrendingUp className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>{resilienzNutzen}</span>
      </p>
    </div>
  </motion.div>
);

interface AnsatzCardProps {
  title: string;
  subtitle: string;
  mehrwert: string[];
  oriaHebel: string[];
  synergie: string;
  icon: React.ReactNode;
  delay: number;
}

const AnsatzCard = ({ title, subtitle, mehrwert, oriaHebel, synergie, icon, delay }: AnsatzCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-card rounded-xl p-6 sm:p-8 border border-border"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-xl sm:text-2xl text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground italic">{subtitle}</p>
      </div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">{title}-Mehrwert</h4>
        <ul className="space-y-2">
          {mehrwert.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Oria-Hebel</h4>
        <ul className="space-y-2">
          {oriaHebel.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="pt-4 border-t border-border">
      <p className="text-sm text-accent font-medium">{synergie}</p>
    </div>
  </motion.div>
);

const SeminarMehrwerte = () => {
  const { language } = useLanguage();

  const resilienzWege = [
    {
      letter: "A",
      title: "Tägliche Selbstreflexion & Mustererkennung",
      description: "Oria kann dir helfen:",
      effects: [
        "tägliche Erfahrungen / Gefühle zu reflektieren",
        "Stress-Situationen zu identifizieren",
        "wiederkehrende Auslöser und Reaktionen zu erkennen"
      ],
      resilienzNutzen: "Durch Bewusstheit über eigene Muster und Bedürfnisse kann man früher regulierend eingreifen statt impulsiv zu reagieren.",
      icon: <Eye className="h-6 w-6" />
    },
    {
      letter: "B",
      title: "Emotions- und Coping-Strategien lernen & anwenden",
      description: "Oria kann:",
      effects: [
        "wissenschaftlich validierte Methoden (z.B. Achtsamkeit, Atemtechniken, kognitive Umstrukturierung) anleiten",
        "personalisierte Übungen empfehlen, z.B. je nach Stimmung oder Kontext",
        "kurze Mikro-Übungen für Alltagssituationen bieten"
      ],
      resilienzNutzen: "Mehr Werkzeuge zur Stressregulation, mehr Kontrolle über eigene Reaktionen statt Reaktivität.",
      icon: <Heart className="h-6 w-6" />
    },
    {
      letter: "C",
      title: "Perspektivenwechsel, Sinn- und Zielklarheit",
      description: "Oria kann fragen:",
      effects: [
        "Welche Werte sind dir wichtig?",
        "Woran merkst du, dass du Fortschritte machst?",
        "Stärkt Purpose und proaktives Handeln"
      ],
      resilienzNutzen: "Menschen mit klaren Werten und Zielen nehmen Rückschläge weniger persönlich und nutzen sie zur Orientierung.",
      icon: <Target className="h-6 w-6" />
    },
    {
      letter: "D",
      title: "Kontinuierliche Motivation & Accountability",
      description: "Oria kann:",
      effects: [
        "regelmäßige Check-Ins machen",
        "Fortschritte sichtbar machen (z.B. Stimmung, Stresslevel)",
        "motivierende Botschaften geben"
      ],
      resilienzNutzen: "Dranbleiben führt zu Gewohnheitsbildung und stärkt die Fähigkeit, Herausforderungen länger durchzuhalten.",
      icon: <RefreshCw className="h-6 w-6" />
    }
  ];

  const alltagsHilfe = [
    {
      title: "24/7 verfügbar",
      icon: <Clock className="h-5 w-5" />,
      points: [
        "Sofortige Unterstützung, wenn du etwas verarbeiten willst",
        "Kein Termin nötig → niedrigere Hürde",
        "Besonders hilfreich in Krisen- oder Stressmomenten"
      ]
    },
    {
      title: "Kontext-sensitiv",
      icon: <Compass className="h-5 w-5" />,
      points: [
        "erkennen, wann du Unterstützung brauchst",
        "Muster aus Tageszeiten, Situationen, Sprache erkennen",
        "passende Strategien situativ empfehlen"
      ]
    },
    {
      title: "Lernbegleiter statt nur Chatbot",
      icon: <BookOpen className="h-5 w-5" />,
      points: [
        "dich durch Lern- und Veränderungsprozesse führen",
        "Ziele setzen und deren Erreichung begleiten",
        "Fortschritte dokumentieren und visualisieren"
      ]
    }
  ];

  const synergieTabelle = [
    { physical: "Tiefere emotionale Auseinandersetzung", oria: "Tägliche Nach- und Weiterarbeit", result: "Transfer in den Alltag" },
    { physical: "Gruppen-Interaktion & Erfahrungsaustausch", oria: "Individuelle Reflektion und Übungen", result: "Besserer Lern-Output" },
    { physical: "Expertise & Haltung des Coaches", oria: "Algorithmisch gestützte Kontinuität", result: "Bessere Habit-Formation" },
    { physical: "Raum für Fragen & Begegnung", oria: "Kontinuierliche Unterstützung", result: "Nachhaltige Veränderung" }
  ];

  const wochenRoutine = [
    { day: "Vor Seminar", desc: "Baseline-Fragebogen über Oria" },
    { day: "Tag 1 (Seminar)", desc: "Einführung Stress-Resilienz, Oria-Account wird aktiviert" },
    { day: "Täglich nach Seminar", desc: "Morgencheck, Mini-Übung, Abend-Reflexion" },
    { day: "Wöchentliches Follow-up", desc: "Coach bespricht Ergebnisse aus Oria" }
  ];

  const wirkungsstufen = [
    { name: "Awareness", desc: "Muster erkennen", icon: <Eye className="h-5 w-5" /> },
    { name: "Regulation", desc: "Tools anwenden", icon: <Activity className="h-5 w-5" /> },
    { name: "Agency", desc: "Ziele setzen & erreichen", icon: <Target className="h-5 w-5" /> },
    { name: "Flourishing", desc: "positives Wachstum", icon: <Sparkles className="h-5 w-5" /> }
  ];

  const ansaetze = [
    {
      title: "IFS",
      subtitle: "Vom 'Verstehen meiner inneren Teile' zur gelebten Selbstführung",
      mehrwert: [
        "Differenziert innere Anteile (Manager, Firefighter, Exile)",
        "Stärkt Selbst-Energie (Calm, Curiosity, Compassion)",
        "Tiefe Klärung von inneren Konflikten"
      ],
      oriaHebel: [
        "Teile-Tracking im Alltag: Nach Meetings, Konflikten, Entscheidungen",
        "Sanfte Nachfragen: 'Welcher Teil war gerade aktiv?'",
        "Langzeit-Muster: Welche Teile dominieren unter Stress?"
      ],
      synergie: "Seminar = sichere Tiefe, Oria = sichere Wiederholung & Integration → mehr innere Wahlfreiheit",
      icon: <Brain className="h-6 w-6" />
    },
    {
      title: "GFK",
      subtitle: "Von 'richtig kommunizieren' zu echter Verbindung – auch mit sich selbst",
      mehrwert: [
        "Gefühle & Bedürfnisse differenzieren",
        "Verantwortung für eigene Reaktionen übernehmen",
        "Konflikte entgiften"
      ],
      oriaHebel: [
        "Mikro-Check-ins: 'Was fühle ich gerade? Was brauche ich?'",
        "Übersetzungshilfe: Von Bewertung → Gefühl → Bedürfnis",
        "Beziehungs-Timeline: Wiederkehrende Trigger sichtbar machen"
      ],
      synergie: "Seminar = Haltung & Sprache, Oria = Alltagssituationen entschärfen → Beziehungs-Resilienz",
      icon: <MessageCircle className="h-6 w-6" />
    },
    {
      title: "Somatisches Coaching",
      subtitle: "Vom Wissen über Stress zur echten Regulation",
      mehrwert: [
        "Arbeit am Nervensystem (Fight/Flight/Freeze)",
        "Körper als Frühwarnsystem",
        "Nachhaltige Stress- und Trauma-Integration"
      ],
      oriaHebel: [
        "Körper-Marker erfassen: Enge, Druck, Wärme, Zittern",
        "Timing-Intelligenz: Wann braucht es Regulation?",
        "Mini-Übungen im Moment (Atmung, Grounding)"
      ],
      synergie: "Seminar = korrigierende Erfahrung, Oria = regelmäßige Regulation → stabileres Nervensystem",
      icon: <Activity className="h-6 w-6" />
    }
  ];

  const kurzueberblick = [
    { ansatz: "IFS", kern: "Innere Klarheit & Selbstführung", fehlt: "Alltagstransfer, Kontinuität" },
    { ansatz: "GFK", kern: "Beziehungs- & Bedürfnisintelligenz", fehlt: "Körperbezug, Übung im Moment" },
    { ansatz: "Somatik", kern: "Nervensystem & Körperintelligenz", fehlt: "Sprachliche Integration" },
    { ansatz: "Oria (AI)", kern: "Erinnerung, Muster, Begleitung", fehlt: "Tiefe Erfahrung (liefert Seminar)" }
  ];

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            onClick={() => window.scrollTo(0, 0)}
            className="font-serif text-lg sm:text-xl text-foreground hover:text-accent transition-colors"
          >
            Oria
          </Link>
          <Link 
            to="/seminare" 
            onClick={() => window.scrollTo(0, 0)}
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            ← {language === 'de' ? 'Zurück zu Seminare' : 'Back to Seminars'}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <PolygonalBackground variant="warm" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-accent font-medium">Seminar-Mehrwerte</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-6">
              Wie Oria Resilienz stärkt
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Die Kombination aus Oria + AI-Coach + physischen Seminaren entfaltet ihren größten Mehrwert dort, wo kognitive Einsicht, emotionale Tiefe und körperliche Erfahrung zusammenkommen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wirkungswege auf Resilienz */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Wie Oria konkret Resilienz stärkt
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Vier zentrale Wege zur nachhaltigen Stärkung deiner inneren Widerstandskraft.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {resilienzWege.map((weg, index) => (
              <ResilienzCard
                key={weg.letter}
                {...weg}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI-Coach im Alltag */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Wie ein Oria AI-Coach im Alltag hilft
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {alltagsHilfe.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                </div>
                <ul className="space-y-2">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Synergie-Tabelle */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Oria im Zusammenspiel mit Seminaren
            </h2>
            <p className="text-muted-foreground">
              Die Kombination verstärkt Wirkfaktoren
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-0 text-sm font-medium text-foreground bg-secondary/50">
              <div className="p-4 border-r border-border">Physisches Coaching / Seminar</div>
              <div className="p-4 border-r border-border">Oria AI Coach</div>
              <div className="p-4">Synergie-Effekt</div>
            </div>
            {synergieTabelle.map((row, index) => (
              <div key={index} className="grid grid-cols-3 gap-0 text-sm border-t border-border">
                <div className="p-4 border-r border-border text-muted-foreground">{row.physical}</div>
                <div className="p-4 border-r border-border text-muted-foreground">{row.oria}</div>
                <div className="p-4 text-accent font-medium">{row.result}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Wirkungsstufen */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="accent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Konkrete Wirkungswege auf Resilienz
            </h2>
            <p className="text-muted-foreground">
              Awareness → Regulation → Agency → Flourishing
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {wirkungsstufen.map((stufe, index) => (
              <motion.div
                key={stufe.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="bg-card rounded-full px-5 py-3 border border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    {stufe.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{stufe.name}</p>
                    <p className="text-xs text-muted-foreground">{stufe.desc}</p>
                  </div>
                </div>
                {index < wirkungsstufen.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-accent hidden sm:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beispiel-Routine */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Beispiel-Routine (1 Woche)
            </h2>
            <p className="text-muted-foreground">
              Mit Oria & Coaching zu nachhaltigerer Lern- und Verhaltensänderung
            </p>
          </motion.div>

          <div className="space-y-4">
            {wochenRoutine.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 bg-card rounded-lg p-4 border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.day}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurzüberblick Tabelle */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Kurzüberblick: Wer bringt was ein?
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-0 text-sm font-medium text-foreground bg-secondary/50">
              <div className="p-4 border-r border-border">Ansatz</div>
              <div className="p-4 border-r border-border">Kernkompetenz</div>
              <div className="p-4">Was ohne Oria oft fehlt</div>
            </div>
            {kurzueberblick.map((row, index) => (
              <div key={index} className="grid grid-cols-3 gap-0 text-sm border-t border-border">
                <div className="p-4 border-r border-border font-medium text-foreground">{row.ansatz}</div>
                <div className="p-4 border-r border-border text-muted-foreground">{row.kern}</div>
                <div className="p-4 text-muted-foreground">{row.fehlt}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* IFS, GFK, Somatik Cards */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              IFS, GFK und Somatisches Coaching mit Oria
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oria ist die verbindende Landkarte & Transfer-Schicht, die kognitive Einsicht, emotionale Tiefe und körperliche Erfahrung zusammenbringt.
            </p>
          </motion.div>

          <div className="space-y-6">
            {ansaetze.map((ansatz, index) => (
              <AnsatzCard
                key={ansatz.title}
                {...ansatz}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Meta-Mehrwert */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Oria als verbindende Landkarte
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Erinnerung statt Theorie", desc: "Nicht: 'Ich weiß, wie es geht' – Sondern: 'Ich erkenne es im Moment'" },
              { title: "Muster statt Einzelsessions", desc: "Welche Bedürfnisse fehlen regelmäßig? Welche Teile melden sich wann?" },
              { title: "Sanfte Kontinuität", desc: "Kein 'Du solltest' – Sondern: neugieriges Begleiten" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border text-center"
              >
                <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fazit */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeInUp}>
            <img 
              src={bbOwlLogo} 
              alt="Oria" 
              className="h-16 w-auto mx-auto mb-6 opacity-80"
            />
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-6">
              Der eigentliche Mehrwert
            </h2>
            <div className="space-y-3 text-lg text-muted-foreground mb-8">
              <p><strong className="text-foreground">IFS</strong> bringt innere Ordnung</p>
              <p><strong className="text-foreground">GFK</strong> bringt Beziehungs-Klarheit</p>
              <p><strong className="text-foreground">Somatik</strong> bringt körperliche Sicherheit</p>
              <p><strong className="text-accent">Oria</strong> bringt Zeit, Erinnerung und Integration</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20 mb-8">
              <p className="text-foreground font-medium">
                Zusammen entsteht: mehr Selbstführung, mehr Resilienz, mehr Verbundenheit, weniger Rückfall in alte Muster
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link to="/seminare#kontakt" onClick={() => window.scrollTo(0, 0)}>
                Seminar anfragen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-xl text-foreground mb-2">Inner Guidance Through Lived Memories</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
            <Link 
              to="/" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/seminare" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Seminare
            </Link>
            <Link 
              to="/oria" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Oria entdecken
            </Link>
            <Link 
              to="/impressum" 
              onClick={() => window.scrollTo(0, 0)}
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

export default SeminarMehrwerte;
