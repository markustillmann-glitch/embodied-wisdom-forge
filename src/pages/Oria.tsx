import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Moon, Ear, Compass, Heart, Sparkles } from "lucide-react";
import { PolygonalBackground, ConnectionLines } from "@/components/PolygonalBackground";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const qualities = [
  {
    icon: Eye,
    title: "Weisheit & innere Klarheit",
    description: "Oria erinnert dich an deinen inneren Kern – das Selbst, das ruhig, klar und mitfühlend führt.",
  },
  {
    icon: Moon,
    title: "Sehen im Dunkeln",
    description: "Wie die Eule hilft dir das Programm, auch das Unsichtbare in dir zu erkennen: alte Muster, Körpersignale, Bedürfnisse.",
  },
  {
    icon: Sparkles,
    title: "Achtsamkeit & stille Präsenz",
    description: "Eulen bewegen sich lautlos. Sie beobachten. Auch du lernst, innezuhalten und achtsam wahrzunehmen, was wirklich da ist.",
  },
  {
    icon: Heart,
    title: "Intuition & somatische Intelligenz",
    description: "Oria verkörpert die Weisheit des Körpers – jenes tiefe Wissen, das unterhalb des Denkens liegt und oft die klarsten Antworten gibt.",
  },
  {
    icon: Compass,
    title: "Transformation & Zyklen",
    description: "Eulen begleiten seit jeher Wandlungsphasen. Auch dieses Coachingjahr ist ein Übergang – hinein in ein Leben, das dir wieder entspricht.",
  },
];

const Oria = () => {
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
          <nav className="flex items-center gap-6">
            <Link 
              to="/seminare" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Seminare
            </Link>
            <p className="font-serif text-sm text-foreground hidden sm:block">Beyond Bias through memories</p>
          </nav>
        </div>
      </header>

      {/* Hero with Background Owl */}
      <section className="py-20 md:py-32 relative overflow-hidden min-h-[80vh] flex items-center">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        {/* Owl background image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.img
            src={bbOwlLogo}
            alt=""
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-[400px] md:w-[500px] lg:w-[600px] h-auto object-contain"
          />
        </div>
        
        <ConnectionLines className="top-20 right-10 w-32 h-32 opacity-60 hidden lg:block" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm font-sans tracking-[0.3em] text-muted-foreground uppercase mb-6"
          >
            Symbolfigur von Beyond Bias
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground leading-tight mb-6"
          >
            Das ist Oria
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-accent font-serif mb-8"
          >
            Deine stille Begleiterin auf dem Weg zu dir selbst
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed"
          >
            In der Tiefe der Nacht, wenn alles ruhig wird, öffnet sie ihre Augen:
            Oria, unsere Eule – Symbolfigur von Beyond Bias und Wegweiserin im Jahrescoaching.
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground/90 leading-relaxed">
              Sie steht für genau das, was Beyond Bias und das Jahresprogramm kultivieren: <strong className="text-foreground">Präsenz, innere Führung, Tiefe.</strong>
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Oria ist kein Maskottchen, sondern eine seelische Gefährtin – eine, die dich erinnert:
            </p>
            <div className="bg-quote-bg p-8 rounded-lg border-l-4 border-accent">
              <p className="text-xl font-serif italic text-foreground">
                „Du trägst bereits alles in dir."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warum eine Eule */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="section" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">
              Warum eine Eule?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Die Eule ist seit jeher ein Sinnbild für Weisheit. Sie sieht das, was anderen verborgen bleibt.
              Und sie verkörpert viele der Qualitäten, die im Coachingprogramm lebendig werden:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualities.map((quality, index) => {
              const Icon = quality.icon;
              return (
                <motion.div
                  key={quality.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-serif text-foreground mb-2">{quality.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{quality.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Name Section */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        
        {/* Subtle owl in background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 hidden lg:block">
          <img src={bbOwlLogo} alt="" className="w-[300px] h-auto" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Ear className="w-6 h-6 text-accent" />
              <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                Warum heißt sie Oria?
              </h2>
            </div>
            
            <p className="text-lg text-foreground/90 leading-relaxed">
              Der Name <strong className="text-accent">Oria</strong> vereint vieles:
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Er klingt sanft und klar. Er erinnert an <em>Ohr</em> (Zuhören), an <em>Orientierung</em> (Führung), 
              und an die innere <em>Ordnung</em>, die entsteht, wenn wir uns selbst wieder hören.
            </p>
            
            <div className="bg-quote-bg p-8 rounded-lg border-l-4 border-accent">
              <p className="text-xl font-serif italic text-foreground mb-2">
                Oria ist jene Stimme in dir, die sagt:
              </p>
              <p className="text-2xl font-serif text-accent">
                „Du musst nichts werden – nur erinnern, wer du bist."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Begleitung Section */}
      <section className="py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-serif text-foreground">
              Oria begleitet dich durch das ganze Jahr
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In Meditationen, als Symbol auf deinen Unterlagen, in Impulsen, wenn du Halt suchst.
              <br />
              Sie ist da, wenn du dich verlierst. Und wenn du dich findest.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-20 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed">
              „Wie still es wird, wenn du wirklich zuhörst – innen wie außen."
            </blockquote>
            <p className="text-accent font-serif text-lg">— Oria</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-chapter-divider">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground">
              Bereit, mit Oria auf die Reise zu gehen?
            </p>
            <Link 
              to="/seminare" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              Zu den Seminarangeboten
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-chapter-divider">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Beyond Bias through memories
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Oria;
