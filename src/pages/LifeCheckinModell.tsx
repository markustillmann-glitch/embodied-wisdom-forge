import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Compass, Brain, Sparkles, Users, Sun, Home, TrendingUp, Star, User, Check, X } from "lucide-react";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const lifeAreas = [
  { icon: Heart, label: "Körper & Gesundheit", needs: "Vitalität, Schutz, Fürsorge" },
  { icon: Compass, label: "Arbeit & Wirksamkeit", needs: "Sinn, Beitrag, Anerkennung" },
  { icon: Home, label: "Geld & Sicherheit", needs: "Sicherheit, Stabilität, Freiheit" },
  { icon: Users, label: "Beziehungen – Nähe", needs: "Nähe, Vertrauen, Geborgenheit" },
  { icon: Users, label: "Beziehungen – Zugehörigkeit", needs: "Zugehörigkeit, Resonanz" },
  { icon: Sun, label: "Freude & Spiel", needs: "Spiel, Leichtigkeit, Genuss" },
  { icon: Home, label: "Umgebung & Halt", needs: "Ruhe, Halt, Ordnung" },
  { icon: TrendingUp, label: "Wachstum & Lernen", needs: "Lernen, Entwicklung" },
  { icon: Star, label: "Sinn & Spiritualität", needs: "Bedeutung, Hoffnung" },
  { icon: User, label: "Selbst & innere Balance", needs: "Authentizität, Selbstkontakt" },
];

const steps = [
  { title: "Sanfter Einstieg", description: "Welcher Bereich meldet sich heute zuerst? Du wählst frei – Oria folgt deiner Aufmerksamkeit." },
  { title: "Resonanz statt Bewertung", description: "Wie fühlt sich dieser Bereich an? Ruhig, angespannt, leer, lebendig, schwer, offen..." },
  { title: "Bedürfnis-Spiegel", description: "Oria übersetzt das Gefühl sanft in mögliche Bedürfnisse – ohne Diagnose, nur Einladung." },
  { title: "Körperanker", description: "Wo im Körper spürst du das gerade? Nur eine Stelle oder ein Eindruck." },
  { title: "Erinnerungs-Resonanz", description: "Kennst du dieses Gefühl aus einer anderen Zeit? Oria speichert Gefühl, Bedürfnis, Körpermarker." },
];

const LifeCheckinModell = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-28 sm:pb-16 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6"
          >
            <Link
              to="/oria-apps"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zu Oria Apps
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <img src={bbOwlLogo} alt="Oria" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
              Oria Life Check-in
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ein bedürfnis- und erinnerungsbasierter Selbstkontakt
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grundprinzip */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center"
          >
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-4">Oria-Grundprinzip</h2>
            <p className="text-lg text-muted-foreground italic mb-6">
              "Oria misst nicht, Oria spiegelt."
            </p>
            <p className="text-muted-foreground">
              Der Check-in dient nicht der Optimierung, sondern der Resonanz.<br/>
              <span className="text-foreground font-medium">"Wie geht es mir – und was will gerade gesehen werden?"</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 10 Lebensbereiche */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-4">
              Die 10 Oria-Lebensbereiche
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Vertraute Bereiche – bedürfnislogisch lesbar. Kein Bereich ist Pflicht – Oria erlaubt Überspringen.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {lifeAreas.map((area, index) => (
              <motion.div
                key={area.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 text-center hover:border-accent/50 transition-colors"
              >
                <area.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <h3 className="text-sm font-medium text-foreground mb-1">{area.label}</h3>
                <p className="text-xs text-muted-foreground">{area.needs}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Check-in Ablauf */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-4">
              Der Oria-Check-in-Ablauf
            </h2>
            <p className="text-muted-foreground">
              5–7 Minuten sanfter Selbstkontakt
            </p>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <span className="text-accent font-medium">{index + 1}</span>
                </div>
                <div className="flex-1 bg-card border border-border rounded-xl p-4">
                  <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Was Oria NICHT tut */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-4">
              Was Oria bewusst NICHT tut
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "keine Lebensbalance-Optimierung",
              "keine Ratschläge im Check-in",
              "kein du solltest",
              "keine Pathologisierung"
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-card border border-border rounded-lg p-4"
              >
                <X className="w-5 h-5 text-destructive shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6 text-foreground font-medium"
          >
            Oria endet mit Selbstkontakt, nicht mit To-dos.
          </motion.p>
        </div>
      </section>

      {/* Abschluss-Frage */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent/10 to-secondary/30 border border-accent/20 rounded-2xl p-6 sm:p-8"
          >
            <Brain className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-4">Die Abschluss-Frage</h2>
            <p className="text-lg text-foreground italic mb-4">
              "Was wäre jetzt eine kleine, freundliche Geste dir selbst gegenüber?"
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="bg-background/50 px-3 py-1 rounded-full">nichts tun</span>
              <span className="bg-background/50 px-3 py-1 rounded-full">etwas lassen</span>
              <span className="bg-background/50 px-3 py-1 rounded-full">etwas sagen</span>
              <span className="bg-background/50 px-3 py-1 rounded-full">aufschreiben</span>
              <span className="bg-background/50 px-3 py-1 rounded-full">jemandem schreiben</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Langzeit-Mehrwert */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-foreground mb-4">
              Langzeit-Mehrwert
            </h2>
            <p className="text-muted-foreground">
              Über Zeit erkennt Oria sanfte Muster – kein Score, sondern ein Erinnerungsprofil.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Wiederkehrende Bedürfnis-Cluster",
              "Typische Körpermarker",
              "Sensible Lebensbereiche",
              "Stärkende Erinnerungen"
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-card border border-border rounded-lg p-4"
              >
                <Check className="w-5 h-5 text-accent shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zitat & CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl font-serif text-foreground italic mb-10"
          >
            "Oria fragt nicht, wie dein Leben läuft –<br/>
            sondern wie dein Leben mit dir spricht."
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/life-checkin">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Life Check-in starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Oria. Ein Projekt von Markus Tillmann.</p>
          <Link to="/impressum" className="hover:text-accent transition-colors">Impressum</Link>
        </div>
      </footer>
    </div>
  );
};

export default LifeCheckinModell;
