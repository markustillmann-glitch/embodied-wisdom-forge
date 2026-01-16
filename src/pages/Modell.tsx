import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Heart, Sparkles, Target, Users, BookOpen, Lightbulb, Shield, Compass } from 'lucide-react';
import { PolygonalBackground } from '@/components/PolygonalBackground';
import bbOwlLogo from '@/assets/bb-owl-new.png';

const Modell = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 relative overflow-x-hidden">
      <PolygonalBackground />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top,20px),20px)] pb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/selfcare')}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" />
        </motion.button>
        
        <div className="w-12 h-12 rounded-full bg-foreground shadow-lg flex items-center justify-center">
          <img src={bbOwlLogo} alt="Oria" className="w-9 h-9 object-contain" />
        </div>
        
        <div className="w-10" /> {/* Spacer for balance */}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-[max(env(safe-area-inset-bottom,24px),24px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4 py-6">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-foreground leading-tight"
            >
              Inner Guidance Through Lived Memories
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <Compass className="w-4 h-4" />
              Das Inner Compass Framework
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Für mehr Klarheit in Zeiten konstanter Überforderung.
            </motion.p>
          </div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm"
          >
            <p className="text-foreground leading-relaxed">
              Das Handlungsmodell hinter der Oria Selfcare App verbindet moderne Neurobiologie und Epigenetik mit praktischer Selbstführungskompetenz.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Kein Ratgeber oder Theoriemodell, sondern Landkarte, praktischer Wegweiser und Transformationshilfe für das menschliche Betriebssystem unter Druck.
            </p>
          </motion.div>

          {/* Vorwort */}
          <Section 
            icon={<BookOpen className="w-5 h-5" />}
            title="Vorwort: Wenn viel auf dem Spiel steht"
            delay={0.5}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              In der modernen Führung – sei es von Unternehmen, Teams oder dem eigenen Leben – stoßen rein kognitive Strategien an ihre Grenzen. Wir wissen oft intellektuell, was die richtige Entscheidung wäre. Doch unter Druck greifen wir auf automatisierte Muster zurück.
            </p>
            <HighlightBox>
              Wir handeln nicht nach unserem besten Wissen, sondern nach unserem am tiefsten verankerten Zustand.
            </HighlightBox>
            <Quote>
              Der Mensch ist kein denkendes Wesen mit einem Körper – sondern ein verkörpertes Wesen, das denken gelernt hat.
            </Quote>
          </Section>

          {/* Kapitel 1 */}
          <Section 
            icon={<Brain className="w-5 h-5" />}
            title="Kapitel 1: Was Erinnerung wirklich ist"
            delay={0.6}
          >
            <h4 className="font-semibold text-foreground mb-2">1.1 Erinnerung ist kein Archiv</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Die verbreitetste Illusion über unser Gedächtnis ist die des „Videoarchivs". Wir glauben, wir rufen ab, was exakt gespeichert wurde. Das ist falsch.
            </p>
            <HighlightBox>
              Erinnerungen sind keine gespeicherten Filme, sondern rekonstruierte Zustände.
            </HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
              Bei jedem Erinnern werden verschiedene Fragmente im Gehirn neu kombiniert:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <ListItem>Sinneseindrücke (Gerüche, Geräusche)</ListItem>
              <ListItem>Damalige Emotionen</ListItem>
              <ListItem>Aktuelle Körperzustände</ListItem>
              <ListItem>Bedeutungen, die wir dem Ereignis heute geben</ListItem>
            </ul>

            <h4 className="font-semibold text-foreground mb-2 mt-6">1.2 Explizites vs. implizites Gedächtnis</h4>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <h5 className="font-medium text-foreground mb-2">Explizites Gedächtnis</h5>
                <p className="text-sm text-muted-foreground">(Der Verstand)</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Fakten, Geschichten, Abläufe</li>
                  <li>• Sprachlich und bewusst</li>
                  <li className="italic">„Ich weiß noch, dass…"</li>
                </ul>
              </div>
              <div className="bg-primary/10 rounded-xl p-4">
                <h5 className="font-medium text-foreground mb-2">Implizites Gedächtnis</h5>
                <p className="text-sm text-muted-foreground">(Der Körper & das Gefühl)</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Körperreaktionen, Erwartungen</li>
                  <li>• Vorsprachlich und unbewusst</li>
                  <li className="italic">„Es fühlt sich plötzlich so an…"</li>
                </ul>
              </div>
            </div>
            <Quote>
              Das implizite Gedächtnis ist älter, schneller und hochgradig auf Sicherheit ausgerichtet. Es steuert unsere Sofortreaktionen.
            </Quote>
          </Section>

          {/* Kapitel 2 */}
          <Section 
            icon={<Heart className="w-5 h-5" />}
            title="Kapitel 2: Das somatische Gedächtnis"
            delay={0.7}
          >
            <h4 className="font-semibold text-foreground mb-2">2.1 Was der Körper speichert</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Während der Verstand die „Story" speichert, speichert der Körper die „Energie" der Situation:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <ListItem>Alarm- vs. Sicherheitszustände</ListItem>
              <ListItem>Bindungserfahrungen (War ich willkommen?)</ListItem>
              <ListItem>Ohnmacht vs. Handlungsspielraum</ListItem>
              <ListItem>Rhythmus, Atemmuster, muskuläre Spannung</ListItem>
            </ul>
            <HighlightBox>
              Der Körper speichert nicht primär „was passiert ist", sondern die Antwort auf die Frage: „Wie sicher war ich?"
            </HighlightBox>

            <h4 className="font-semibold text-foreground mb-2 mt-6">2.2 Warum der Körper schneller ist</h4>
            <Quote>
              Das Denken ist oft nur der „Pressesprecher", der nachträglich erklärt, was der Körper längst entschieden hat.
            </Quote>

            <h4 className="font-semibold text-foreground mb-2 mt-6">2.4 Epigenetik: Das Erbe in den Zellen</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Das implizite Gedächtnis beginnt nicht erst mit der eigenen Geburt. Traumatische Erfahrungen können Marker auf der DNA hinterlassen, die vererbt werden.
            </p>
            <Quote>
              Wir erinnern uns biologisch an die Krisen unserer Vorfahren. Das erklärt oft diffuse Ängste, die „keinen Sinn ergeben".
            </Quote>
          </Section>

          {/* Kapitel 4: IFS */}
          <Section 
            icon={<Users className="w-5 h-5" />}
            title="Kapitel 4: IFS – Die innere Architektur"
            delay={0.8}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wir bestehen aus vielen verschiedenen inneren Anteilen (Teilen), ähnlich einem inneren Team.
            </p>
            <HighlightBox>
              Es gibt keine schlechten Teile. Jeder Teil hat – oder hatte ursprünglich – eine schützende Funktion.
            </HighlightBox>
            
            <h4 className="font-semibold text-foreground mb-3 mt-6">Die drei zentralen Teiltypen</h4>
            <div className="space-y-3">
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h5 className="font-medium text-blue-700 mb-1">Manager (Proaktive Beschützer)</h5>
                <p className="text-sm text-muted-foreground">Wollen Schmerz verhindern durch Kontrolle, Perfektionismus, Planung.</p>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                <h5 className="font-medium text-orange-700 mb-1">Firefighter (Reaktive Beschützer)</h5>
                <p className="text-sm text-muted-foreground">Sorgen für sofortige Ablenkung wenn Schmerz durchbricht (Wut, Sucht, Rückzug).</p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <h5 className="font-medium text-purple-700 mb-1">Exile (Die Verbannten)</h5>
                <p className="text-sm text-muted-foreground">Verletzte Anteile, die Scham oder Angst tragen und geschützt werden.</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-3 mt-6">Das Selbst (Self-Energy)</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Das „Selbst" ist kein Teil, sondern die Kernessenz – ein Zustand von Präsenz und natürlicher Führungsqualität.
            </p>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <h5 className="font-medium text-green-700 mb-2">Die 8 C-Qualitäten des Selbst:</h5>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>• Calm (Ruhe)</span>
                <span>• Curiosity (Neugier)</span>
                <span>• Clarity (Klarheit)</span>
                <span>• Compassion (Mitgefühl)</span>
                <span>• Confidence (Zuversicht)</span>
                <span>• Courage (Mut)</span>
                <span>• Creativity (Kreativität)</span>
                <span>• Connectedness (Verbundenheit)</span>
              </div>
            </div>
          </Section>

          {/* Kapitel 5: NVC */}
          <Section 
            icon={<Sparkles className="w-5 h-5" />}
            title="Kapitel 5: NVC – Sprache für innere Wahrheit"
            delay={0.9}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              IFS hilft zu verstehen, wer in uns spricht. Gewaltfreie Kommunikation (NVC) hilft dabei, wie wir dies ausdrücken.
            </p>
            <h4 className="font-semibold text-foreground mb-3 mt-4">Die vier Schritte</h4>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Beobachtung', desc: 'Was ist faktisch passiert? (Beruhigt das Alarmsystem)' },
                { step: '2', title: 'Gefühl', desc: 'Was fühle ich? (Verbindung zum impliziten Gedächtnis)' },
                { step: '3', title: 'Bedürfnis', desc: 'Was braucht gerade Schutz oder Erfüllung?' },
                { step: '4', title: 'Bitte', desc: 'Was wäre ein konkreter nächster Schritt?' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{item.title}</h5>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Kapitel 6: Prozessmodell */}
          <Section 
            icon={<Target className="w-5 h-5" />}
            title="Kapitel 6: Das integrierte Prozessmodell"
            delay={1.0}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Die Architektur einer bewussten Reaktion unter Druck:
            </p>
            <div className="space-y-2">
              {[
                { label: 'Auslöser', desc: 'Trigger im Außen: Kritik, Blick, Zeitdruck' },
                { label: 'Somatische Reaktion', desc: 'Implizites Gedächtnis feuert: Alarm, Anspannung' },
                { label: 'Teil-Aktivierung', desc: 'Ein Beschützer-Teil übernimmt' },
                { label: 'Die Pause', desc: 'Wahrnehmung + Neugier statt Identifikation' },
                { label: 'Übersetzung', desc: 'NVC-Check-In: Gefühl + Bedürfnis' },
                { label: 'Bewusste Handlung', desc: 'Antworten statt Reagieren' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-muted/30 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{item.label}:</span>
                    <span className="text-muted-foreground ml-2">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Die zentrale These */}
          <Section 
            icon={<Lightbulb className="w-5 h-5" />}
            title="Die zentrale These"
            delay={1.1}
          >
            <Quote className="text-lg">
              Viele menschliche Probleme sind keine Denkprobleme, sondern Zustandsprobleme.
            </Quote>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
              Wir versuchen oft, Konflikte durch mehr Analyse zu lösen. Doch wenn das Nervensystem im Alarmzustand ist, ist der Zugang zu Lösungen blockiert.
            </p>
            <HighlightBox>
              Die Arbeit beginnt bei der Regulation des Zustands.
            </HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Wenn der Zustand reguliert ist, werden Teile kooperativ, Bedürfnisse verhandelbar, und echte Beziehung möglich.
            </p>
          </Section>

          {/* Für neugierige Menschen */}
          <Section 
            icon={<Shield className="w-5 h-5" />}
            title="Für neugierige Menschen"
            delay={1.2}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Du musst keine Krise erleben, um von diesem Wissen zu profitieren. Neugier auf dich selbst ist der beste Ausgangspunkt.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <ListItem>Verstehe, warum du in bestimmten Situationen so reagierst</ListItem>
              <ListItem>Entdecke verborgene Muster und Prägungen</ListItem>
              <ListItem>Entwickle ein tieferes Verständnis für deine Emotionen</ListItem>
              <ListItem>Finde mehr Gelassenheit im Alltag</ListItem>
              <ListItem>Verbessere deine Beziehungen</ListItem>
            </ul>
          </Section>

          {/* Oria Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-foreground shadow-lg flex items-center justify-center mx-auto mb-4">
              <img src={bbOwlLogo} alt="Oria" className="w-12 h-12 object-contain" />
            </div>
            <p className="text-muted-foreground">
              Oria begleitet dich dabei, dieses Modell im Alltag anzuwenden – sanft, dosiert und auf deine Bedürfnisse abgestimmt.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
const Section = ({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </motion.section>
);

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg my-4">
    <p className="text-foreground font-medium">👉 {children}</p>
  </div>
);

const Quote = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <blockquote className={`border-l-4 border-primary/30 pl-4 py-2 my-4 italic text-muted-foreground ${className}`}>
    "{children}"
  </blockquote>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="text-primary mt-1">•</span>
    <span>{children}</span>
  </li>
);

export default Modell;
