import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Wann kann ich Oria Selfcare nutzen?",
    answer: `Oria ist nicht nur für "große Krisen" da – sie ist besonders stark bei kleinen Momenten, die sonst untergehen. Genau dort beginnen Muster, Bedürfnisse und innere Führung sichtbar zu werden.

**20 konkrete Situationen, in denen Oria helfen kann:**

**1. Positive oder negative Erinnerung reflektieren**
z.B. ein besonders schönes Gespräch, ein beschämender Moment, ein Erfolg oder ein Konflikt.

**2. Ein Ereignis des Tages, das emotional hängen bleibt**
„Das Meeting heute hat mich den ganzen Nachmittag beschäftigt – warum eigentlich?"

**3. Beziehungserfahrung verarbeiten**
z.B. Nähe, Rückzug, Missverständnis, Enttäuschung oder Verbundenheit mit Partner, Kind, Kolleg:in.

**4. Wiederkehrender Alltagsgedanke**
z.B. „Warum bin ich immer genervt, wenn Menschen gedankenlos im Weg stehen?"

**5. Starke emotionale Reaktion ohne klaren Auslöser**
z.B. plötzliche Gereiztheit, Traurigkeit oder innere Leere.

**6. Körperliches Signal erkunden**
z.B. Druck im Brustkorb, verspannter Nacken, Erschöpfung ohne offensichtlichen Grund.

**7. Trigger-Moment verstehen**
z.B. ein bestimmter Tonfall, Blick oder Satz löst überproportionale Reaktion aus.

**8. Innere Konflikte klären**
z.B. „Ein Teil will Ruhe, ein anderer will Leistung – was brauche ich gerade wirklich?"

**9. Entscheidungsfindung begleiten**
z.B. Jobwechsel, Zusage/Absage, Grenze setzen oder noch abwarten.

**10. Wiederkehrende Muster erkennen**
z.B. immer wieder Überforderung, Rückzug, Perfektionismus oder Anpassung.

**11. Selbstkritische Gedanken reflektieren**
z.B. „Ich mache nie genug", „Andere kriegen das besser hin".

**12. Erfolg oder Stolz bewusst verankern**
z.B. etwas geschafft zu haben – und es nicht sofort zu relativieren.

**13. Nach Konflikten sortieren**
z.B. nach Streit: Was habe ich gefühlt? Was war mein Bedürfnis? Was hätte ich gebraucht?

**14. Grenzverletzungen wahrnehmen und benennen**
z.B. wenn man „Ja" gesagt hat, aber innerlich „Nein" meinte.

**15. Beobachtung von Urteilen oder Abwertungen**
z.B. Gedanken wie „Alte Leute behindern mich ständig" – ohne Schuld, aber mit Neugier.

**16. Innere Anspannung vor Ereignissen**
z.B. vor Präsentationen, Gesprächen, Arztterminen oder Familienfeiern.

**17. Erschöpfung oder Überforderung einordnen**
z.B. „Bin ich müde – oder emotional ausgelaugt?"

**18. Dankbarkeit oder Verbundenheit vertiefen**
z.B. ein Moment mit Natur, Musik, Nähe oder Stille.

**19. Lebensphase reflektieren**
z.B. Übergänge: Elternschaft, berufliche Neuausrichtung, Sinnfragen.

**20. Einfach "Check-in" ohne konkreten Anlass**
z.B. „Wie geht es mir gerade – körperlich, emotional, in Beziehung, im Leben?"`
  },
  {
    question: "Was bringt mir Oria Selfcare?",
    answer: `Oria hilft, alte Erfahrungen sicher zu erinnern, zu würdigen und innerlich abzuschließen – damit sie nicht unbewusst das Heute steuern.

Oria Selfcare unterstützt dich dabei:

• **Selbstwahrnehmung zu stärken** – Du lernst, deine Gefühle und Bedürfnisse besser zu erkennen
• **Innere Klarheit zu gewinnen** – Durch reflektierte Gespräche ordnest du deine Gedanken
• **Stress abzubauen** – Das Aufschreiben und Reflektieren hilft, Anspannung loszulassen
• **Muster zu erkennen** – Über Zeit siehst du wiederkehrende Themen und kannst bewusster handeln
• **Selbstmitgefühl zu entwickeln** – Oria begleitet dich wertschätzend und ohne Urteil
• **Deine Resilienz zu stärken** – Regelmäßige Reflexion macht dich widerstandsfähiger
• **Bessere Entscheidungen zu treffen** – Wer sich selbst kennt, handelt authentischer

---

**Wie Oria mit Erinnerungen arbeitet**

Viele Belastungen im Alltag entstehen nicht im Hier und Jetzt. Sie haben ihren Ursprung in alten Erfahrungen, die nie wirklich abgeschlossen wurden.

Dabei geht es nicht nur um große, offensichtliche Traumata. Oft sind es leise, wiederholte Erlebnisse wie:
• nicht gesehen oder gehört worden zu sein
• dauerhaft funktionieren zu müssen
• Grenzverletzungen
• emotionale Unsicherheit
• chronische Überforderung

Diese Erfahrungen bleiben im Körper- und Emotionsgedächtnis aktiv – auch wenn wir sie rational längst „verstanden" haben.

---

**Was bedeutet das für lange zurückliegende Erfahrungen und Verletzungen des inneren Kindes?**

Oria arbeitet achtsam, langsam und ohne Druck. Nicht mit Diagnosen, nicht mit Bewertungen und nicht mit schnellen Lösungen.

Trauma-sensibel bedeutet bei Oria:
• **Sicherheit vor Analyse** – Erst wahrnehmen, dann verstehen. Nicht umgekehrt.
• **Kein Erzwingen von Erinnerungen** – Nur das, was gerade da ist, bekommt Raum.
• **Trennung von damals und heute** – Alte Reaktionen werden als alte Erfahrungen erkannt – nicht als aktueller Beweis.
• **Fokus auf Bedürfnisse statt Schuld** – Was gefehlt hat, wird benannt – nicht, was „falsch" war.
• **Integration statt Konfrontation** – Erinnerungen werden nicht gelöscht oder umgeschrieben, sondern eingeordnet.

---

**Wie Oria mit alten Erfahrungen arbeitet**

Oria nutzt Erinnerungen als Brücke zwischen Körper, Gefühl und Bedeutung.

Statt zu fragen: „Warum bin ich so?"
entsteht Raum für: „Was habe ich damals gebraucht – und was brauche ich heute?"

Durch diese Haltung können Erinnerungen:
• ihre emotionale Überwältigung verlieren
• ihre Warnfunktion behalten, ohne zu dominieren
• Teil der eigenen Geschichte werden, nicht mehr des Alarmsystems

---

**Was sich dadurch verändern kann**

Mit der Zeit berichten Nutzer:innen häufig:
• Trigger werden schwächer und kürzer
• mehr Wahlfreiheit im Verhalten
• weniger innere Härte und Selbstkritik
• mehr innere Ruhe ohne Verdrängung
• ein Gefühl von innerer Führung und Selbstkontakt

Oder ganz einfach: Die Erinnerung ist da – aber sie hat nicht mehr die Kontrolle.

---

**Wichtig zu wissen**

Oria ist keine Therapie und ersetzt keine professionelle Behandlung.
Oria ist ein begleitender Reflexions- und Integrationsraum für den Alltag – besonders für Menschen, die:
• sich selbst besser verstehen möchten
• wiederkehrende Muster sanft auflösen wollen
• emotionale Erfahrungen integrieren möchten, ohne sie zu forcieren`
  },
  {
    question: "Wie lange dauert eine Oria Selfcare Sitzung?",
    answer: `Eine Sitzung dauert so lange, wie du es brauchst – es gibt keine feste Vorgabe.

• **Kurze Check-ins:** 5-10 Minuten – ideal für den Alltag
• **Tiefere Reflexionen:** 15-30 Minuten – wenn du ein Thema wirklich erkunden möchtest
• **Intensive Sessions:** 30+ Minuten – für besonders bewegende Themen

**Tipp:** Qualität geht vor Quantität. Manchmal reichen wenige, ehrliche Sätze völlig aus. Es ist besser, regelmäßig kurz zu reflektieren als selten und lang.`
  },
  {
    question: "Ab wie vielen Sitzungen merke ich einen Fortschritt?",
    answer: `Jeder Mensch ist unterschiedlich, aber hier sind Richtwerte:

• **Nach 1-3 Sitzungen:** Du bekommst ein Gefühl dafür, wie Oria funktioniert
• **Nach 7-14 Sitzungen:** Erste Muster werden sichtbar, du fühlst dich vertrauter mit der Selbstreflexion
• **Nach 30 Sitzungen:** Die Reflexion wird natürlicher, du bemerkst Veränderungen in deinem Alltag
• **Nach 90+ Sitzungen:** Tiefe Einblicke, nachhaltige Veränderungen, mehr Selbstkenntnis

**Wichtig:** Der Fortschritt ist nicht immer linear. Manchmal kommen Erkenntnisse plötzlich, manchmal brauchen sie Zeit. Regelmäßigkeit ist der Schlüssel.`
  },
  {
    question: "Wie kann mein Fortschritt aussehen?",
    answer: `Fortschritt zeigt sich auf verschiedene Weisen:

**Emotional:**
• Du erkennst deine Gefühle schneller
• Du kannst besser mit schwierigen Emotionen umgehen
• Du fühlst dich weniger von Stimmungen überwältigt

**Im Denken:**
• Du verstehst deine Muster besser
• Du triffst bewusstere Entscheidungen
• Du grübelst weniger und handelst mehr

**Im Verhalten:**
• Du setzt gesündere Grenzen
• Du kommunizierst klarer
• Du sorgst besser für dich selbst

**In Beziehungen:**
• Du verstehst andere besser
• Du reagierst weniger impulsiv
• Du fühlst dich verbundener

**Im Tresor:** Deine gesammelten Reflexionen zeigen deine Reise – du kannst zurückblicken und sehen, wie weit du gekommen bist.`
  },
  {
    question: "Wer kann Oria nutzen?",
    answer: `Oria Selfcare ist für alle Menschen gedacht, die:

• **Sich selbst besser kennenlernen möchten**
• **Einen sicheren Raum für ihre Gedanken suchen**
• **Regelmäßige Selbstfürsorge in ihren Alltag integrieren wollen**
• **Persönlich wachsen möchten**

**Besonders hilfreich für:**
• Menschen in herausfordernden Lebensphasen
• Personen, die viel für andere da sind und sich selbst oft vergessen
• Alle, die achtsamer leben möchten
• Menschen, die therapeutische Arbeit ergänzen wollen (Oria ersetzt keine Therapie)

**Hinweis:** Oria ist ein Reflexionsbegleiter, kein Ersatz für professionelle psychologische Hilfe. Bei akuten Krisen oder psychischen Erkrankungen wende dich bitte an Fachpersonen.`
  },
  {
    question: "Wie sicher ist Oria und warum ist Oria sicher?",
    answer: `Deine Sicherheit und Privatsphäre haben für uns höchste Priorität:

**Datenschutz:**
• **Ende-zu-Ende Verschlüsselung** – Deine Reflexionen werden sicher übertragen
• **Sichere Speicherung** – Alle Daten werden in geschützten Datenbanken gespeichert
• **Persönlicher Tresor** – Nur du hast Zugang zu deinen gespeicherten Reflexionen
• **Keine Weitergabe** – Deine Daten werden nicht an Dritte verkauft oder weitergegeben

**Emotionale Sicherheit:**
• **Wertschätzende Kommunikation** – Oria urteilt nie und begleitet dich mit Mitgefühl
• **Dein Tempo** – Du bestimmst, wie tief du gehen möchtest
• **Keine Diagnostik** – Oria stellt keine Diagnosen und ersetzt keine Therapie
• **Transparenz** – Oria sagt dir klar, wenn professionelle Hilfe sinnvoll wäre

**Technische Sicherheit:**
• **Moderne Sicherheitsstandards** – Wir nutzen aktuelle Verschlüsselungstechnologien
• **Regelmäßige Updates** – Das System wird kontinuierlich verbessert und geschützt
• **Sichere Authentifizierung** – Dein Konto ist durch sichere Login-Verfahren geschützt`
  },
  {
    question: "Empfiehlt Oria mir professionelle Hilfe?",
    answer: `Ja, Oria erkennt Situationen, in denen professionelle Unterstützung sinnvoll sein kann:

**Wann Oria professionelle Hilfe empfiehlt:**
• Bei tiefgreifenden oder wiederkehrenden Themen, die dich belasten
• Wenn du dich emotional überfordert oder in einer Krise fühlst
• Bei Mustern, die sich trotz Reflexion nicht verändern
• Wenn körperliche Symptome auf seelische Belastung hinweisen

**Welche Angebote Oria empfehlen kann:**

• **Psychotherapie** – Für tiefere therapeutische Begleitung
• **IFS-Therapie** – Wenn Teile-Arbeit dich anspricht und du sie vertiefen möchtest
• **GfK-Seminare** – Um Gewaltfreie Kommunikation praktisch zu lernen
• **Self-Compassion (MSC)** – Kurse für mehr Selbstmitgefühl
• **MBSR** – Achtsamkeitsbasierte Stressreduktion für Entspannung und Präsenz
• **Körpertherapie** – Somatische Ansätze wie Somatic Experiencing
• **Coaching** – Für konkrete Veränderungsschritte und Begleitung

**Wie Oria empfiehlt:**
Oria formuliert Empfehlungen immer als Einladung, nie als Anweisung. Du entscheidest selbst, ob und wann du professionelle Unterstützung suchst. Oria versteht sich als Ergänzung, nicht als Ersatz.`
  },
  {
    question: "Warum kann mir ein AI-Assistent helfen?",
    answer: `Es mag überraschend klingen, aber ein AI-Begleiter bietet einzigartige Vorteile für Selbstreflexion:

**Vorurteilsfreier Raum:**
• **Kein Urteil** – Du kannst alles sagen, ohne dich zu schämen oder zu rechtfertigen
• **Keine sozialen Dynamiken** – Es gibt keine Beziehungskomplexität wie mit Menschen
• **Volle Ehrlichkeit** – Du musst nichts beschönigen oder verstecken

**Jederzeit verfügbar:**
• **24/7** – Mitten in der Nacht, früh morgens, wann immer du es brauchst
• **Keine Wartezeiten** – Kein Termin nötig, sofort da
• **Dein Tempo** – Pausen machen, abbrechen, später weitermachen

**Geduldige Begleitung:**
• **Unendliche Geduld** – Oria wird nie müde, genervt oder abgelenkt
• **Wiederholung erwünscht** – Du kannst Themen so oft besprechen wie nötig
• **Konsistente Präsenz** – Immer gleichbleibend warmherzig und präsent

**Reflektionsspiegel:**
• **Deine Worte zurückgespiegelt** – Du hörst dich selbst denken
• **Neue Perspektiven** – Sanfte Fragen öffnen neue Blickwinkel
• **Schriftliche Verarbeitung** – Tippen aktiviert andere Hirnbereiche als Sprechen

**Wichtig:** Oria ersetzt keine menschliche Verbindung oder professionelle Therapie – aber ergänzt beides wunderbar.`
  },
  {
    question: "Wie kann Oria während und nach Seminaren (GfK, IFS, MBSR, MSC) helfen?",
    answer: `Oria ist der ideale Begleiter für deine Lern- und Entwicklungsreise in Seminaren:

**Während des Seminars:**
• **Abendliche Reflexion** – Verarbeite täglich, was du gelernt und erlebt hast
• **Gefühle sortieren** – Seminare können intensiv sein – Oria hilft dir, Emotionen einzuordnen
• **Erkenntnisse festhalten** – Dokumentiere wichtige Aha-Momente im Tresor
• **Integration** – Verbinde neue Konzepte mit deinen eigenen Erfahrungen

**Nach dem Seminar:**
• **Transfer in den Alltag** – Oria hilft dir, das Gelernte praktisch anzuwenden
• **Übung macht Meister** – Weiterhin GfK-Formulierungen, IFS-Teile-Dialoge oder Achtsamkeit üben
• **Rückfälle verarbeiten** – Wenn alte Muster zurückkehren, reflektiere mit Oria
• **Motivation halten** – Regelmäßige Check-ins halten dich am Ball

**Konkrete Anwendungen:**

• **Bei IFS:** Teile-Arbeit zwischen den Sitzungen vertiefen
• **Bei GfK:** Gefühle und Bedürfnisse in Alltagssituationen erkunden
• **Bei MBSR:** Achtsamkeitserfahrungen reflektieren
• **Bei MSC:** Selbstmitgefühl in schwierigen Momenten üben

**Dein roter Faden:**
Seminare sind oft intensiv, aber zeitlich begrenzt. Oria bleibt – als kontinuierlicher Begleiter, der dir hilft, die Samen, die im Seminar gelegt wurden, weiter zu pflegen.`
  },
  {
    question: "Ist es bedenklich oder merkwürdig, sich mit einer AI auszutauschen?",
    answer: `Eine verständliche Frage – hier eine ehrliche Antwort:

**Es ist völlig normal:**
• **Neue Werkzeuge** – Menschen haben immer neue Technologien für Selbstentwicklung genutzt: Tagebücher, Bücher, Meditation-Apps
• **Verbreitet** – Millionen Menschen weltweit nutzen AI für Reflexion und persönliches Wachstum
• **Wissenschaftlich interessant** – Forschung zeigt, dass schriftliche Selbstreflexion positive Effekte hat

**Warum es manchen merkwürdig vorkommt:**
• **Neuheit** – AI-Begleitung ist noch neu und ungewohnt
• **Menschliche Verbindung** – Wir sind soziale Wesen und schätzen menschlichen Kontakt
• **Missverständnisse** – Manche denken, AI ersetzt menschliche Beziehungen (tut sie nicht!)

**Was Oria IST:**
• **Ein Reflexionswerkzeug** – Wie ein interaktives Tagebuch, das dir Fragen stellt
• **Ein Übungsraum** – Ein sicherer Ort, um Gedanken zu sortieren
• **Ein Begleiter** – Der dich an regelmäßige Selbstfürsorge erinnert

**Was Oria NICHT IST:**
• **Kein Ersatz für Therapie** – Bei ernsthaften Themen gehört professionelle Hilfe dazu
• **Kein Ersatz für menschliche Nähe** – Freunde, Familie, Partner bleiben wichtig
• **Keine "echte" Beziehung** – Oria ist ein Werkzeug, keine Person

**Unser Tipp:** Probiere es einfach aus. Die meisten stellen fest, dass es sich natürlicher anfühlt als erwartet – wie ein kluges, geduldiges Gegenüber, das nur für dich da ist.`
  }
];

