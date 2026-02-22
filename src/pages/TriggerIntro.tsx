import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Heart, Shield, Flame, Wind, Eye, Activity, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const Section: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.section>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; number: string; title: string }> = ({ icon, number, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <h2 className="text-xl font-serif font-semibold text-foreground">
      <span className="text-accent">{number}</span> {title}
    </h2>
  </div>
);

const QuoteBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-accent/10 border-l-4 border-accent rounded-r-xl p-4 my-4">
    <p className="text-foreground font-medium italic font-serif">{children}</p>
  </div>
);

const TriggerIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      {/* Header */}
      <div className="relative z-10">
        <AppHeader />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)] space-y-6 sm:space-y-8">
        {/* Hero */}
        <motion.div {...fadeIn} className="text-center space-y-5 py-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-amber-800" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground leading-tight">
            Kennst du das? Du reagierst<br />stärker, als die Situation es verdient.
          </h1>
          <div className="text-muted-foreground max-w-lg mx-auto leading-relaxed space-y-3">
            <p>
              Jemand sagt etwas Beiläufiges – und in dir zieht sich alles zusammen. 
              Dein Herz schlägt schneller, dein Kopf rattert, du willst dich verteidigen oder am liebsten verschwinden.
            </p>
            <p>
              Das sind <strong className="text-foreground">Trigger</strong> – und sie sind kein Zeichen von Schwäche. 
              Der Ansatz der <strong className="text-foreground">Inneren Familiensysteme (IFS)</strong> zeigt: 
              In solchen Momenten meldet sich ein innerer Anteil, der gehört werden möchte – 
              ein altes Gefühl, eine vergessene Erfahrung, ein Schutzmechanismus.
            </p>
            <p>
              Wer seine Trigger versteht, reagiert nicht mehr automatisch – sondern gewinnt die Freiheit, 
              bewusst zu antworten. Dafür braucht es keine Therapie: IFS ist ein Werkzeug für den Alltag, 
              das dir hilft, dich selbst besser zu verstehen – ob in Beziehungen, im Job oder im Umgang mit dir selbst.
            </p>
          </div>
        </motion.div>

        {/* IFS Einordnung */}
        <Section>
          <div className="bg-secondary/80 rounded-2xl p-5 border border-border/40 space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" /> Kurz erklärt: Was ist IFS?
            </p>
            <p className="text-foreground/85 leading-relaxed">
              IFS (<em>Internal Family Systems</em>) ist ein wissenschaftlich fundierter Therapieansatz, 
              der davon ausgeht, dass wir alle verschiedene innere Anteile in uns tragen – z.B. einen 
              inneren Kritiker, ein verletztes Kind oder einen Beschützer. Trigger aktivieren genau 
              diese Anteile. Wenn du verstehst, <strong>welcher Teil</strong> von dir gerade reagiert, 
              kannst du mitfühlender mit dir umgehen – und bewusster handeln.
            </p>
          </div>
        </Section>

        {/* 1. Was ist ein Trigger */}
        <Section>
          <SectionTitle icon={<Brain className="w-5 h-5 text-accent" />} number="1." title="Was ist ein Trigger im IFS?" />
          <div className="space-y-3 text-foreground/90">
            <p>Ein Trigger entsteht, wenn eine Situation:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">•</span>
                <span>eine alte Verletzung berührt <span className="text-muted-foreground">(Exile)</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">•</span>
                <span>Schutzanteile alarmiert <span className="text-muted-foreground">(Manager / Firefighter)</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">•</span>
                <span>ein zentrales Bedürfnis berührt <span className="text-muted-foreground">(z.B. Zugehörigkeit, Sicherheit, Wertschätzung)</span></span>
              </li>
            </ul>

            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Alltagsbeispiel</p>
              <p className="italic font-serif">Sachliche Kritik fühlt sich an wie „Ich genüge nicht."</p>
              <p className="text-muted-foreground text-sm mt-1">→ Ein jüngerer Anteil wird aktiviert, der Kritik mit Ablehnung verknüpft hat.</p>
            </div>

            <QuoteBox>Wenn deine Reaktion größer ist als die Situation – ist ein Anteil aktiv.</QuoteBox>
          </div>
        </Section>

        {/* 2. Wie erkennt man Trigger */}
        <Section delay={0.05}>
          <SectionTitle icon={<Eye className="w-5 h-5 text-accent" />} number="2." title="Wie erkennt man Trigger?" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40 space-y-2">
              <p className="font-semibold text-sm flex items-center gap-2">🧠 Emotionale Hinweise</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Starke Wut oder Kränkung</li>
                <li>• Scham</li>
                <li>• Rückzug</li>
                <li>• Panik</li>
                <li>• Rechtfertigungsdrang</li>
              </ul>
            </div>
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40 space-y-2">
              <p className="font-semibold text-sm flex items-center gap-2">⚡ Körperliche Hinweise</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Enge in Brust oder Hals</li>
                <li>• Druck im Bauch</li>
                <li>• Hitze oder Zittern</li>
                <li>• Erstarrung</li>
              </ul>
            </div>
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40 space-y-2">
              <p className="font-semibold text-sm flex items-center gap-2">🔄 Verhaltensmuster</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Sofort verteidigen</li>
                <li>• Angreifen</li>
                <li>• Sich erklären müssen</li>
                <li>• People Pleasing</li>
                <li>• Innerer Kritiker wird laut</li>
              </ul>
            </div>
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40 space-y-2">
              <p className="font-semibold text-sm flex items-center gap-2">🧩 Gedankenschleifen</p>
              <ul className="text-sm text-foreground/80 space-y-1 italic font-serif">
                <li>„Immer passiert mir das."</li>
                <li>„Ich werde nicht respektiert."</li>
                <li>„Ich mache alles falsch."</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 3. Die IFS-Anteile hinter Triggern */}
        <Section delay={0.05}>
          <SectionTitle icon={<Heart className="w-5 h-5 text-accent" />} number="3." title="Die IFS-Anteile hinter Triggern" />
          <div className="space-y-3">
            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/40">
              <p className="font-semibold flex items-center gap-2 mb-2">🌱 Exiles</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Tragen alte Verletzungen</li>
                <li>• Fühlen sich oft jünger an</li>
                <li>• Halten Angst, Scham oder Trauer</li>
              </ul>
            </div>
            <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200/40">
              <p className="font-semibold flex items-center gap-2 mb-2">🛡 Manager</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Kontrollieren, planen, perfektionieren</li>
                <li>• Wollen Schmerz verhindern</li>
              </ul>
            </div>
            <div className="bg-orange-50/80 rounded-2xl p-4 border border-orange-200/40">
              <p className="font-semibold flex items-center gap-2 mb-2">🔥 Firefighter</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Reagieren impulsiv</li>
                <li>• Betäuben (Ablenkung, Essen, Scrollen)</li>
                <li>• Eskalieren (Wut, Rückzug, Überreaktion)</li>
              </ul>
            </div>
            <QuoteBox>Oft wird zuerst ein Exile berührt – dann springen Schutzanteile ein.</QuoteBox>
          </div>
        </Section>

        {/* 4. ALI */}
        <Section delay={0.05}>
          <SectionTitle icon={<Wind className="w-5 h-5 text-accent" />} number="4." title="ALI – Die Soforthilfe bei Triggern" />
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0 text-2xl font-bold text-sky-700">A</div>
              <div>
                <p className="font-semibold">Atmen</p>
                <p className="text-sm text-foreground/80 mt-1">Langsam 3–5 tiefe Atemzüge. Der Atem reguliert das Nervensystem. → Sympathikus beruhigt sich.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-2xl font-bold text-amber-700">L</div>
              <div>
                <p className="font-semibold">Lächeln</p>
                <p className="text-sm text-foreground/80 mt-1">Ein sanftes, inneres Lächeln. Nicht ironisch. Sondern wie: <em className="font-serif">„Ah, ein Teil von mir ist gerade aktiv."</em></p>
                <p className="text-sm text-muted-foreground mt-1">Das Lächeln aktiviert Selbstmitgefühl und schafft Abstand.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-2xl font-bold text-emerald-700">I</div>
              <div>
                <p className="font-semibold">Innehalten</p>
                <p className="text-sm text-foreground/80 mt-1">Nicht sofort reagieren. Kurz innerlich fragen:</p>
                <ul className="text-sm text-foreground/80 mt-1 space-y-0.5 italic font-serif">
                  <li>Wer ist da gerade?</li>
                  <li>Was fühlt dieser Teil?</li>
                  <li>Was braucht er?</li>
                </ul>
              </div>
            </div>
            <QuoteBox>ALI verhindert, dass ein Schutzanteil automatisch übernimmt.</QuoteBox>
          </div>
        </Section>

        {/* 5. Wie man aus Triggern lernt */}
        <Section delay={0.05}>
          <SectionTitle icon={<Lightbulb className="w-5 h-5 text-accent" />} number="5." title="Wie man aus Triggern lernt" />
          <p className="text-foreground/90 mb-4">Trigger sind Einladungen zur Selbstführung. Nach ALI kannst du fragen:</p>
          <div className="space-y-3">
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <p className="font-semibold text-sm">🧭 1. Welcher Anteil ist aktiv?</p>
              <p className="text-sm text-foreground/80 mt-1">Wie alt fühlt er sich? Welche Emotion trägt er?</p>
            </div>
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <p className="font-semibold text-sm">❤️ 2. Welches Bedürfnis ist berührt?</p>
              <p className="text-sm text-foreground/80 mt-1">z.B. nach Zugehörigkeit, Sicherheit, Autonomie</p>
            </div>
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <p className="font-semibold text-sm">🛡 3. Wovor will mich dieser Teil schützen?</p>
            </div>
            <div className="bg-secondary/80 rounded-2xl p-4 border border-border/40">
              <p className="font-semibold text-sm">🌿 4. Was bräuchte dieser Teil jetzt?</p>
              <p className="text-sm text-foreground/80 mt-1">Verständnis? Sicherheit? Bestätigung? Klarheit?</p>
            </div>
          </div>
        </Section>

        {/* 6. Reagieren vs Führen */}
        <Section delay={0.05}>
          <SectionTitle icon={<RefreshCw className="w-5 h-5 text-accent" />} number="6." title="Reagieren vs. Selbstführung" />
          <div className="overflow-hidden rounded-2xl border border-border/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-accent/10">
                  <th className="text-left p-3 font-semibold">Reaktion (getriggert)</th>
                  <th className="text-left p-3 font-semibold">Selbstführung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="bg-secondary/40">
                  <td className="p-3 text-foreground/80">„Du respektierst mich nie!"</td>
                  <td className="p-3 text-foreground/80">„Ein Teil von mir fühlt sich übergangen."</td>
                </tr>
                <tr className="bg-secondary/20">
                  <td className="p-3 text-foreground/80">Rückzug</td>
                  <td className="p-3 text-foreground/80">Klärendes Gespräch</td>
                </tr>
                <tr className="bg-secondary/40">
                  <td className="p-3 text-foreground/80">Angriff</td>
                  <td className="p-3 text-foreground/80">Neugier</td>
                </tr>
                <tr className="bg-secondary/20">
                  <td className="p-3 text-foreground/80">Scham</td>
                  <td className="p-3 text-foreground/80">Mitgefühl</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            IFS spricht hier von den Qualitäten des <strong>Self</strong>: Ruhe, Neugier, Mitgefühl, Klarheit, Verbundenheit, Mut.
            Wenn diese Qualitäten spürbar sind, führst du – nicht dein Trigger.
          </p>
        </Section>

        {/* 7. Langfristiger Umgang */}
        <Section delay={0.05}>
          <SectionTitle icon={<Shield className="w-5 h-5 text-accent" />} number="7." title="Langfristiger Umgang mit Triggern" />
          <p className="text-foreground/90 mb-3">Trigger verlieren Intensität, wenn:</p>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> verletzte Anteile gehört werden</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> alte Überzeugungen überprüft werden</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> neue korrigierende Erfahrungen gemacht werden</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> Schutzanteile entlastet werden</li>
          </ul>
          <QuoteBox>Kein Anteil ist schlecht – nur überlastet.</QuoteBox>
        </Section>

        {/* 8. Kurzformel */}
        <Section delay={0.05}>
          <SectionTitle icon={<Sparkles className="w-5 h-5 text-accent" />} number="8." title="Kurzformel" />
          <div className="space-y-3">
            <div className="bg-accent/10 rounded-2xl p-5 text-center border border-accent/20">
              <p className="font-serif text-lg font-semibold text-foreground">
                Trigger = Aktivierter Anteil + Berührtes Bedürfnis + Alte Geschichte
              </p>
            </div>
            <div className="bg-accent/15 rounded-2xl p-5 text-center border border-accent/30">
              <p className="font-serif text-lg font-semibold text-accent">
                Trigger + ALI = Zugang zum Selbst
              </p>
            </div>
          </div>
        </Section>

        {/* CTA to Trigger Cards */}
        <Section delay={0.05}>
          <div className="text-center space-y-4 py-4">
            <h2 className="text-xl font-serif font-semibold text-foreground">
              Bereit, deine Trigger zu erkunden?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Entdecke 200 Trigger-Karten in 10 Lebensbereichen und finde Wege zur Selbstregulation.
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/trigger-cards')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold shadow-md"
            >
              Trigger-Karten entdecken
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </Section>

        {/* Alltagsbeispiele */}
        <Section delay={0.05}>
          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/40 space-y-4">
            <h3 className="font-serif font-semibold text-foreground">💡 Weitere Alltagsbeispiele</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Dein Partner schaut aufs Handy, während du erzählst.</p>
                <p className="text-muted-foreground">→ Anteil: „Ich bin nicht wichtig genug." Bedürfnis: Aufmerksamkeit, Wertschätzung.</p>
              </div>
              <div>
                <p className="font-medium">Ein Kollege bekommt Lob für eine Idee, die du hattest.</p>
                <p className="text-muted-foreground">→ Anteil: „Ich werde übersehen." Bedürfnis: Anerkennung, Gerechtigkeit.</p>
              </div>
              <div>
                <p className="font-medium">Deine Mutter fragt: „Wann besuchst du uns endlich mal?"</p>
                <p className="text-muted-foreground">→ Anteil: „Ich bin schuldig." Bedürfnis: Autonomie, ohne Schuld geliebt werden.</p>
              </div>
              <div>
                <p className="font-medium">Du machst einen Fehler und denkst sofort: „Typisch ich."</p>
                <p className="text-muted-foreground">→ Anteil: Innerer Kritiker. Bedürfnis: Selbstakzeptanz, Güte.</p>
              </div>
            </div>
            <p className="text-sm text-foreground/70 italic">
              <strong>Das Änderungspotenzial:</strong> Wenn du den Anteil erkennst, der reagiert, kannst du bewusst antworten statt automatisch zu reagieren. Du gewinnst Wahlfreiheit – das ist Selbstführung.
            </p>
          </div>
        </Section>
      </main>
      <AppFooter />
    </div>
  );
};

export default TriggerIntroPage;
