import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import markusTillmann from "@/assets/markus-tillmann.jpg";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Zur Startseite</span>
            <span className="xs:hidden">Zurück</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link 
              to="/seminare" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Seminare
            </Link>
            <Link 
              to="/oria" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Oria
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <PolygonalBackground variant="subtle" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-foreground mb-4"
          >
            Impressum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-muted-foreground"
          >
            Beyond Bias through memories
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            
            {/* Gründer Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl border border-border p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img 
                  src={markusTillmann} 
                  alt="Markus Tillmann - Gründer" 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-accent/20"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-2">
                    Markus Tillmann
                  </h2>
                  <p className="text-accent font-medium mb-4">Gründer & Entwickler</p>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Als Vater von drei Töchtern habe ich erfahren, wie tief unbewusste Vorurteile und 
                    Prägungen unser Leben beeinflussen. Mit <em>Beyond Bias through memories</em> verbinde ich 
                    diese Erkenntnis mit moderner Neurobiologie, somatischer Intelligenz und bewährten 
                    Methoden wie IFS und Gewaltfreier Kommunikation – für einen nachhaltigen Weg zu 
                    mehr Selbstwahrnehmung und innerer Führung.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Kontaktdaten */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                Angaben gemäß § 5 TMG
              </h2>
              
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Verantwortlich für den Inhalt</h3>
                  <p className="text-muted-foreground">Beyond Bias gUG (haftungsbeschränkt)</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div className="text-muted-foreground">
                    <p>Markus Tillmann</p>
                    <p>Deutschland</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <a 
                    href="mailto:info@beyond-bias.net" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    info@beyond-bias.net
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Rechtliche Hinweise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                Haftungsausschluss
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Haftung für Inhalte</h3>
                  <p>
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die 
                    Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch 
                    keine Gewähr übernehmen.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Haftung für Links</h3>
                  <p>
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte 
                    wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch 
                    keine Gewähr übernehmen.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-2">Urheberrecht</h3>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                    unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                    Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                    bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Beyond Bias Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-quote-bg p-6 sm:p-8 rounded-xl border-l-4 border-accent"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={bbOwlLogo} alt="Oria" className="h-8 w-auto" />
                <h3 className="font-serif text-lg text-foreground">Beyond Bias through memories</h3>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Ein Handlungsmodell zum Umgang mit Stress, Bias und Prägungen. Das Konzept verbindet 
                moderne Neurobiologie und Epigenetik mit praktischer Selbstführungskompetenz – 
                basierend auf Meditation, IFS (Internal Family Systems) und Gewaltfreier Kommunikation.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-chapter-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Beyond Bias gUG. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Impressum;