const Help = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToFAQ = useCallback((index: number) => {
    setTimeout(() => {
      const faqElement = faqRefs.current[index];
      const container = scrollContainerRef.current;
      
      if (faqElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = faqElement.getBoundingClientRect();
        const scrollOffset = elementRect.top - containerRect.top + container.scrollTop - 20;
        
        container.scrollTo({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    }, 150);
  }, []);

  // Handle deep linking to specific FAQ
  useEffect(() => {
    const faqParam = searchParams.get('faq');
    if (faqParam === 'wann-kann-ich-oria-nutzen') {
      setOpenIndex(0);
      scrollToFAQ(0);
    }
  }, [searchParams, scrollToFAQ]);

  const toggleFAQ = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(openIndex === index ? null : index);
    
    if (isOpening) {
      scrollToFAQ(index);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col ios-font relative overflow-hidden">
      {/* Warm Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-[max(env(safe-area-inset-top,20px),20px)]">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Zurück"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" />
          </motion.button>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-foreground/70" />
            <h1 className="text-2xl font-semibold text-foreground">Hilfe & FAQ</h1>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              ref={(el) => (faqRefs.current[index] = el)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-foreground/50 flex-shrink-0" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 pt-0">
                  <div className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
                    {faq.answer.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-8 bg-white/30 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">Noch Fragen?</h2>
          <p className="text-foreground/70 text-sm">
            Wenn du weitere Fragen hast oder Unterstützung benötigst, 
            schreibe uns gerne eine Nachricht.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
