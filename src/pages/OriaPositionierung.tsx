import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight,
  Compass,
  Brain,
  Heart,
  Shield,
  Eye,
  Sparkles,
  RefreshCw,
  Waves,
  Target,
  Users,
  Zap,
  Clock,
  Scale,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { PolygonalBackground } from "@/components/PolygonalBackground";

const OriaPositionierung = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const westernDynamics = [
    {
      dynamic: "Dauerreiz & Vergleich",
      effect: "Fragmentierung",
      oriaResponse: "Innere Sammlung über Erinnerungen"
    },
    {
      dynamic: "Selbstoptimierung",
      effect: "Druck",
      oriaResponse: "Selbstklärung statt Selbstverbesserung"
    },
    {
      dynamic: "Verantwortung ohne Halt",
      effect: "Schuld & Ohnmacht",
      oriaResponse: "Bedürfnis-Klarheit statt Selbstanklage"
    },
    {
      dynamic: "Körper ignorieren",
      effect: "Erschöpfung",
      oriaResponse: "Somatische Marker als Frühwarnsystem"
    },
    {
      dynamic: "Sinn individuell erzwingen",
      effect: "Leere",
      oriaResponse: "Sinn emergiert aus Kohärenz"
    }
  ];

  const overwhelmCauses = [
    { cause: "Informationsflut", oriaEffect: "Reduktion auf innerlich relevante Signale", icon: Zap },
    { cause: "Beschleunigung", oriaEffect: "Verlangsamung durch Erinnerungsarbeit", icon: Clock },
    { cause: "Optimierungsdruck", oriaEffect: "Ausrichtung an Bedürfnissen statt Idealen", icon: Target },
    { cause: "Vergleich", oriaEffect: "Rückbindung an eigene Geschichte", icon: Users },
    { cause: "Rollenvermischung", oriaEffect: "Innere Abgrenzung statt äußerer Flucht", icon: Shield },
    { cause: "Fehlende Sprache", oriaEffect: "Vokabular für innere Zustände", icon: Brain },
    { cause: "Körperstress", oriaEffect: "Somatische Selbstregulation", icon: Heart },
    { cause: "Sinnverlust", oriaEffect: "Kohärenz statt Purpose-Zwang", icon: Lightbulb }
  ];

  const translationSteps = [
    {
      step: 1,
      title: "Einstieg über Erinnerungen",
      subtitle: "statt Probleme",
      description: "Konkrete Situationen (\"Wann war es zuletzt zu viel?\") – keine Analyse, sondern Anker. Das Nervensystem fühlt sich sicherer als bei abstrakten Fragen.",
      effect: "Überforderung wird greifbar, nicht überwältigend",
      icon: Eye,
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30"
    },
    {
      step: 2,
      title: "Gefühle → Bedürfnisse",
      subtitle: "statt Selbsturteil",
      description: "Gefühle als Signale, nicht als Fehler. Bedürfnisse als legitime innere Orientierungsgrößen.",
      examples: [
        "\"Ich bin überfordert\" → Bedürfnis nach Begrenzung",
        "\"Ich funktioniere nur noch\" → Bedürfnis nach Sinn / Wahlfreiheit",
        "\"Ich ziehe mich zurück\" → Bedürfnis nach Schutz"
      ],
      effect: "Entlastung durch innere Logik",
      icon: Heart,
      color: "from-rose-500/20 to-rose-600/10",
      borderColor: "border-rose-500/30"
    },
    {
      step: 3,
      title: "Innere Anteile sichtbar machen",
      subtitle: "statt Identifikation",
      description: "Überforderte Anteile ≠ ganze Person. Leistungs-, Antreiber-, Rückzugs-, Kontrollanteile bekommen Kontext.",
      effect: "\"Ich bin nicht überfordert – ein Teil von mir ist es.\"",
      icon: Layers,
      color: "from-violet-500/20 to-violet-600/10",
      borderColor: "border-violet-500/30"
    },
    {
      step: 4,
      title: "Körper als Verbündeter",
      subtitle: "statt Warnlampe ignorieren",
      description: "Oria fragt früh: Wo im Körper spürbar? Seit wann? Was reguliert ein klein wenig?",
      effect: "Prävention statt Zusammenbruch",
      icon: Waves,
      color: "from-emerald-500/20 to-emerald-600/10",
      borderColor: "border-emerald-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-24">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
      </div>

      {/* Hero Section */}
      <motion.section 
        className="container mx-auto px-4 pb-16 text-center"
        {...fadeIn}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
          <Compass className="h-4 w-4" />
          <span className="text-sm font-medium">Beyond Constant Overload</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif font-light mb-6 text-foreground max-w-4xl mx-auto leading-tight">
          Oria – Ein inneres <span className="text-primary">Navigationssystem</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Oria ist ein inneres Navigationssystem, das Überforderung nicht bekämpft,
          sondern in <strong className="text-foreground">verstehbare Muster</strong>, <strong className="text-foreground">Bedürfnisse</strong> und <strong className="text-foreground">handhabbare nächste Schritte</strong> übersetzt.
        </p>
      </motion.section>

      {/* Core Problem Section */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-destructive/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-2xl font-serif text-foreground">Das Kernproblem</h2>
            </div>
            
            <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
              Überforderung entsteht, wenn gleichzeitig gilt:
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                "zu viele Eindrücke",
                "zu viele Rollen",
                "zu viele implizite Erwartungen"
              ].map((item, i) => (
                <div key={i} className="bg-destructive/5 rounded-lg p-4 text-center">
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <p className="text-lg text-muted-foreground text-center">
              → ohne inneren Referenzrahmen
            </p>
            
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-lg text-primary font-medium flex items-center justify-center gap-2">
                <Compass className="h-5 w-5" />
                Oria stellt diesen Referenzrahmen bereit.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Counter Model Table */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-8 text-foreground">
            Oria als Gegenmodell zur westlichen Überforderungslogik
          </h2>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 border-b border-border">
              <div className="text-sm font-semibold text-muted-foreground">Westliche Dynamik</div>
              <div className="text-sm font-semibold text-muted-foreground text-center">Wirkung</div>
              <div className="text-sm font-semibold text-primary">Oria-Gegenbewegung</div>
            </div>
            
            {/* Table Rows */}
            {westernDynamics.map((row, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-3 gap-4 p-4 items-center ${i !== westernDynamics.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className="text-foreground font-medium text-sm">{row.dynamic}</div>
                <div className="text-center">
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                    {row.effect}
                  </span>
                </div>
                <div className="text-sm text-primary">{row.oriaResponse}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Translation Steps Section */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-4 text-foreground">
          Die Oria-Logik: Überforderung „lesen lernen"
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Oria arbeitet nicht linear, sondern in Übersetzungsschleifen:
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          {translationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-gradient-to-r ${step.color} rounded-2xl p-6 border ${step.borderColor}`}
              >
                {/* Step Badge */}
                <div className="absolute -left-3 top-6 w-10 h-10 rounded-full bg-background flex items-center justify-center border-2 border-primary">
                  <span className="text-lg font-bold text-primary">{step.step}</span>
                </div>

                <div className="ml-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      <span className="text-sm text-muted-foreground">{step.subtitle}</span>
                    </div>
                  </div>

                  <p className="text-foreground/90 mb-4 leading-relaxed">{step.description}</p>
                  
                  {step.examples && (
                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-muted-foreground">Typische Oria-Übersetzungen:</p>
                      {step.examples.map((example, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-foreground">{example}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-foreground/10">
                    <p className="text-sm font-medium text-primary flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Effekt: {step.effect}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Overwhelm Causes Grid */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-4 text-foreground">
          Wie Oria konkret gegen Überforderungsursachen wirkt
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          8 häufige Ursachen – und Orias Antwort darauf
        </p>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overwhelmCauses.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-destructive/10">
                    <Icon className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.cause}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{item.oriaEffect}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Why Oria doesn't overwhelm */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif text-foreground">
                Warum Oria nicht überfordert – obwohl es „tief" ist
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Kein Vorwissen nötig</p>
                    <p className="text-sm text-muted-foreground">GfK / IFS / Somatik implizit integriert</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Einstieg immer konkret</p>
                    <p className="text-sm text-muted-foreground">Biografisch & niedrigschwellig</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Tiefe nur wenn bereit</p>
                    <p className="text-sm text-muted-foreground">Kein Druck, keine Konfrontation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Nervensystem-geführt</p>
                    <p className="text-sm text-muted-foreground">Oria folgt dem Körper, nicht dem Intellekt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Paradigm Shift */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-foreground">
            Der zentrale Paradigmenwechsel
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Western World asks */}
            <div className="bg-muted/30 rounded-2xl p-6 border border-border">
              <p className="text-sm text-muted-foreground mb-4">Die westliche Welt fragt:</p>
              <p className="text-xl font-serif text-foreground italic">
                „Wie bekomme ich mein Leben besser organisiert?"
              </p>
            </div>
            
            {/* Oria asks */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/30">
              <p className="text-sm text-primary mb-4">Oria fragt:</p>
              <p className="text-xl font-serif text-foreground">
                „Was versucht meine Überforderung mir zu sagen?"
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Beyond Constant Overload Answer */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-8 text-foreground">
              Oria als Antwort auf „Beyond Constant Overload"
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Not through */}
              <div>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Nicht durch:
                </p>
                <ul className="space-y-2">
                  {["mehr Tools", "bessere Routinen", "härtere Priorisierung"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-destructive/60">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* But through */}
              <div>
                <p className="text-sm text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sondern durch:
                </p>
                <ul className="space-y-2">
                  {[
                    { text: "innere Ordnung", icon: Compass },
                    { text: "Bedürfnis-Wahrheit", icon: Heart },
                    { text: "freundliche Selbstführung", icon: Shield }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex items-center gap-2 text-foreground">
                        <Icon className="h-4 w-4 text-primary" />
                        {item.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="container mx-auto px-4 pb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-8">
            Erfahre mehr darüber, wie Oria in der Praxis funktioniert:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/oria-apps">
              <Button className="gap-2">
                Oria Apps entdecken
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/oria-modell">
              <Button variant="outline" className="gap-2">
                Das Oria-Modell
                <Brain className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <Link to="/impressum" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Impressum & Datenschutz
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default OriaPositionierung;
