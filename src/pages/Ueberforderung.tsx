import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Brain, 
  Clock, 
  Target, 
  Scale, 
  Users, 
  Eye, 
  Home, 
  MessageCircle, 
  Heart, 
  Puzzle,
  ArrowLeft,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

const Ueberforderung = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const causes = [
    {
      number: 1,
      title: "Permanente Reiz- und Informationsüberflutung",
      icon: Brain,
      points: [
        "Dauerhafte Erreichbarkeit (Push-Nachrichten, E-Mails, Messenger)",
        "Gleichzeitigkeit von Informationen ohne natürliche Pausen",
        "Fehlende Verarbeitungszeit → kognitiver Dauerstress",
        "Gehirn bleibt im Alarm- und Sortiermodus"
      ],
      effect: "Mentale Erschöpfung, Entscheidungsfatigue, innere Unruhe",
      color: "from-red-500/20 to-orange-500/20"
    },
    {
      number: 2,
      title: "Beschleunigung & Zeitverdichtung",
      icon: Clock,
      points: [
        "Alles sofort: Antworten, Ergebnisse, Optimierung",
        "Verdichtung von Arbeit, Familie, Selbstentwicklung, Beziehung",
        "Weniger Übergänge, Rituale, Leerlauf"
      ],
      effect: "Gefühl, ständig hinterherzulaufen – selbst ohne objektive Überlastung",
      color: "from-orange-500/20 to-amber-500/20"
    },
    {
      number: 3,
      title: "Implizite Leistungs- und Optimierungsnorm",
      icon: Target,
      points: [
        "Nicht nur leisten, sondern: gesund sein, emotional reflektiert sein, erfüllte Beziehung führen, sinnvolle Arbeit machen",
        "Selbst Freizeit wird optimiert (Quality Time, Biohacking, Selbstverwirklichung)"
      ],
      effect: "Chronisches Nicht-genug-sein, selbst im Erfolg",
      color: "from-amber-500/20 to-yellow-500/20"
    },
    {
      number: 4,
      title: "Verantwortung ohne Kontrolle",
      icon: Scale,
      points: [
        "Hohe Eigenverantwortung (Karriere, Vorsorge, Bildung, Gesundheit)",
        "Gleichzeitig: globale Krisen, politische Ohnmacht, wirtschaftliche Unsicherheit"
      ],
      effect: "Erlernte Hilflosigkeit + Schuldgefühl: Ich bin verantwortlich – aber kann kaum etwas beeinflussen.",
      color: "from-yellow-500/20 to-lime-500/20"
    },
    {
      number: 5,
      title: "Erosion stabiler sozialer Strukturen",
      icon: Users,
      points: [
        "Weniger: Großfamilie, Nachbarschaft, langfristige Zugehörigkeiten",
        "Mehr: Mobilität, Patchwork-Beziehungen, fragmentierte soziale Rollen"
      ],
      effect: "Alles muss individuell organisiert und emotional getragen werden",
      color: "from-lime-500/20 to-green-500/20"
    },
    {
      number: 6,
      title: "Dauervergleich & soziale Sichtbarkeit",
      icon: Eye,
      points: [
        "Vergleich nicht mehr mit wenigen, sondern mit Hunderten",
        "Vergleich mit kuratierten Highlight-Versionen",
        "Unsichtbarkeit von Scheitern, Zweifel, Ambivalenz"
      ],
      effect: "Ständige Selbstabwertung bei objektiv stabilem Leben",
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      number: 7,
      title: "Verlust klarer Grenzen zwischen Lebensbereichen",
      icon: Home,
      points: [
        "Arbeit, Privatleben und Erholung verschwimmen",
        "Homeoffice ohne mentale Tür",
        "Emotionale Arbeit zieht in alle Lebensbereiche ein"
      ],
      effect: "Keine echte Regeneration → Daueranspannung",
      color: "from-teal-500/20 to-cyan-500/20"
    },
    {
      number: 8,
      title: "Unterdrückte Bedürfnisse & fehlende Bedürfnis-Sprache",
      icon: MessageCircle,
      points: [
        "Gefühle werden erkannt, Bedürfnisse aber nicht benannt",
        "Ich bin müde statt Ich brauche Schutz / Entlastung / Sinn",
        "Bedürfnisse gelten implizit als Schwäche"
      ],
      effect: "Dauerhafte innere Spannung ohne klare Lösungsrichtung",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    {
      number: 9,
      title: "Körper im Dauerstress – Geist soll funktionieren",
      icon: Heart,
      points: [
        "Chronisch erhöhtes Stressniveau (Cortisol)",
        "Wenig somatische Regulation (Atmung, Bewegung, Ruhe)",
        "Körper wird ignoriert, bis Symptome auftreten"
      ],
      effect: "Erschöpfung fühlt sich grundlos an, ist aber physiologisch real",
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      number: 10,
      title: "Sinn-Fragmentierung",
      icon: Puzzle,
      points: [
        "Kein gemeinsames Narrativ mehr (wofür das alles?)",
        "Arbeit, Familie, Konsum, Selbstentwicklung laufen nebeneinander",
        "Sinn muss individuell konstruiert werden"
      ],
      effect: "Tiefe Erschöpfung trotz äußerer Stabilität",
      color: "from-indigo-500/20 to-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Header />
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Ein Systemzustand, kein persönliches Versagen</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-foreground mb-6 leading-tight">
              Dauerhafte Überforderung<br />
              <span className="text-accent">hat viele Ursachen</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die folgenden zentralen Hauptgründe für das Gefühl der dauerhaften Überforderung 
              in der westlichen Welt sind weithin bekannt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeIn}
            className="bg-muted/30 border border-border rounded-2xl p-6 sm:p-8"
          >
            <p className="text-muted-foreground leading-relaxed text-center">
              Viele Menschen finden alleine nur sehr schwer Antworten und Handlungsmuster, 
              durch die sie sich aus der dauerhaften Überforderung befreien können.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Causes Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {causes.map((cause, index) => (
              <motion.div
                key={cause.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`bg-gradient-to-r ${cause.color} backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8`}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Number and Icon */}
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                    <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center shadow-sm">
                      <span className="text-xl font-serif font-bold text-foreground">{cause.number}</span>
                    </div>
                    <cause.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-serif font-medium text-foreground mb-4">
                      {cause.title}
                    </h3>
                    
                    <ul className="space-y-2 mb-4">
                      {cause.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-accent mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-background/60 rounded-lg p-4 border-l-4 border-accent">
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-accent">Effekt:</span> {cause.effect}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quintessence */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeIn}
            className="bg-accent/10 border border-accent/30 rounded-3xl p-8 sm:p-12 text-center"
          >
            <Lightbulb className="w-12 h-12 text-accent mx-auto mb-6" />
            
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-6">
              Verdichtete Quintessenz
            </h2>
            
            <p className="text-lg sm:text-xl text-foreground leading-relaxed max-w-2xl mx-auto">
              Die westliche Überforderung entsteht nicht durch zu wenig Kompetenz,
              sondern durch <span className="text-accent font-medium">zu viel Gleichzeitigkeit</span> ohne 
              innere Ordnung, Grenzen und Bedürfnis-Klarheit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              Ein Weg aus der Überforderung
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Oria bietet einen Rahmen, um Überforderung nicht zu bekämpfen, 
              sondern in verstehbare Muster und handhabbare Schritte zu übersetzen.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/oria-positionierung"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                <span>Wie Oria hilft</span>
                <span>→</span>
              </Link>
              <Link
                to="/oria"
                className="inline-flex items-center gap-2 text-foreground border border-border px-6 py-3 rounded-full hover:bg-muted/50 transition-colors"
              >
                <span>Oria kennenlernen</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Impressum & Datenschutz
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Ueberforderung;