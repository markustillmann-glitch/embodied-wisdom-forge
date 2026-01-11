import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Clock, Brain, Heart, Sparkles, Archive, Image, Gift, BarChart3, Repeat } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  duration?: string;
  options?: { label: string; duration: string; icon: React.ReactNode }[];
  icon: React.ReactNode;
  color: string;
  actions?: { label: string; href: string }[];
}

export const OriaProcessFlow = () => {
  const { language } = useLanguage();

  const quickEntries = language === 'de' ? [
    { label: "Akutes Anliegen", icon: <Heart className="w-4 h-4" />, href: "/oria-coach" },
    { label: "Beziehungserfahrung", icon: <Heart className="w-4 h-4" />, href: "/oria-relationships" },
    { label: "Entscheidung", icon: <Brain className="w-4 h-4" />, href: "/decision-helper" },
  ] : [
    { label: "Acute Concern", icon: <Heart className="w-4 h-4" />, href: "/oria-coach" },
    { label: "Relationship Experience", icon: <Heart className="w-4 h-4" />, href: "/oria-relationships" },
    { label: "Decision", icon: <Brain className="w-4 h-4" />, href: "/decision-helper" },
  ];

  const systematicEntries = language === 'de' ? [
    { label: "Muster verstehen", icon: <BarChart3 className="w-4 h-4" />, href: "/daily-checkin" },
    { label: "Körper-Erschöpfungszustand", icon: <Brain className="w-4 h-4" />, href: "/body-exhaustion" },
    { label: "Lebensrad-Landkarte", icon: <Sparkles className="w-4 h-4" />, href: "/life-checkin" },
  ] : [
    { label: "Understand Patterns", icon: <BarChart3 className="w-4 h-4" />, href: "/daily-checkin" },
    { label: "Body-Exhaustion State", icon: <Brain className="w-4 h-4" />, href: "/body-exhaustion" },
    { label: "Life Wheel Map", icon: <Sparkles className="w-4 h-4" />, href: "/life-checkin" },
  ];

  return (
    <div className="my-8 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Entry Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="bg-accent/10 rounded-xl p-5 border border-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {language === 'de' ? 'Einstieg wählen' : 'Choose Entry Point'}
                </h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {language === 'de' ? '5-10 Minuten' : '5-10 minutes'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Quick Entry */}
              <div className="bg-background/60 rounded-lg p-4 border border-border">
                <p className="font-semibold text-sm text-foreground mb-3">
                  {language === 'de' ? 'Schneller Einstieg' : 'Quick Entry'}
                </p>
                <div className="space-y-2">
                  {quickEntries.map((entry, i) => (
                    <Link key={i} to={entry.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                      <span className="text-accent">{entry.icon}</span>
                      {entry.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Systematic Entry */}
              <div className="bg-background/60 rounded-lg p-4 border border-border">
                <p className="font-semibold text-sm text-foreground mb-3">
                  {language === 'de' ? 'Systematischer Einstieg' : 'Systematic Entry'}
                </p>
                <div className="space-y-2">
                  {systematicEntries.map((entry, i) => (
                    <Link key={i} to={entry.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                      <span className="text-accent">{entry.icon}</span>
                      {entry.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Arrow to Step 2 */}
          <div className="flex justify-center py-3">
            <ArrowDown className="w-5 h-5 text-accent" />
          </div>
        </motion.div>

        {/* Step 2: Deepening */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-secondary/50 rounded-xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {language === 'de' ? 'Vertiefung in Oria' : 'Deepening in Oria'}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {language === 'de' ? 'Optional nach Schritt 1' : 'Optional after Step 1'}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-background/60 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-sm text-foreground">
                    {language === 'de' ? 'Kompakt' : 'Compact'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? '15-20 Minuten' : '15-20 minutes'}
                </p>
              </div>
              <div className="bg-background/60 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-sm text-foreground">
                    {language === 'de' ? 'Detailliert' : 'Detailed'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? '30-45 Minuten' : '30-45 minutes'}
                </p>
              </div>
            </div>
          </div>

          {/* Side note: Save anytime */}
          <div className="absolute -right-2 top-1/2 transform translate-x-full -translate-y-1/2 hidden lg:flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border max-w-[180px]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Archive className="w-3 h-3 text-accent flex-shrink-0" />
                <span>
                  {language === 'de' 
                    ? 'Jederzeit im Erinnerungstresor speichern' 
                    : 'Save to Memory Vault anytime'}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile save note */}
          <div className="lg:hidden mt-3 flex items-center justify-center gap-2">
            <Archive className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">
              {language === 'de' 
                ? 'Jederzeit im Erinnerungstresor speichern' 
                : 'Save to Memory Vault anytime'}
            </span>
          </div>

          {/* Arrow to Step 3 */}
          <div className="flex justify-center py-3">
            <ArrowDown className="w-5 h-5 text-accent" />
          </div>
        </motion.div>

        {/* Step 3: Memory Creation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-accent/10 rounded-xl p-5 border border-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {language === 'de' ? 'Erinnerungen gestalten' : 'Create Memories'}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {language === 'de' ? 'Aus dem Erinnerungstresor' : 'From Memory Vault'}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-background/60 rounded-lg p-3 border border-border flex items-start gap-3">
                <Image className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {language === 'de' ? 'Hochwertige Erinnerungen' : 'High-Quality Memories'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'de' ? 'Graphisch generiert' : 'Graphically generated'}
                  </p>
                </div>
              </div>
              <div className="bg-background/60 rounded-lg p-3 border border-border flex items-start gap-3">
                <Gift className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {language === 'de' ? 'Verschenken oder speichern' : 'Gift or Save'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'de' ? 'Memory Lane aufbauen' : 'Build your Memory Lane'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow to continuous features */}
          <div className="flex justify-center py-3">
            <ArrowDown className="w-5 h-5 text-accent" />
          </div>
        </motion.div>

        {/* Continuous Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="bg-muted/40 rounded-xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Repeat className="w-5 h-5 text-accent" />
              <h3 className="font-serif text-lg font-medium text-foreground">
                {language === 'de' ? 'Fortlaufend verfügbar' : 'Continuously Available'}
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-background/60 rounded-lg p-3 border border-border text-center">
                <Sparkles className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  {language === 'de' ? 'Wiedererleben' : 'Relive'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'de' ? 'Jederzeit abrufbar' : 'Available anytime'}
                </p>
              </div>
              <div className="bg-background/60 rounded-lg p-3 border border-border text-center">
                <BarChart3 className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  {language === 'de' ? 'Muster analysieren' : 'Analyze Patterns'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'de' ? 'Bei genügend Erinnerungen' : 'With enough memories'}
                </p>
              </div>
              <div className="bg-background/60 rounded-lg p-3 border border-border text-center">
                <Brain className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  {language === 'de' ? 'Psychogramm' : 'Psychogram'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'de' ? 'Tiefere Selbsterkenntnis' : 'Deeper self-insight'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            to="/oria-coach"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors"
          >
            <span>{language === 'de' ? 'Jetzt mit Oria starten' : 'Start with Oria now'}</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
