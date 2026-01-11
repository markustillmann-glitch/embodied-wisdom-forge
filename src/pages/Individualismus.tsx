import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ArrowLeft,
  BookOpen,
  Church,
  Lightbulb,
  Factory,
  CheckCircle2,
  XCircle,
  Heart,
  Users,
  Shield,
  Compass,
  Scale,
  ArrowRight,
  Sparkles
} from "lucide-react";

const Individualismus = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const historicalPhases = [
    {
      number: "1.1",
      title: "Antike Wurzeln: Das autonome Selbst",
      icon: BookOpen,
      content: "Bereits in der griechischen Antike taucht die Idee auf, dass der Mensch:",
      points: [
        "vernunftbegabt",
        "selbstverantwortlich",
        "moralisch urteilsfähig"
      ],
      note: "ist (z. B. bei Sokrates, Platon, Aristoteles).",
      insight: "Der Einzelne wird als Träger von Einsicht und Verantwortung verstanden – nicht nur als Teil eines Kollektivs.",
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      number: "1.2",
      title: "Christentum & Gewissen",
      icon: Church,
      content: "Mit dem Christentum entsteht eine neue Achse:",
      points: [
        "persönliche Beziehung zu Gott",
        "individuelles Gewissen",
        "persönliche Schuld und Erlösung"
      ],
      note: "Spätestens mit der Reformation (z. B. Martin Luther) wird das innere Gewissen wichtiger als äußere Autorität.",
      insight: "Das Selbst wird innerlich, nicht nur sozial definiert.",
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      number: "1.3",
      title: "Aufklärung: Das denkende Ich",
      icon: Lightbulb,
      content: "Die Aufklärung radikalisiert den Individualismus:",
      points: [
        'Rene Descartes: "Ich denke, also bin ich"',
        "Immanuel Kant: Autonomie, Selbstgesetzgebung, Würde des Individuums"
      ],
      insight: "Der Mensch wird zum Maßstab seiner Moral, nicht Tradition oder Gott.",
      color: "from-yellow-500/20 to-amber-500/20"
    },
    {
      number: "1.4",
      title: "Moderne & Kapitalismus: Der performative Mensch",
      icon: Factory,
      content: "Industrialisierung und Kapitalismus verstärken:",
      points: [
        "Mobilität statt Dorfgemeinschaft",
        "Leistung statt Zugehörigkeit",
        "Selbstoptimierung statt Rollenbindung"
      ],
      insight: "Identität wird gemacht, nicht geerbt.",
      color: "from-slate-500/20 to-zinc-500/20"
    }
  ];

  const strengths = [
    {
      title: "Bedürfnisse werden sichtbar",
      points: [
        "Eigene Gefühle zählen",
        "Eigene Grenzen dürfen existieren",
        '"Ich brauche ..." ist legitim'
      ],
      insight: "Bedürfnisse wie Autonomie, Selbstwirksamkeit, Authentizität werden erstmals explizit benannt."
    },
    {
      title: "Wahlfreiheit & Passung",
      points: [
        "Beziehungen, Jobs, Lebensentwürfe sind wählbar",
        "Bedürfnisse müssen nicht in ein fixes Rollensystem passen"
      ],
      insight: "Hohe Chance auf individuelle Passung."
    }
  ];

  const shadows = [
    {
      title: "Überforderung durch Verantwortung",
      quote: "Wenn alles möglich ist, ist auch alles meine Schuld.",
      points: [
        "Scheitern wird personalisiert",
        'Bedürfnisse werden zu Leistungszielen ("Ich sollte erfüllt sein")'
      ],
      insight: "Grundbedürfnisse nach Sicherheit, Entlastung, Getragen-sein bleiben oft unversorgt."
    },
    {
      title: "Entkoppelung von Beziehung",
      description: "In stark individualistischen Kulturen:",
      points: [
        'Nähe muss "verdient" oder ausgehandelt werden',
        "Abhängigkeit gilt als Schwäche"
      ],
      insight: "Bedürfnisse nach Bindung, Zugehörigkeit, Resonanz werden chronisch unterernährt."
    },
    {
      title: "Konsum ersetzt echte Bedürfnisarbeit",
      description: "Der Markt bietet schnelle Surrogate:",
      points: [
        "Anerkennung → Likes",
        "Sinn → Status",
        "Ruhe → Entertainment"
      ],
      insight: "Bedürfnisse werden bedient, aber nicht genährt."
    }
  ];

  const tensions = [
    { level: "Identität", gain: "Freiheit", loss: "Halt" },
    { level: "Autonomie", gain: "Selbstbestimmung", loss: "Einsamkeit" },
    { level: "Selbstverantwortung", gain: "Würde", loss: "Überlastung" },
    { level: "Bedürfnisartikulation", gain: "Klarheit", loss: "Anspruchsdenken" }
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
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <Compass className="w-4 h-4" />
              <span className="text-sm font-medium">Historische Perspektive</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-foreground mb-6 leading-tight">
              Der westliche Individualismus<br />
              <span className="text-accent">und seine Folgen für Bedürfnisse</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Der Individualismus der westlichen Welt ist kein Zufall und kein einzelnes Ereignis, 
              sondern das Ergebnis mehrerer historischer, philosophischer und ökonomischer Entwicklungslinien.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeIn}
            className="bg-muted/30 border border-border rounded-2xl p-6 sm:p-8 text-center"
          >
            <p className="text-muted-foreground leading-relaxed">
              Er prägt tief, wie wir Bedürfnisse wahrnehmen, formulieren – und wie gut sie erfüllt werden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Historical Origins */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              1. Woher kommt der westliche Individualismus?
            </h2>
          </motion.div>
          
          <div className="space-y-6">
            {historicalPhases.map((phase, index) => (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-r ${phase.color} backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8`}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                    <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center shadow-sm">
                      <phase.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{phase.number}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-serif font-medium text-foreground mb-4">
                      {phase.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-3">{phase.content}</p>
                    
                    <ul className="space-y-1 mb-3">
                      {phase.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-accent mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {phase.note && (
                      <p className="text-muted-foreground text-sm mb-3">{phase.note}</p>
                    )}
                    
                    <div className="bg-background/60 rounded-lg p-4 border-l-4 border-accent">
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-accent">→</span> {phase.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ambivalence Intro */}
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              2. Was bedeutet Individualismus für Bedürfnis-Zufriedenheit?
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Hier wird es ambivalent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              3. Die Stärken des Individualismus für Bedürfnisse
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {strengths.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-accent/5 border border-accent/20 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-serif font-medium text-foreground">
                    3.{index + 1} {item.title}
                  </h3>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-background/60 rounded-lg p-3 border-l-4 border-accent">
                  <p className="text-sm text-foreground">
                    <span className="text-accent">→</span> {item.insight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              4. Die Schattenseiten für Bedürfnis-Zufriedenheit
            </h2>
          </motion.div>
          
          <div className="space-y-6">
            {shadows.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-destructive/70" />
                  <h3 className="text-xl font-serif font-medium text-foreground">
                    4.{index + 1} {item.title}
                  </h3>
                </div>
                
                {item.quote && (
                  <div className="bg-background/60 rounded-lg p-4 mb-4 italic text-foreground">
                    "{item.quote}"
                  </div>
                )}
                
                {item.description && (
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                )}
                
                <ul className="space-y-2 mb-4">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-destructive/70 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-background/60 rounded-lg p-3 border-l-4 border-destructive/50">
                  <p className="text-sm text-foreground">
                    <span className="text-destructive/70">→</span> {item.insight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tension Table */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              5. Der zentrale Spannungsbogen
            </h2>
          </motion.div>
          
          <motion.div 
            {...fadeIn}
            className="bg-card/60 border border-border rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-muted/50 p-4 font-medium text-foreground">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-accent" />
                <span>Ebene</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="w-4 h-4" />
                <span>Gewinn</span>
              </div>
              <div className="flex items-center gap-2 text-destructive/70">
                <XCircle className="w-4 h-4" />
                <span>Verlust</span>
              </div>
            </div>
            
            {tensions.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 p-4 border-t border-border"
              >
                <div className="text-foreground font-medium">{row.level}</div>
                <div className="text-accent">{row.gain}</div>
                <div className="text-muted-foreground">{row.loss}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final Thoughts */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              6. Ein wichtiger Gedanke zum Schluss
            </h2>
          </motion.div>
          
          <motion.div 
            {...fadeIn}
            className="space-y-8"
          >
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">Der westliche Individualismus hat uns gelehrt:</p>
              <p className="text-2xl sm:text-3xl font-serif text-foreground italic mb-2">
                "Du darfst Bedürfnisse haben."
              </p>
            </div>
            
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">Aber er hat uns oft nicht gelehrt:</p>
              <p className="text-2xl sm:text-3xl font-serif text-foreground italic mb-2">
                "Du musst sie nicht alleine tragen."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Relational Individualism */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeIn}
            className="bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 border border-accent/30 rounded-3xl p-8 sm:p-12 text-center"
          >
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
            
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-6">
              Die Zukunft: Relationaler Individualismus
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Die Zukunft liegt weniger im Zurück zum Kollektiv, 
              sondern im <span className="text-accent font-medium">Weiter zum relationalen Individualismus</span>:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="bg-background/60 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 justify-center text-foreground">
                  <Heart className="w-5 h-5 text-accent" />
                  <span>Ich bin autonom</span>
                  <span className="text-accent font-bold">und</span>
                  <span>verbunden</span>
                </div>
              </div>
              <div className="bg-background/60 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 justify-center text-foreground">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="text-sm">Ich kenne meine Bedürfnisse und lasse mich darin halten</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
              Wie Oria diesen Weg unterstützt
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Oria verbindet Selbstkenntnis mit Beziehungsfähigkeit – 
              nicht Entweder-oder, sondern Sowohl-als-auch.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/oria-modell"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                <span>Das Oria-Modell</span>
                <ArrowRight className="w-4 h-4" />
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

export default Individualismus;