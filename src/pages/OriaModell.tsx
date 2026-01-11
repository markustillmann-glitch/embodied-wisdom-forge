import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Users, 
  Shield, 
  Sparkles,
  ArrowRight,
  Brain,
  MessageCircle,
  Eye,
  Compass,
  Target,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowDown
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Header } from "@/components/Header";
import bbOwlLogo from "@/assets/bb-owl-new.png";
import oriaOwlFine from "@/assets/oria-owl-fine.png";

interface ComparisonRowProps {
  socialMedia: string;
  oria: string;
  delay: number;
}

const ComparisonRow = ({ socialMedia, oria, delay }: ComparisonRowProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    className="grid grid-cols-2 gap-4 py-3 border-b border-border last:border-b-0"
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
      <span className="text-sm">{socialMedia}</span>
    </div>
    <div className="flex items-center gap-2 text-foreground">
      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
      <span className="text-sm">{oria}</span>
    </div>
  </motion.div>
);

interface NeedCardProps {
  title: string;
  promise: string;
  reality: string[];
  diagnosis: string;
  trace?: string;
  icon: React.ReactNode;
  delay: number;
}

const NeedCard = ({ title, promise, reality, diagnosis, trace, icon, delay }: NeedCardProps) => (
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
        <h3 className="font-serif text-xl sm:text-2xl text-foreground">{title}</h3>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm font-medium text-muted-foreground mb-1">Versprechen:</p>
        <p className="text-foreground italic">"{promise}"</p>
      </div>
      
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Was tatsächlich passiert:</p>
        <ul className="space-y-1.5">
          {reality.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500/70 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-accent mb-1">Oria-Diagnose:</p>
        <p className="text-sm text-foreground">→ {diagnosis}</p>
      </div>
      
      {trace && (
        <div className="bg-accent/5 rounded-lg p-3">
          <p className="text-xs text-muted-foreground italic">{trace}</p>
        </div>
      )}
    </div>
  </motion.div>
);

interface StructuralIssueProps {
  title: string;
  problems: string[];
  consequence: string;
  icon: React.ReactNode;
  delay: number;
}

const StructuralIssue = ({ title, problems, consequence, icon, delay }: StructuralIssueProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-card/40 rounded-xl p-6 border border-border"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive/70">
        {icon}
      </div>
      <h4 className="font-serif text-lg text-foreground">{title}</h4>
    </div>
    <ul className="space-y-2 mb-4">
      {problems.map((problem, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <XCircle className="h-4 w-4 text-destructive/50 flex-shrink-0 mt-0.5" />
          <span>{problem}</span>
        </li>
      ))}
    </ul>
    <p className="text-sm text-accent">→ {consequence}</p>
  </motion.div>
);

interface OriaSolutionProps {
  title: string;
  questions: string[];
  effect: string;
  delay: number;
}

const OriaSolution = ({ title, questions, effect, delay }: OriaSolutionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-accent/5 rounded-xl p-6 border border-accent/20"
  >
    <h4 className="font-serif text-lg text-foreground mb-4">{title}</h4>
    <ul className="space-y-2 mb-4">
      {questions.map((q, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <span className="italic">"{q}"</span>
        </li>
      ))}
    </ul>
    <p className="text-sm text-accent font-medium">→ {effect}</p>
  </motion.div>
);

const OriaModell = () => {
  const { language } = useLanguage();

  const coreAssumptions = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Bedürfnisse entstehen aus Erfahrungen",
      description: "Nicht abstrakt, sondern aus erlebten, gespeicherten Erfahrungen – somatisch, emotional und relational."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Unerfüllte Bedürfnisse organisieren innere Muster",
      description: "IFS-Logik: Antreiber, Kritiker, Vergleichsanteile, Rückzug, Überanpassung entstehen als Schutzmechanismen."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Erfüllung braucht Resonanz, nicht nur Reize",
      description: "Resonanz entsteht in Beziehung, nicht im Konsum. Individualismus und Social Media greifen oft gegen diese Logik ein."
    }
  ];

  const comparisonData = [
    { socialMedia: "Reiz", oria: "Resonanz" },
    { socialMedia: "Aufmerksamkeit", oria: "Beziehung" },
    { socialMedia: "Vergleich", oria: "Selbstkontakt" },
    { socialMedia: "Simulation", oria: "Verkörperung" },
    { socialMedia: "Sofortreaktion", oria: "Nachklang" }
  ];

  const needCards = [
    {
      title: "Zugehörigkeit",
      promise: "Du bist Teil von etwas. Du wirst gesehen.",
      reality: [
        "Zugehörigkeit ohne Verlässlichkeit",
        "Kontakt ohne Bindung",
        "Sichtbarkeit ohne Halt"
      ],
      diagnosis: "Das Bedürfnis nach Bindung bleibt offen, weil keine gegenseitige Verantwortlichkeit entsteht.",
      trace: "Typische Oria-Spur: Viele Kontakte – wenig innere Sättigung.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Anerkennung & Wert",
      promise: "Du bist wertvoll, wenn du Resonanz bekommst.",
      reality: [
        "Anerkennung ist quantitativ (Likes)",
        "Wert ist konditional (Performance)",
        "Pausen fühlen sich wie Wertverlust an"
      ],
      diagnosis: "Das Bedürfnis nach Wertschätzung wird externalisiert und vom inneren Erleben entkoppelt.",
      trace: "Innere Folge: Kritiker-Anteile werden stärker, Selbstwert wird volatil.",
      icon: <Heart className="h-6 w-6" />
    },
    {
      title: "Selbstwirksamkeit",
      promise: "Deine Stimme zählt.",
      reality: [
        "Algorithmen filtern Wirkung",
        "Sichtbarkeit ist unberechenbar",
        "Einfluss fühlt sich zufällig an"
      ],
      diagnosis: "Statt Selbstwirksamkeit entsteht Abhängigkeit von Reaktion.",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Sinn & Identität",
      promise: "Zeig, wer du bist.",
      reality: [
        "Identität wird kuratiert",
        "Komplexität wird reduziert",
        "Ambivalenz wird unsichtbar"
      ],
      diagnosis: "Das Bedürfnis nach Authentizität wird unterlaufen, weil echtes Erleben nicht gleich vermittelbar ist.",
      icon: <Compass className="h-6 w-6" />
    }
  ];

  const structuralIssues = [
    {
      title: "Keine Körperdimension",
      problems: [
        "Kein Mit-Schwingen",
        "Kein Nervensystem-Abgleich",
        "Keine Co-Regulation"
      ],
      consequence: "Grundbedürfnisse nach Sicherheit und Beruhigung bleiben offen.",
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: "Keine Erinnerungstiefe",
      problems: [
        "Alles ist 'jetzt'",
        "Kaum gemeinsamer Kontext",
        "Keine geteilte Geschichte"
      ],
      consequence: "Bedürfnisse nach Verlässlichkeit und Verwurzelung können sich nicht aufbauen.",
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Keine Verantwortung",
      problems: [
        "Beziehung ist jederzeit abbrechbar",
        "Verletzungen bleiben folgenlos",
        "Reparatur findet kaum statt"
      ],
      consequence: "Das Bedürfnis nach Vertrauen bleibt ungenährt.",
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const oriaSolutions = [
    {
      title: "Erinnerung statt Vergleich",
      questions: [
        "Wo habe ich dieses Bedürfnis früher schon gespürt?",
        "Wann war es genährt?",
        "Wann wurde es verletzt?"
      ],
      effect: "Bedürfnisse bekommen Tiefe, nicht Druck."
    },
    {
      title: "Innere Anteile statt Selbstoptimierung",
      questions: [
        "Wer in mir sucht gerade Anerkennung?",
        "Wer fühlt sich ausgeschlossen?",
        "Wer ist übermüdet vom Vergleichen?"
      ],
      effect: "Bedürfnisse werden gehalten, nicht bewertet."
    },
    {
      title: "Beziehung als Nährboden",
      questions: [
        "Wo erlebe ich echte Resonanz – mit mir und anderen?"
      ],
      effect: "Nicht 'Wie wirke ich?' sondern 'Wo erlebe ich Verbindung?'"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 md:pb-24 relative overflow-hidden min-h-[60vh] flex items-center">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.img
            src={oriaOwlFine}
            alt=""
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-[240px] sm:w-[360px] md:w-[500px] lg:w-[600px] h-auto object-contain"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mb-4 sm:mb-5"
            >
              <img
                src={bbOwlLogo}
                alt="Oria"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-foreground leading-tight tracking-tight">
                Das Oria-Modell
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-accent font-serif mb-5 sm:mb-6"
            >
              Resonanz statt Reiz – Bedürfnisse verstehen und nähren
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed"
            >
              Warum Social Media Bedürfnisse aktiviert, aber nicht erfüllt – 
              und wie Oria einen anderen Weg geht.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Assumptions */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Oria-Grundannahmen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Drei Kernideen, die Orias Verständnis von menschlichen Bedürfnissen prägen.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {coreAssumptions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Individualism Section */}
      <section className="py-16 sm:py-20 bg-muted/20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Individualismus aus Oria-Sicht
            </h2>
            <p className="text-muted-foreground mb-4">
              Vom „inneren Kompass" zur Daueranspannung
            </p>
            <Link 
              to="/individualismus" 
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors group"
            >
              <span className="underline underline-offset-4">Die Geschichte des westlichen Individualismus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-accent/5 rounded-xl p-6 border border-accent/20"
            >
              <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                Was Individualismus versprach
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Ich darf meine innere Stimme ernst nehmen</li>
                <li>• Ich darf meine Bedürfnisse spüren</li>
                <li>• Ich darf mein Leben gestalten</li>
              </ul>
              <p className="text-sm text-accent">
                → Die gesunde Seite: Selbstkontakt → Bedürfnis-Klarheit → bewusste Wahl
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-destructive/5 rounded-xl p-6 border border-destructive/20"
            >
              <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Was faktisch passiert ist
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Der westliche Individualismus ist gekippt von innerer Orientierung zu ständiger Selbstbewertung.
              </p>
              <div className="bg-background/50 rounded-lg p-3 mb-3">
                <p className="text-sm italic text-foreground">
                  "Das Selbst ist nicht mehr erlebt, sondern beobachtet."
                </p>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• „Bin ich gut genug?"</li>
                <li>• „Mache ich es richtig?"</li>
                <li>• „Bin ich weiter als andere?"</li>
              </ul>
              <p className="text-sm text-amber-600 mt-3">
                → Bedürfnisse werden nicht mehr gefühlt, sondern gemessen.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media as Pseudo-Need-Fulfiller */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Social Media als „Pseudo-Bedürfnis-Erfüller"
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Social Media ist kein neutraler Raum, sondern ein Bedürfnis-Simulationssystem.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {needCards.map((card, i) => (
              <NeedCard
                key={i}
                {...card}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-20 bg-muted/20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Der entscheidende Unterschied
            </h2>
            <p className="text-muted-foreground">
              Reiz vs. Resonanz
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-border"
          >
            <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b-2 border-border">
              <p className="text-sm font-medium text-muted-foreground">Social Media</p>
              <p className="text-sm font-medium text-accent">Oria</p>
            </div>
            {comparisonData.map((row, i) => (
              <ComparisonRow
                key={i}
                {...row}
                delay={i * 0.05}
              />
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-accent/10 rounded-xl p-6 text-center border border-accent/20"
          >
            <p className="text-foreground font-serif text-lg">
              Social Media aktiviert Bedürfnisse – <br />
              <span className="text-accent">Oria hilft, sie zu verstehen, zu halten und real zu nähren.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Structural Issues */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Warum Social Media Bedürfnisse strukturell nicht erfüllen kann
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {structuralIssues.map((issue, i) => (
              <StructuralIssue
                key={i}
                {...issue}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What Oria Does Differently */}
      <section className="py-16 sm:py-20 bg-muted/20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
              Was Oria fundamental anders macht
            </h2>
            <p className="text-muted-foreground">
              Oria arbeitet gegen die Logik von Social Media
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {oriaSolutions.map((solution, i) => (
              <OriaSolution
                key={i}
                {...solution}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-border">
              <Sparkles className="h-8 w-8 text-accent mx-auto mb-6" />
              <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground leading-relaxed mb-6">
                "Social Media hat uns beigebracht, Bedürfnisse sichtbar zu machen, aber nicht, sie wirklich zu erfüllen."
              </blockquote>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Viele Menschen sind heute nicht zu bedürftig – sondern unterernährt an echter Resonanz.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <Link
              to="/oria"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-colors"
            >
              Mehr über Oria erfahren
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/oria-apps"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-full font-medium hover:bg-muted/50 transition-colors"
            >
              Oria Apps entdecken
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Oria. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
            </p>
            <Link
              to="/impressum"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OriaModell;
