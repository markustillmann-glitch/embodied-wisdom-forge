import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Heart, Sparkles, Target, Users, BookOpen, Lightbulb, Shield, Compass, Zap, PenTool, Eye } from 'lucide-react';
import bbOwlLogo from '@/assets/bb-owl-new.png';
import { useLanguage } from '@/contexts/LanguageContext';

const Modell = () => {
  const navigate = useNavigate();

  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Warm Gradient Background - consistent with SelfcareReflection */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      
      {/* Header - Sticky */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/30 pt-[max(env(safe-area-inset-top),20px)]">
        <div className="flex items-center justify-between px-6 py-3">
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
      </header>

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
            subtitle="Weshalb dieses Wissen entscheidend ist für Führung, Selbststeuerung – und jeden neugierigen Menschen."
            delay={0.5}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              In der modernen Führung – sei es von Unternehmen, Teams oder dem eigenen Leben – stoßen rein kognitive Strategien an ihre Grenzen. Wir wissen oft intellektuell, was die richtige Entscheidung oder die richtige Art der Kommunikation wäre. Doch unter Druck, Zeitmangel oder in Konflikten greifen wir auf automatisierte Muster zurück.
            </p>
            <HighlightBox>
              Wir handeln nicht nach unserem besten Wissen, sondern nach unserem am tiefsten verankerten Zustand.
            </HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
              Dieses Framework schließt die Lücke zwischen dem Anspruch („Ich will besonnen und strategisch handeln") und der Realität („Ich wurde getriggert und habe reagiert").
            </p>
            <Quote>
              Der Mensch ist kein denkendes Wesen mit einem Körper – sondern ein verkörpertes Wesen, das denken gelernt hat.
            </Quote>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
              Erinnerungen, Impulse, Vorurteile (Bias) und Selbstbilder entstehen nicht primär im Kopf. Sie entstehen in einem Zusammenspiel aus Körperzustand, uralten Überlebensprogrammen, epigenetischem Erbe und inneren Anteilen.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wer führt, führt nicht nur Köpfe, sondern reguliert Nervensysteme – zuerst das eigene, dann das des Systems. Dieses Kompendium liefert die Architektur dafür.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Doch dieses Wissen ist nicht nur für Führungskräfte oder Menschen in Krisen relevant. Es ist für jeden, der neugierig ist, sich selbst besser zu verstehen – unabhängig von Alter, Beruf oder Lebenssituation. Die Frage „Warum reagiere ich so, wie ich reagiere?" ist universell menschlich.
            </p>
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
            <ul className="space-y-2 text-muted-foreground mb-4">
              <ListItem>Sinneseindrücke (Gerüche, Geräusche)</ListItem>
              <ListItem>Damalige Emotionen</ListItem>
              <ListItem>Aktuelle Körperzustände</ListItem>
              <ListItem>Bedeutungen, die wir dem Ereignis heute geben</ListItem>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-6 italic">
              Fazit: Jede Erinnerung ist keine Reise in die Vergangenheit, sondern aktive Gegenwartsarbeit. Wie wir uns heute fühlen, bestimmt, was wir von gestern erinnern.
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">1.2 Explizites vs. implizites Gedächtnis</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Um menschliches Verhalten zu verstehen, müssen wir zwei Speichersysteme unterscheiden:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <h5 className="font-medium text-foreground mb-2">1. Explizites Gedächtnis</h5>
                <p className="text-sm text-muted-foreground">(Der Verstand)</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Fakten, Geschichten, chronologische Abläufe</li>
                  <li>• Sprachlich und bewusst zugänglich</li>
                  <li className="italic mt-2">„Ich weiß noch, dass…"</li>
                </ul>
              </div>
              <div className="bg-primary/10 rounded-xl p-4">
                <h5 className="font-medium text-foreground mb-2">2. Implizites Gedächtnis</h5>
                <p className="text-sm text-muted-foreground">(Der Körper & das Gefühl)</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Körperreaktionen, automatisierte Erwartungen</li>
                  <li>• Vorsprachlich, schneller und unbewusst</li>
                  <li className="italic mt-2">„Es fühlt sich plötzlich so an, als ob…"</li>
                </ul>
              </div>
            </div>
            <Quote>
              Das implizite Gedächtnis ist älter, schneller und hochgradig auf Sicherheit und Beziehung ausgerichtet. Es steuert unsere Sofortreaktionen.
            </Quote>

            <h4 className="font-semibold text-foreground mb-2 mt-6">1.3 Memory Trigger</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ein Trigger (Auslöser durch Musik, Orte, Tonlagen, soziale Situationen wie Kritik) öffnet nicht nur eine mentale Datei. Er aktiviert eine ganze „Zustandslandschaft".
            </p>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium">Ein Trigger aktiviert eine Kette:</p>
              <p className="text-muted-foreground text-sm mt-2">
                Erinnerung (implizit) + Alter Körperzustand + Schutzstrategie + Aktuelles Bedürfnis
              </p>
            </div>
          </Section>

          {/* Kapitel 2 */}
          <Section 
            icon={<Heart className="w-5 h-5" />}
            title="Kapitel 2: Das somatische Gedächtnis (Body Memory)"
            delay={0.7}
          >
            <h4 className="font-semibold text-foreground mb-2">2.1 Was der Körper speichert</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Während der Verstand die „Story" speichert, speichert der Körper die „Energie" der Situation. Er registriert vor allem:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <ListItem>Alarm- vs. Sicherheitszustände</ListItem>
              <ListItem>Bindungserfahrungen (War ich willkommen? War ich allein?)</ListItem>
              <ListItem>Ohnmacht vs. Handlungsspielraum</ListItem>
              <ListItem>Rhythmus, Atemmuster, muskuläre Spannung</ListItem>
            </ul>
            <HighlightBox>
              Der Körper speichert nicht primär „was passiert ist", sondern die Antwort auf die Frage: „Wie sicher war ich?"
            </HighlightBox>

            <h4 className="font-semibold text-foreground mb-2 mt-6">2.2 Warum der Körper schneller ist als das Denken</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Dies ist der entscheidende Punkt für Führung und Selbstmanagement unter Stress: Neurobiologisch reagieren der Körper und das limbische System (Emotionszentrum) in Millisekunden auf einen Reiz. Die Kognition (das bewusste Denken) folgt deutlich verzögert.
            </p>
            <Quote>
              Das Denken ist oft nur der „Pressesprecher", der nachträglich erklärt (oder rationalisiert), was der Körper längst entschieden hat.
            </Quote>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Das erklärt Phänomene wie emotionale Überreaktionen und den Satz: „Ich weiß es rational besser, aber ich kann gerade nicht anders."
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">2.3 Body Memory ist nicht pathologisch</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Das somatische Gedächtnis ist nicht „kaputt" oder irrational. Es ist ein hocheffizientes Schutzsystem, das auf vergangenen Erfahrungen basiert.
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">2.4 Das Erbe in den Zellen: Epigenetik</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Das implizite Gedächtnis beginnt nicht erst mit der eigenen Geburt. Die Forschung der Epigenetik zeigt, dass traumatische Erfahrungen, langanhaltende Stresszustände oder existenzielle Krisen Marker auf der DNA hinterlassen, die vererbt werden können.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">Das bedeutet:</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <ListItem>Ein Nervensystem kann mit einer erhöhten Alarmbereitschaft auf die Welt kommen, ohne selbst je Gefahr erlebt zu haben.</ListItem>
              <ListItem>Bestimmte Trigger (z.B. Autorität, Mangel, Plötzlichkeit) aktivieren Ängste, die eigentlich die Realität der Eltern oder Großeltern widerspiegeln.</ListItem>
            </ul>
            <Quote>
              Wir erinnern uns biologisch an die Krisen unserer Vorfahren. Das erklärt oft diffuse Ängste oder Blockaden, die „keinen Sinn ergeben", wenn wir nur auf die eigene Biografie schauen.
            </Quote>
          </Section>

          {/* Kapitel 3: Meditation */}
          <Section 
            icon={<Sparkles className="w-5 h-5" />}
            title="Kapitel 3: Meditation als Zugang (und Risiko)"
            delay={0.75}
          >
            <h4 className="font-semibold text-foreground mb-2">3.1 Was Meditation wirklich macht</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In diesem Kontext ist Meditation keine Entspannungstechnik, sondern ein Wahrnehmungswerkzeug. Sie tut drei Dinge:
            </p>
            <ol className="space-y-2 text-muted-foreground mb-4 list-decimal list-inside">
              <li>Sie reduziert äußere Reize (Stille).</li>
              <li>Sie erhöht die Interozeption (die Fähigkeit, Signale aus dem Körperinneren wahrzunehmen).</li>
              <li>Sie senkt die kognitive Kontrolle (das „Gedankenkarussell" wird leiser).</li>
            </ol>
            <HighlightBox>
              Das öffnet den direkten Zugang zum impliziten Gedächtnis. Der „Lärm" des Alltags übertönt nicht mehr die Signale des Körpers.
            </HighlightBox>

            <h4 className="font-semibold text-foreground mb-2 mt-6">3.2 Warum in Meditation „alte Dinge" auftauchen</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wenn es still wird, wird es oft nicht ruhig, sondern laut im Inneren. Nicht weil Meditation Probleme macht, sondern weil der Körper endlich den Raum bekommt, „zu sprechen" und unvollständige Prozesse sichtbar werden.
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">3.3 Die entscheidende Unterscheidung: Heilung vs. Überforderung</h4>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <h5 className="font-medium text-green-700 mb-2">Meditation wirkt integrativ, wenn:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• das Tempo stimmt und eine Grundsicherheit im Hier und Jetzt vorhanden ist.</li>
                  <li>• Selbstmitgefühl aktiv ist (nicht wertendes Beobachten).</li>
                </ul>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h5 className="font-medium text-red-700 mb-2">Meditation wirkt retraumatisierend, wenn:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• sie als „Durchbruchtechnik" genutzt wird („no pain no gain").</li>
                  <li>• intensive Körperreaktionen (Zittern, Panik) ignoriert werden.</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Kapitel 4: IFS */}
          <Section 
            icon={<Users className="w-5 h-5" />}
            title="Kapitel 4: IFS – Die innere Architektur"
            delay={0.8}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wenn wir verstehen, dass der Körper Erinnerungen speichert, hilft uns das Framework der „Internal Family Systems" (IFS), die daraus resultierenden Verhaltensweisen zu ordnen.
            </p>
            
            <h4 className="font-semibold text-foreground mb-2">4.1 Grundannahme von IFS</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wir bestehen aus vielen verschiedenen inneren Anteilen (Teilen), ähnlich einem inneren Team.
            </p>
            <HighlightBox>
              Es gibt keine schlechten Teile. Jeder Teil hat – oder hatte ursprünglich – eine schützende Funktion für das System.
            </HighlightBox>
            
            <h4 className="font-semibold text-foreground mb-3 mt-6">4.2 Die drei zentralen Teiltypen</h4>
            <div className="space-y-3">
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h5 className="font-medium text-blue-700 mb-1">Manager (Proaktive Beschützer)</h5>
                <p className="text-sm text-muted-foreground">Wollen Schmerz verhindern durch Kontrolle, Perfektionismus, Planung, Intellektualisieren.</p>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                <h5 className="font-medium text-orange-700 mb-1">Firefighter (Reaktive Beschützer)</h5>
                <p className="text-sm text-muted-foreground">Wenn Schmerz durchbricht, sorgen sie für sofortige Ablenkung (Wut, Sucht, Rückzug).</p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <h5 className="font-medium text-purple-700 mb-1">Exile (Die Verbannten)</h5>
                <p className="text-sm text-muted-foreground">Verletzte Anteile, die Scham oder Angst tragen und von den anderen geschützt werden.</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-3 mt-6">4.3 Das Selbst (Self-Energy)</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Das „Selbst" ist kein Teil, sondern die Kernessenz – ein Zustand von Präsenz und natürlicher Führungsqualität. Es ist immer da, wird aber oft von Teilen überlagert.
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
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
              Wenn wir aus dem Selbst heraus handeln, können wir alle Teile mit Wohlwollen führen, ohne sie zu unterdrücken oder zu bekämpfen.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4 italic">
              Ziel der Arbeit: Nicht die Teile loswerden, sondern Selbst-Führung entwickeln – die Fähigkeit, aus dieser Kernessenz heraus zu leben und alle Teile liebevoll zu integrieren.
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">4.4 Verbindung zum Körper</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Teile zeigen sich immer auch somatisch (Spannung, Übelkeit, Unruhe). Der Körper ist der Kompass.
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">4.5 Übernommene Lasten („Legacy Burdens")</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nicht alle unsere Teile sind durch eigene Erfahrung entstanden. In Systemen übernehmen Kinder oft unbewusst die Rollenbilder und Glaubenssätze der Eltern, um die Bindung zu sichern.
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li><strong>Der kopierte Manager:</strong> Agiert dein innerer Antreiber so, wie du es brauchst, oder exakt so, wie dein Vater mit Stress umging?</li>
              <li><strong>Die übernommene Angst:</strong> Trägt ein Teil vielleicht die unaufgelöste Panik der Mutter vor Ausgrenzung?</li>
            </ul>
            <Quote>
              Die entscheidende Frage ist: „Gehört dieses Gefühl eigentlich mir – oder trage ich es für jemand anderen?"
            </Quote>
          </Section>

          {/* Kapitel 5: NVC */}
          <Section 
            icon={<Sparkles className="w-5 h-5" />}
            title="Kapitel 5: NVC – Sprache für innere Wahrheit"
            delay={0.85}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              IFS hilft zu verstehen, wer in uns spricht. Gewaltfreie Kommunikation (NVC) hilft dabei, wie wir dies ausdrücken, um Verbindung herzustellen.
            </p>
            
            <h4 className="font-semibold text-foreground mb-2">5.1 Warum NVC hier passt</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              NVC moralisiert und pathologisiert nicht. Es ist ein Präzisionswerkzeug, um somatische Zustände in beziehungsfähige Sprache zu übersetzen.
            </p>

            <h4 className="font-semibold text-foreground mb-3 mt-4">5.2 Die vier Schritte – verkörpert gedacht</h4>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Beobachtung', desc: 'Was ist faktisch passiert? (Beruhigt das Alarmsystem)' },
                { step: '2', title: 'Gefühl', desc: 'Was fühle ich? (Verbindung zum impliziten Gedächtnis)' },
                { step: '3', title: 'Bedürfnis', desc: 'Was braucht gerade Schutz oder Erfüllung? (Der Kernantrieb)' },
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

            <h4 className="font-semibold text-foreground mb-2 mt-6">5.3 Bedürfnisse als Brücke</h4>
            <p className="text-muted-foreground leading-relaxed">
              Bedürfnisse sind der gemeinsame Nenner aller Teile. Auch ein destruktiver Teil versucht oft nur, ein Bedürfnis nach Sicherheit zu erfüllen.
            </p>
          </Section>

          {/* Kapitel 6: Prozessmodell */}
          <Section 
            icon={<Target className="w-5 h-5" />}
            title="Kapitel 6: Das integrierte Prozessmodell"
            delay={0.9}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wir fügen die Ebenen zusammen. Dies ist die Architektur einer bewussten Reaktion unter Druck.
            </p>

            <h4 className="font-semibold text-foreground mb-3">6.1 Die Gesamtbewegung (Der Flow)</h4>
            <div className="space-y-2">
              {[
                { label: 'AUSLÖSER', desc: 'Trigger im Außen: Kritik, Blick, Zeitdruck' },
                { label: 'SOMATISCHE REAKTION', desc: 'Implizites Gedächtnis feuert: Alarm, Anspannung' },
                { label: 'TEIL-AKTIVIERUNG & ERBE', desc: 'Ein Beschützer-Teil übernimmt' },
                { label: 'DIE ENTSCHEIDENDE GABELUNG', desc: '' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-muted/30 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.desc && <span className="text-muted-foreground ml-2">{item.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 mt-4 mb-4">
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h5 className="font-medium text-red-700 mb-2">AUTOMATIK-ROUTE</h5>
                <p className="text-sm text-muted-foreground">Reagieren (Fight/Flight/Freeze)</p>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <h5 className="font-medium text-green-700 mb-2">DIE PAUSE / SELF-ENERGY</h5>
                <p className="text-sm text-muted-foreground">Wahrnehmung + Neugier statt Identifikation</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'ÜBERSETZUNG', desc: 'NVC-Check-In: Gefühl + Bedürfnis' },
                { label: 'BEWUSSTE HANDLUNG', desc: 'Antworten statt Reagieren' },
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

            <h4 className="font-semibold text-foreground mb-3 mt-6">6.2 Praxis-Beispiel: Die kritische Situation</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Die Situation:</strong> Sie stellen ein Projekt vor. Ein Stakeholder unterbricht genervt: „Das funktioniert hier nicht. Nächster Punkt."
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h5 className="font-medium text-red-700 mb-2">Automatik-Modus</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>Trigger:</strong> Unterbrechung & Tonfall</li>
                  <li><strong>Somatik:</strong> Stich im Magen, Hitze</li>
                  <li><strong>Teil:</strong> „Verteidiger" wehrt Inkompetenzgefühle ab</li>
                  <li><strong>Reaktion:</strong> Zynismus oder Gegenangriff → Eskalation</li>
                </ul>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <h5 className="font-medium text-green-700 mb-2">Integrierter Modus</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>Trigger:</strong> Unterbrechung</li>
                  <li><strong>Somatik:</strong> Sie spüren Stich und Hitze</li>
                  <li><strong>Pause:</strong> Ausatmen, Impuls erkennen, nicht ausagieren</li>
                  <li><strong>Übersetzung:</strong> „Ich bin irritiert, weil ich möchte, dass die Arbeit gesehen wird."</li>
                  <li><strong>Handlung:</strong> Deeskalierende Frage → Verbindung</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Kapitel 7: Unconscious Bias */}
          <Section 
            icon={<Eye className="w-5 h-5" />}
            title="Kapitel 7: Unconscious Bias neu verstanden"
            delay={0.95}
          >
            <h4 className="font-semibold text-foreground mb-2">7.1 Bias als Körperphänomen</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bias ist kein reiner Denkfehler, sondern ein somatischer Sicherheitsmechanismus unter Zeitdruck.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Das Gehirn scannt: „Sicher oder unsicher?"
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <ListItem>Bias = Ein Schutzteil unter Stress</ListItem>
              <ListItem>Gefühl: Unsicherheit, Angst vor dem Fremden</ListItem>
              <ListItem>Bedürfnis: Vorhersagbarkeit, Zugehörigkeit</ListItem>
            </ul>
            <HighlightBox>
              Regulation schlägt Belehrung. Wenn ich mich sicher fühle, brauche ich meine Vorurteile weniger dringend als Schutzschild.
            </HighlightBox>
          </Section>

          {/* Kapitel 8: Journaling */}
          <Section 
            icon={<PenTool className="w-5 h-5" />}
            title="Kapitel 8: Erinnerungskultur & Journaling"
            delay={1.0}
          >
            <h4 className="font-semibold text-foreground mb-2">8.1 Erinnerungen sind formbar</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wir können die emotionale Ladung einer Erinnerung verändern, indem wir den Zustand ändern, in dem wir uns erinnern.
            </p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">8.2 Integratives Journaling</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Fragen Sie beim Reflektieren nicht nur: „Was ist passiert?"
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">Sondern:</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <ListItem>Wie hat es sich im Körper angefühlt?</ListItem>
              <ListItem>Welcher Teil war aktiv?</ListItem>
              <ListItem>Gehört dieses Gefühl mir oder ist es ein Erbe?</ListItem>
              <ListItem>Welches Bedürfnis war lebendig?</ListItem>
            </ul>
          </Section>

          {/* Angrenzende Themenfelder */}
          <Section 
            icon={<Zap className="w-5 h-5" />}
            title="Angrenzende Themenfelder"
            delay={1.05}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Dieses Modell bildet das Fundament für die Arbeit mit:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <ListItem>Polyvagal-Theorie (Nervensystem & Sicherheit)</ListItem>
              <ListItem>Window of Tolerance (Stresstoleranz-Fenster)</ListItem>
              <ListItem>Bindungsstile (Beziehungsmuster)</ListItem>
              <ListItem>Embodied Cognition (Verkörpertes Denken)</ListItem>
            </ul>
          </Section>

          {/* Die zentrale These */}
          <Section 
            icon={<Lightbulb className="w-5 h-5" />}
            title="Die zentrale These"
            delay={1.1}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wenn wir die Ebenen von Körpergedächtnis, Epigenetik, inneren Anteilen und Bedürfnissen zusammenführen, kommen wir zu einer radikalen Schlussfolgerung:
            </p>
            <Quote className="text-lg">
              Viele menschliche Probleme sind keine Denkprobleme, sondern Zustandsprobleme.
            </Quote>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
              Wir versuchen oft, Konflikte durch mehr Analyse zu lösen. Doch wenn das Nervensystem im Alarmzustand ist, ist der Zugang zu Lösungen blockiert.
            </p>
            <HighlightBox>
              Die Arbeit beginnt bei der Regulation des Zustands.
            </HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-2">
              Wenn der Zustand reguliert ist:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <ListItem>werden Teile kooperativ.</ListItem>
              <ListItem>werden Bedürfnisse verhandelbar.</ListItem>
              <ListItem>können wir unterscheiden: Was ist mein Stress, und was ist altes Erbe?</ListItem>
              <ListItem>wird echte Beziehung möglich.</ListItem>
            </ul>
          </Section>

          {/* Für neugierige Menschen */}
          <Section 
            icon={<Shield className="w-5 h-5" />}
            title="Für neugierige Menschen in jeder Lebenssituation"
            delay={1.15}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              Du musst keine Krise erleben, um von diesem Wissen zu profitieren. Neugier auf dich selbst ist der beste Ausgangspunkt.
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <ListItem>Verstehe, warum du in bestimmten Situationen so reagierst, wie du reagierst</ListItem>
              <ListItem>Entdecke verborgene Muster und Prägungen, die dein Verhalten formen</ListItem>
              <ListItem>Entwickle ein tieferes Verständnis für deine Emotionen und Bedürfnisse</ListItem>
              <ListItem>Finde mehr Gelassenheit im Alltag durch Selbsterkenntnis</ListItem>
              <ListItem>Verbessere deine Beziehungen durch besseres Verstehen deiner selbst</ListItem>
            </ul>

            <h4 className="font-semibold text-foreground mb-3">Die Mehrwerte für neugierige Selbstentdecker</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Selbsterkenntnis:</strong> Lerne die Sprache deines Körpers und deiner Emotionen zu verstehen</li>
              <li><strong>Authentizität:</strong> Unterscheide zwischen echten Bedürfnissen und übernommenen Mustern</li>
              <li><strong>Gelassenheit:</strong> Reagiere bewusster statt automatisch</li>
              <li><strong>Beziehungstiefe:</strong> Verstehe dich selbst besser und kommuniziere klarer</li>
              <li><strong>Lebensqualität:</strong> Triff Entscheidungen, die wirklich zu dir passen</li>
            </ul>
          </Section>

          {/* Oria Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
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
const Section = ({ icon, title, subtitle, children, delay = 0 }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode; delay?: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
    </div>
    {subtitle && (
      <p className="text-sm text-muted-foreground mb-4 ml-13">{subtitle}</p>
    )}
    <div className="mt-4">
      {children}
    </div>
  </motion.section>
);

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl px-4 py-3 my-4">
    <p className="text-foreground font-medium leading-relaxed">👉 {children}</p>
  </div>
);

const Quote = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <blockquote className={`border-l-4 border-accent pl-4 py-2 my-4 italic ${className}`}>
    <p className="text-muted-foreground leading-relaxed">"{children}"</p>
  </blockquote>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="text-primary mt-1.5">•</span>
    <span>{children}</span>
  </li>
);

export default Modell;
