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
  Layers,
  XCircle,
  HelpCircle,
  Activity,
  HandHeart,
  Ban
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

  const overwhelmTypes = [
    {
      type: "Kognitive Überforderung",
      subtitle: "Zu viel Denken, zu viele Optionen, zu viele Entscheidungen",
      symptoms: [
        "Informationsflut",
        "Dauernde Abwägungen",
        "Kein innerer Abschluss"
      ],
      nervousSystem: "dauerhaft aktiviert",
      whatHelps: [
        "Reduktion (Input-Diät)",
        "Externalisieren (aufschreiben, strukturieren)",
        "Priorisieren (nicht alles ist gleich wichtig)"
      ],
      oriaHelps: "Gedanken werden verlangsamt, innere Ordnung entsteht, Entscheidungen an Bedürfnisse rückgekoppelt",
      oriaLimit: null,
      icon: Brain,
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30"
    },
    {
      type: "Emotionale Überforderung",
      subtitle: "Gefühle sind da, aber nicht regulierbar",
      symptoms: [
        "Widersprüchliche Gefühle",
        "Schuld, Scham, Angst, Ohnmacht",
        "Ich weiß nicht, was ich fühle – nur dass es zu viel ist"
      ],
      nervousSystem: "überflutet",
      whatHelps: [
        "Benennen statt wegdrücken",
        "Co-Regulation (nicht allein bleiben)",
        "Körperwahrnehmung"
      ],
      oriaHelps: "Gefühle werden schrittweise erkundet, Erinnerungen als sichere Anker genutzt, innere Anteile erkannt",
      oriaLimit: "Wenn Gefühle akut überwältigend sind (Panik, Trauma-Flashbacks), braucht es menschliche Begleitung.",
      icon: Heart,
      color: "from-rose-500/20 to-rose-600/10",
      borderColor: "border-rose-500/30"
    },
    {
      type: "Soziale / relationale Überforderung",
      subtitle: "Zu viele Erwartungen – zu wenig Halt",
      symptoms: [
        "Rollenstress (Job, Familie, Care)",
        "Permanente Erreichbarkeit",
        "Fehlende Abgrenzung"
      ],
      nervousSystem: "im Dauer-Alarm",
      whatHelps: [
        "Grenzen klären",
        "Rollen entlasten",
        "Erwartungen sichtbar machen"
      ],
      oriaHelps: "Bedürfnisse hinter Anpassung werden sichtbar, alte Beziehungsmuster erkannt, innere Erlaubnis zur Abgrenzung entsteht",
      oriaNote: "Oria ersetzt kein Gespräch, aber macht es möglich.",
      icon: Users,
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30"
    },
    {
      type: "Existenzielle Überforderung",
      subtitle: "Sinn-, Identitäts- oder Lebensfragen",
      symptoms: [
        "Ist das alles?",
        "Mache ich es richtig?",
        "Wer bin ich jenseits meiner Rollen?"
      ],
      nervousSystem: "orientierungslos",
      whatHelps: [
        "Sinn nicht 'finden', sondern spüren",
        "Biografische Einordnung",
        "Verbindung statt Zieloptimierung"
      ],
      oriaHelps: "Identität als gelebte Spur verstanden, Erinnerungen geben Orientierung, Werte entstehen aus Erfahrung statt Idealen",
      oriaStrong: true,
      icon: Compass,
      color: "from-violet-500/20 to-violet-600/10",
      borderColor: "border-violet-500/30"
    },
    {
      type: "Chronische Erschöpfung / Burnout-nahe Zustände",
      subtitle: "Überforderung ohne Regenerationsfenster",
      symptoms: [
        "Schlaf hilft nicht mehr",
        "Reizbarkeit, Rückzug",
        "Emotionale Taubheit"
      ],
      nervousSystem: "erschöpft / dysreguliert",
      whatHelps: [
        "Echte Entlastung (nicht nur Pausen)",
        "Medizinische / therapeutische Abklärung",
        "Stabile, verlässliche Unterstützung"
      ],
      oriaCan: [
        "Frühwarnzeichen sichtbar machen",
        "Überforderungsmuster erklären",
        "Selbstabwertung reduzieren"
      ],
      oriaCannot: [
        "Erschöpfung 'wegreflektieren'",
        "Fehlende Ressourcen ersetzen",
        "Therapie, Medizin oder strukturelle Entlastung ersetzen"
      ],
      icon: Activity,
      color: "from-gray-500/20 to-gray-600/10",
      borderColor: "border-gray-500/30"
    }
  ];

  const oriaHelpsAt = [
    "Orientierung statt Selbstoptimierung",
    "Bedürfnis-Klarheit statt Vergleich",
    "Innere Führung statt äußerem Druck",
    "Verlangsamung komplexer Prozesse",
    "Verbindung von Erinnerung, Gefühl und Bedeutung"
  ];

  const oriaDoesNotHelp = [
    "Akute psychische Krisen",
    "Unbehandelte Traumafolgen",
    "Klinische Depression ohne Begleitung",
    "Strukturelle Überlastung (z. B. 60h Care + Job)",
    "Toxische Umfelder, die realen Schaden verursachen"
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

      {/* NEW: Types of Overwhelm Section */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-4 text-foreground">
            Die wichtigsten Arten von Überforderung
          </h2>
          <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto">
            Oria unterscheidet Überforderung nicht nach Symptomen, sondern nach <strong className="text-foreground">Quelle und Dynamik</strong>.
          </p>
          <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto">
            Jede Art hat ihre eigene Logik – und Oria reagiert entsprechend differenziert.
          </p>

          <div className="space-y-6">
            {overwhelmTypes.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`bg-gradient-to-r ${item.color} rounded-2xl p-6 md:p-8 border ${item.borderColor}`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Header */}
                    <div className="lg:w-1/3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-background/50">
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{item.type}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{item.subtitle}</p>
                      
                      {/* Symptoms */}
                      <div className="space-y-1.5 mb-4">
                        {item.symptoms.map((symptom, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-foreground/60">•</span>
                            <span className="text-foreground/80">{symptom}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 text-xs">
                        <Activity className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Nervensystem: <span className="text-foreground font-medium">{item.nervousSystem}</span></span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-2/3 lg:border-l lg:border-foreground/10 lg:pl-6 space-y-4">
                      {/* What helps generally */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Was hilft generell:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.whatHelps.map((help, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-background/50 text-foreground/80">
                              {help}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Oria helps */}
                      {item.oriaHelps && (
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <p className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            {item.oriaStrong ? "Hier ist Oria besonders stark:" : "Oria hilft hier, weil:"}
                          </p>
                          <p className="text-sm text-foreground/90">{item.oriaHelps}</p>
                          {item.oriaNote && (
                            <p className="text-sm text-primary mt-2 italic">→ {item.oriaNote}</p>
                          )}
                        </div>
                      )}

                      {/* Oria limit */}
                      {item.oriaLimit && (
                        <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                          <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>⚠️ Grenze: {item.oriaLimit}</span>
                          </p>
                        </div>
                      )}

                      {/* Oria can / cannot (for chronic exhaustion) */}
                      {item.oriaCan && item.oriaCannot && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                            <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Oria kann:
                            </p>
                            <ul className="space-y-1">
                              {item.oriaCan.map((can, i) => (
                                <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                                  <span className="text-primary">•</span>
                                  {can}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
                            <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Oria kann nicht:
                            </p>
                            <ul className="space-y-1">
                              {item.oriaCannot.map((cannot, i) => (
                                <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                                  <span className="text-destructive">•</span>
                                  {cannot}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

      {/* NEW: Where Oria Helps / Doesn't Help */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-foreground">
            Wobei Oria hilft – und wobei nicht
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Oria helps */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/20">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-serif text-foreground">Oria hilft bei:</h3>
              </div>
              
              <ul className="space-y-3 mb-6">
                {oriaHelpsAt.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-background/50 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-primary font-medium mb-2">Kurz:</p>
                <p className="text-foreground italic">
                  Oria hilft Menschen, sich selbst wieder zu lesen, statt sich permanent zu bewerten.
                </p>
              </div>
            </div>
            
            {/* Oria does NOT help */}
            <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-2xl p-6 md:p-8 border border-destructive/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <Ban className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="text-xl font-serif text-foreground">Oria hilft nicht bei:</h3>
              </div>
              
              <ul className="space-y-3 mb-6">
                {oriaDoesNotHelp.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-background/50 rounded-lg p-4 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">
                  Oria ist kein Schutzschild gegen unhaltbare Bedingungen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEW: Core Distinction */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.57 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif text-foreground">Die wichtigste Unterscheidung</h2>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-6 mb-6">
              <p className="text-lg text-foreground italic leading-relaxed">
                Nicht jede Überforderung ist ein inneres Thema.<br/>
                Manche sind ein <strong className="text-primary">ehrliches Signal</strong>, dass etwas im Außen nicht stimmt.
              </p>
            </div>
            
            <p className="text-muted-foreground mb-4">Oria hilft vor allem bei der Frage:</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <p className="text-foreground font-medium">„Was ist meins – und was nicht?"</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <p className="text-foreground font-medium">„Was braucht innere Klärung – und was äußere Veränderung?"</p>
              </div>
            </div>
          </div>
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

      {/* NEW: Closing Statement */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10 rounded-2xl p-8 md:p-12 border border-accent/20 text-center">
            <HandHeart className="h-12 w-12 text-primary mx-auto mb-6" />
            
            <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-6">
              Viele Menschen scheitern nicht,<br/>
              weil sie zu wenig können,<br/>
              sondern weil sie zu lange versucht haben,<br/>
              <strong className="text-primary">alles allein zu tragen.</strong>
            </p>
            
            <div className="w-16 h-px bg-primary/30 mx-auto mb-6" />
            
            <p className="text-lg text-muted-foreground mb-2">
              Oria ist kein weiterer Anspruch.
            </p>
            <p className="text-xl text-primary font-medium">
              Es ist eine Erlaubnis zur Orientierung.
            </p>
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
