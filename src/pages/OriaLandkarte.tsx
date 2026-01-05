import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Layers, 
  Users, 
  Brain, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  ArrowRight,
  Quote,
  Compass,
  RefreshCw,
  Eye,
  Hand,
  MessageCircle,
  Target,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

const OriaLandkarte = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const levels = [
    {
      level: 1,
      title: "Erleben im Alltag",
      subtitle: "Oria-Kern",
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30",
      iconBg: "bg-amber-500/20",
      what: ["Gefühle benennbar machen", "Körpersignale ernst nehmen", "diffuse Zustände ordnen", "innere Ambivalenzen sichtbar machen"],
      not: ["Intervention", "Deutung", "Konfrontation"],
      result: "Oria stabilisiert Selbstwahrnehmung."
    },
    {
      level: 2,
      title: "Bedürfnis- & Resonanzlogik",
      subtitle: "implizit",
      color: "from-emerald-500/20 to-emerald-600/10",
      borderColor: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      background: ["GfK (Gefühl -> Bedürfnis -> Orientierung)", "IFS-Haltung (innere Vielstimmigkeit ohne Pathologisierung)"],
      note: 'Nutzer:innen kommen oft vorbereitet, aber nicht "modellhaft geschult"',
      result: "Coaching kann tiefer ansetzen, ohne Grundlagenarbeit."
    },
    {
      level: 3,
      title: "Körper & Sicherheit",
      subtitle: "",
      color: "from-sky-500/20 to-sky-600/10",
      borderColor: "border-sky-500/30",
      iconBg: "bg-sky-500/20",
      what: ["respektiert Nervensystem-Zustände", "vermeidet Überaktivierung", "normalisiert Schutzreaktionen"],
      helpful: ["Stress", "Erschöpfung", "Entscheidungsblockaden", "frühe Überforderungssignale"]
    },
    {
      level: 4,
      title: "Erinnerung & Muster",
      subtitle: "",
      color: "from-violet-500/20 to-violet-600/10",
      borderColor: "border-violet-500/30",
      iconBg: "bg-violet-500/20",
      not: ["Biografien", "Traumainhalte", "Diagnosen"],
      collects: ["wiederkehrende Gefühle", "Bedürfnis-Themen", "Körpermarker", "Kontext-Resonanzen"],
      result: 'schneller Zugang zu relevanten Mustern - weniger "Erklären von vorne"'
    },
    {
      level: 5,
      title: "Übergang zur Begleitung",
      subtitle: "entscheidend",
      color: "from-rose-500/20 to-rose-600/10",
      borderColor: "border-rose-500/30",
      iconBg: "bg-rose-500/20",
      signals: ["Wiederholung", "Intensität", "geringe Beweglichkeit"],
      transitions: ["IFS-nah: innere Konflikte, Selbstkritik, Schutzmuster", "GfK-nah: Beziehungskonflikte, Grenzen, Kommunikation"],
      result: "Coaching beginnt dort, wo Oria bewusst stehen bleibt."
    }
  ];

  const oriaIs = [
    "ein digitaler Selbstkontakt-Raum",
    "ein Übersetzer von Erleben in Orientierung",
    "eine niedrigschwellige Brücke zwischen Alltag und Begleitung"
  ];

  const oriaIsNot = [
    "kein Therapie-Ersatz",
    "kein Coaching-Programm",
    "kein Selbstoptimierungs-Tool"
  ];

  const benefits = {
    fachlich: {
      icon: Brain,
      title: "Fachlich",
      items: ["Klient:innen sind sprachfähiger", "weniger Einstieg über Symptome", "mehr Fokus auf relevante Themen"]
    },
    menschlich: {
      icon: Heart,
      title: "Menschlich",
      items: ["weniger Scham", "weniger Selbstabwertung", "mehr Eigenverantwortung"]
    },
    praktisch: {
      icon: Clock,
      title: "Praktisch",
      items: ["effizientere Sitzungen", "klarere Anliegen", "bessere Integration zwischen Terminen"]
    }
  };

  const partners = [
    "GfK-Trainer:innen & Mediator:innen",
    "IFS-Coaches & Therapeut:innen",
    "systemische Coaches",
    "Pädagog:innen & Schulbegleitung",
    "Führungskräfte- & Teamcoaches"
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
          <span className="text-sm font-medium">Orientierung für Partner:innen & Coaches</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 text-foreground">
          Die <span className="text-primary">Oria</span>-Landkarte
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Oria ist kein Coaching-Ansatz.<br />
          <span className="text-foreground font-medium">Oria ist ein vorbereitender und begleitender Resonanzraum.</span>
        </p>
      </motion.section>

      {/* What Oria Is / Is Not */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Is Not */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-destructive/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">Oria ist nicht</h3>
            </div>
            <ul className="space-y-2">
              {oriaIsNot.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive/60 mt-1">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Is */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Oria ist</h3>
            </div>
            <ul className="space-y-2">
              {oriaIs.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary/60 mt-1">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-muted-foreground bg-muted/30 rounded-xl px-6 py-4 inline-block">
            <ArrowRight className="inline h-4 w-4 mr-2 text-primary" />
            Oria arbeitet <strong className="text-foreground">vor, neben oder zwischen</strong> professionellen Prozessen – aber nicht an deren Stelle.
          </p>
        </div>
      </motion.section>

      {/* The 5 Levels */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-foreground">
          Die 5 Ebenen der Oria-Kooperation
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {levels.map((level, index) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`relative bg-gradient-to-r ${level.color} rounded-2xl p-6 border ${level.borderColor}`}
            >
              {/* Level Badge */}
              <div className={`absolute -left-3 top-6 w-10 h-10 rounded-full ${level.iconBg} flex items-center justify-center text-lg font-bold text-foreground border-2 border-background`}>
                {level.level}
              </div>

              <div className="ml-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-foreground">{level.title}</h3>
                  {level.subtitle && (
                    <span className="text-sm text-muted-foreground">({level.subtitle})</span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* What Oria does */}
                  {level.what && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Was Oria leistet:</p>
                      <ul className="space-y-1">
                        {level.what.map((item, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <Sparkles className="h-3 w-3 mt-1 text-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What doesn't happen / What Oria doesn't collect */}
                  {level.not && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {level.level === 4 ? "Oria sammelt keine:" : "Was hier nicht passiert:"}
                      </p>
                      <ul className="space-y-1">
                        {level.not.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground/80 flex items-start gap-2">
                            <XCircle className="h-3 w-3 mt-1 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Background for Level 2 */}
                  {level.background && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Modellhintergrund:</p>
                      <ul className="space-y-1">
                        {level.background.map((item, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <Layers className="h-3 w-3 mt-1 text-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Helpful for Level 3 */}
                  {level.helpful && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Besonders hilfreich bei:</p>
                      <div className="flex flex-wrap gap-2">
                        {level.helpful.map((item, i) => (
                          <span key={i} className="text-xs bg-background/50 px-2 py-1 rounded-full text-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collects for Level 4 */}
                  {level.collects && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Sondern:</p>
                      <ul className="space-y-1">
                        {level.collects.map((item, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <RefreshCw className="h-3 w-3 mt-1 text-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Signals for Level 5 */}
                  {level.signals && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Oria erkennt Übergangsmomente:</p>
                      <div className="flex flex-wrap gap-2">
                        {level.signals.map((item, i) => (
                          <span key={i} className="text-xs bg-background/50 px-2 py-1 rounded-full text-foreground border border-primary/20">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transitions for Level 5 */}
                  {level.transitions && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Typische Übergänge:</p>
                      <ul className="space-y-1">
                        {level.transitions.map((item, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Result */}
                {level.result && (
                  <div className="mt-4 pt-4 border-t border-foreground/10">
                    <p className="text-sm font-medium text-primary flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      {level.result}
                    </p>
                  </div>
                )}

                {/* Note for Level 2 */}
                {level.note && (
                  <p className="mt-3 text-xs text-muted-foreground italic">{level.note}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Role Clarification */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-foreground">
          Rollenklärung
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Oria */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <h3 className="text-xl font-semibold text-foreground">Oria</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-foreground">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm">Selbstkontakt</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Compass className="h-4 w-4 text-primary" />
                <span className="text-sm">Orientierung</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">Stabilisierung</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm">Selbstmitgefühl</span>
              </div>
            </div>
          </div>

          {/* Coach */}
          <div className="bg-gradient-to-br from-sky-500/10 to-sky-500/5 rounded-2xl p-6 border border-sky-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-sky-500" />
              <h3 className="text-xl font-semibold text-foreground">Coach / Therapeut:in</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4 text-sky-500" />
                <span className="text-sm">Beziehung</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Hand className="h-4 w-4 text-sky-500" />
                <span className="text-sm">Intervention</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Layers className="h-4 w-4 text-sky-500" />
                <span className="text-sm">Integration</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Target className="h-4 w-4 text-sky-500" />
                <span className="text-sm">Entwicklung</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-muted-foreground bg-muted/30 rounded-xl px-6 py-4">
            <strong className="text-foreground">Kooperationsprinzip:</strong><br />
            Oria bereitet vor – der Mensch arbeitet im Raum der Beziehung.
          </p>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-foreground">
          Vorteile für Coaches & Partner
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {Object.values(benefits).map((benefit, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
              </div>
              <ul className="space-y-2">
                {benefit.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-1 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Ethics */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Ethische Leitplanken</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                  Oria diagnostiziert nicht
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                  Oria vermittelt keine Pflicht-Coachings
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                  keine Datenweitergabe ohne Zustimmung
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Kooperation basiert auf:</p>
              <ul className="space-y-2">
                <li className="text-sm text-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  Freiwilligkeit
                </li>
                <li className="text-sm text-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  Transparenz
                </li>
                <li className="text-sm text-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  Autonomie der Nutzer:innen
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Values Section - NEW */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-4 text-foreground">
          Die zentralen Mehrwerte von Oria
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Was Oria von anderen Ansätzen unterscheidet
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Selbstkontakt */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Selbstkontakt statt Selbstoptimierung</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Oria fragt: "Was ist gerade lebendig in dir?" – nicht "Was willst du erreichen?"
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />reduziert inneren Druck</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />stärkt Selbstmitgefühl</li>
            </ul>
          </div>

          {/* Bedürfnislogik */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Compass className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Bedürfnisse als Orientierung (GfK)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Gefühle → Bedürfnisse → Kontext statt Ziele, Verhalten, Symptome.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />Konflikte werden verständlich</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />Entscheidungen werden stimmiger</li>
            </ul>
          </div>

          {/* Körper */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-sky-500/10">
                <Shield className="h-5 w-5 text-sky-500" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Körper als Informationsquelle</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Körpersignale, Spannungsorte und Energiezustände werden integriert.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />Zugang auch ohne Worte</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />frühe Stresssignale</li>
            </ul>
          </div>

          {/* Erinnerung */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <RefreshCw className="h-5 w-5 text-violet-500" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Erinnerung als Ressource</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Gefühl + Bedürfnis + Körper werden gespeichert, nicht Details.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />Muster sichtbar ohne Retraumatisierung</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />auch bei Demenz geeignet</li>
            </ul>
          </div>

          {/* Sicherheit */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Lock className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Sicherheit & Niedrigschwelligkeit</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Langsam, nicht konfrontativ, ohne Bewertung oder "Challenge"-Logik.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />nutzbar bei Überforderung</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />für vulnerable Gruppen</li>
            </ul>
          </div>

          {/* Oria lernt */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Oria lernt den Menschen</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Sprache, Tiefe & Rhythmus passen sich an – erlaubt Pausen & Unschärfe.
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />langfristige Nutzung</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />echte Beziehungserfahrung</li>
            </ul>
          </div>
        </div>

        {/* Comparison */}
        <div className="max-w-3xl mx-auto mt-12 bg-muted/30 rounded-2xl p-6 border border-border">
          <h4 className="font-semibold text-foreground text-center mb-6">Abgrenzung zu anderen Ansätzen</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">KI-Assistenten</p>
              <p className="text-foreground">Oria fragt, statt zu antworten</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Coaching-Apps</p>
              <p className="text-foreground">Oria verlangt kein Ziel</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Mental-Health</p>
              <p className="text-foreground">Oria pathologisiert nicht</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Journaling</p>
              <p className="text-foreground">Oria erkennt Muster</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Quantified Self</p>
              <p className="text-foreground">Oria misst nicht</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-muted-foreground mb-1">IFS-Tools</p>
              <p className="text-foreground">Oria ist alltagstauglicher</p>
            </div>
          </div>
        </div>

        {/* Core difference */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-muted-foreground bg-primary/5 rounded-xl px-6 py-4 border border-primary/10">
            <strong className="text-foreground">Der Kernunterschied:</strong><br />
            Andere Assistenten helfen dir, dein Leben zu managen.<br />
            <span className="text-primary font-medium">Oria hilft dir, in Beziehung mit deinem Leben zu bleiben.</span>
          </p>
        </div>
      </motion.section>

      {/* Target Partners */}
      <motion.section 
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-8 text-foreground">
          Für welche Partner Oria geeignet ist
        </h2>

        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {partners.map((partner, index) => (
              <span 
                key={index} 
                className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final Quote */}
      <motion.section 
        className="container mx-auto px-4 pb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="h-10 w-10 text-primary/30 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-serif text-foreground mb-4 leading-relaxed">
            "Oria macht Menschen bereit für Beziehung –<br />
            nicht für Optimierung."
          </blockquote>
          <p className="text-lg text-muted-foreground italic">
            "Oria ist der Raum vor dem Raum."
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Oria – Orientierung für Partner:innen & Coaches</p>
        </div>
      </footer>
    </div>
  );
};

export default OriaLandkarte;
