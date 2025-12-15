import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Seminare = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-chapter-divider">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zum Kompendium</span>
          </Link>
          <p className="font-serif text-sm text-foreground hidden sm:block">Beyond Bias through memories</p>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm font-sans tracking-[0.3em] text-muted-foreground uppercase mb-6"
          >
            Seminarangebot
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground leading-tight mb-6"
          >
            Integrierte Selbstwahrnehmung
            <br />
            <span className="text-accent">&amp; Selbstführung</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed"
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
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            {...fadeInUp}
            className="text-2xl md:text-3xl font-serif text-foreground text-center mb-12"
          >
            Unsere Formate
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
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

      {/* Methodik */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            {...fadeInUp}
            className="text-2xl md:text-3xl font-serif text-foreground text-center mb-12"
          >
            Die vier Säulen des Programms
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-6">
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              Bereit für den ersten Schritt?
            </h2>
            <p className="text-muted-foreground mb-8">
              Beginnen Sie mit einem unverbindlichen Schnupperabend und erleben Sie, 
              wie dieser integrative Ansatz funktioniert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-sans">
                Zum Schnupperabend anmelden
              </Button>
              <Button variant="outline" size="lg" className="font-sans">
                Kontakt aufnehmen
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-chapter-divider">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to="/" className="font-serif text-xl text-foreground hover:text-accent transition-colors">
            Beyond Bias through memories
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            Ein Handlungsmodell zum Umgang mit Stress, Bias und Prägungen
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Seminare;
