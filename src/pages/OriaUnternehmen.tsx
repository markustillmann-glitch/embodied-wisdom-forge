import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Users, 
  Shield, 
  Heart, 
  Crown, 
  Star, 
  Layers, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Button } from "@/components/ui/button";
import bbOwlLogo from "@/assets/bb-owl-new.png";

interface BenefitCardProps {
  number: string;
  title: string;
  subtitle: string;
  effects: string[];
  businessEffects: string[];
  icon: React.ReactNode;
  delay: number;
}

const BenefitCard = ({ number, title, subtitle, effects, businessEffects, icon, delay }: BenefitCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-card/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-border hover:border-accent/30 transition-all duration-300 group"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-accent font-medium text-sm">{number}</span>
        <h3 className="font-serif text-xl sm:text-2xl text-foreground mt-1">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1 italic">{subtitle}</p>
      </div>
    </div>
    
    <div className="space-y-4 mt-6">
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Was Oria bewirkt</h4>
        <ul className="space-y-2">
          {effects.map((effect, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Business-Effekt</h4>
        <ul className="space-y-2">
          {businessEffects.map((effect, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-accent">
              <TrendingUp className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

const benefits = [
  {
    number: "01",
    title: "Höhere kognitive Leistungsfähigkeit",
    subtitle: "Nicht durch 'mehr Push', sondern durch weniger inneres Rauschen.",
    effects: [
      "Reduktion von mentalem Overload",
      "bessere Fokussierung (Deep Work)",
      "schnellere Erholung nach Stressphasen"
    ],
    businessEffects: [
      "höhere Qualität in Engineering & Produkt",
      "weniger Fehler durch Erschöpfung"
    ],
    icon: <Brain className="h-6 w-6" />
  },
  {
    number: "02",
    title: "Reifere Zusammenarbeit & Konfliktfähigkeit",
    subtitle: "Tech-Konflikte sind selten sachlich – sie sind oft Beziehungs- oder Identitätskonflikte.",
    effects: [
      "mehr Selbstempathie → weniger Projektion",
      "klarere Kommunikation bei Spannungen",
      "Konflikte werden früher erkannt und bearbeitet"
    ],
    businessEffects: [
      "weniger Eskalationen",
      "schnellere Team-Alignment-Zyklen",
      "bessere Retros & Decision Records"
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    number: "03",
    title: "Psychologische Sicherheit (ohne Kuschelkurs)",
    subtitle: "Psychologische Sicherheit ist ein Performance-Faktor, kein Soft Skill.",
    effects: [
      "Sprache für Unsicherheit, Zweifel, Grenzen",
      "Entlastung von Schuld- und Rechtfertigungsmustern",
      "mehr Mut, Risiken und Fehler anzusprechen"
    ],
    businessEffects: [
      "bessere Innovationsfähigkeit",
      "frühere Fehlererkennung",
      "höhere Lernkurve"
    ],
    icon: <Shield className="h-6 w-6" />
  },
  {
    number: "04",
    title: "Nachhaltige Leistungsfähigkeit statt Burnout-Zyklen",
    subtitle: "Viele Tech-Unternehmen optimieren Output – und verlieren Menschen.",
    effects: [
      "frühere Wahrnehmung von Überlastung",
      "gesündere Selbstregulation",
      "realistischere Selbsteinschätzung"
    ],
    businessEffects: [
      "geringere Fluktuation",
      "weniger krankheitsbedingte Ausfälle",
      "stabilere Senior-Teams"
    ],
    icon: <Heart className="h-6 w-6" />
  },
  {
    number: "05",
    title: "Stärkere Leadership-Qualität",
    subtitle: "Nicht mehr 'Hero-Leader', sondern reife Selbstführung.",
    effects: [
      "Führungskräfte erkennen eigene Trigger",
      "bessere Trennung von Rolle & innerem Anteil",
      "klarere, ruhigere Führung in Krisen"
    ],
    businessEffects: [
      "höhere Team-Stabilität",
      "weniger Micromanagement",
      "bessere Entscheidungsqualität auf C- & VP-Level"
    ],
    icon: <Crown className="h-6 w-6" />
  },
  {
    number: "06",
    title: "Employer Branding & Talentbindung",
    subtitle: "Top-Tech-Talente suchen mehr als Gehalt.",
    effects: [
      "erlebte Entwicklungsbegleitung",
      "ernst gemeinte Menschenorientierung",
      "Differenzierung gegenüber Wellbeing-Buzzword-Firmen"
    ],
    businessEffects: [
      "höhere Attraktivität als Arbeitgeber",
      "stärkere Bindung von Senior-Talenten"
    ],
    icon: <Star className="h-6 w-6" />
  },
  {
    number: "07",
    title: "Skalierbare Ergänzung zu Coaching & Leadership-Programmen",
    subtitle: "Coaching ist teuer – aber wirkungsvoll. Oria skaliert den Effekt.",
    effects: [
      "Transfer von Workshops in den Alltag",
      "datenbasierte Reflexion statt Bauchgefühl",
      "kontinuierliche Begleitung zwischen Sessions"
    ],
    businessEffects: [
      "höherer ROI auf Leadership-Programme",
      "messbar nachhaltigere Wirkung"
    ],
    icon: <Layers className="h-6 w-6" />
  },
  {
    number: "08",
    title: "Kulturelle Reife",
    subtitle: "Der vielleicht größte, aber leiseste Effekt.",
    effects: [
      "weniger Schuld-, mehr Lernkultur",
      "mehr Verantwortung statt Rechtfertigung",
      "Sprache für innere & zwischenmenschliche Dynamiken"
    ],
    businessEffects: [
      "reifere Organisation",
      "bessere Skalierbarkeit",
      "weniger Kultur-Erosion bei Wachstum"
    ],
    icon: <Sparkles className="h-6 w-6" />
  }
];

const OriaUnternehmen = () => {
  const { language } = useLanguage();

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
            {language === 'de' ? 'Seminarangebote' : 'Seminar Offers'}
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
              <Building2 className="h-8 w-8 text-accent" />
              <span className="text-accent font-medium">Für Unternehmen</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-6">
              Oria für Tech-Organisationen
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Oria verbessert nicht nur Resilienz, sondern Entscheidungsqualität, Zusammenarbeit, Leadership und nachhaltige Leistungsfähigkeit – und adressiert damit zentrale Engpässe moderner Tech-Organisationen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              8 Mehrwerte für Ihre Organisation
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Von individueller Selbstführung bis zur kulturellen Reife – Oria wirkt auf mehreren Ebenen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.number}
                {...benefit}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <PolygonalBackground variant="accent" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img 
              src={bbOwlLogo} 
              alt="Oria" 
              className="h-16 w-auto mx-auto mb-6 opacity-80"
            />
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Interesse an Oria für Ihr Unternehmen?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Wir bieten maßgeschneiderte Seminare und Implementierungsbegleitung für Tech-Teams und Führungskräfte an.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/seminare" onClick={() => window.scrollTo(0, 0)}>
                  Zu den Seminarangeboten
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/team" onClick={() => window.scrollTo(0, 0)}>
                  Team kennenlernen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-xl text-foreground mb-2">Inner Guidance Through Lived Memories</p>
          <p className="text-muted-foreground text-sm mb-6">
            {language === 'de' 
              ? 'Basierend auf dem Inner Compass Framework zum Umgang mit Stress, inneren Begrenzungen und Prägungen'
              : 'A memory-based action model for dealing with stress, inner limitations, and conditioning'
            }
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
            <Link 
              to="/" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/oria" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Oria entdecken
            </Link>
            <Link 
              to="/seminare" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Seminare
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

export default OriaUnternehmen;
