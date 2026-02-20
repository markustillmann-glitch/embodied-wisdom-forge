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
  },
  {
    question: "Was sind Trigger-Karten und wie helfen sie mir?",
    answer: `Trigger-Karten sind dein persönliches Nachschlagewerk für emotionale Reaktionsmuster. Sie helfen dir zu verstehen, **warum** du in bestimmten Situationen so stark reagierst – und was du tun kannst.

**Für wen sind Trigger-Karten besonders geeignet?**
Trigger-Karten eignen sich besonders gut für Menschen, die bereits **erste Erfahrungen mit IFS (Internal Family Systems) und/oder GfK (Gewaltfreie Kommunikation)** gesammelt haben. Die Karten verwenden Konzepte wie:
• **Innere Anteile** (Manager, Feuerwehr, Exilanten) aus dem IFS-Modell
• **Bedürfnisse** (Sicherheit, Zugehörigkeit, Autonomie) aus der GfK
• **Körpersignale** als Brücke zur somatischen Intelligenz

Wenn dir diese Begriffe vertraut sind, wirst du die Karten intuitiv verstehen und sofort mit der Arbeit beginnen können. Aber auch ohne Vorkenntnisse sind die Karten nutzbar – sie erklären sich in ihrem Kontext und können ein **Einstieg** in diese Denkweisen sein.

**Was jede Karte enthält:**
• **Die Trigger-Situation** – Was passiert äußerlich?
• **Was innerlich geschieht** – Welche Schutzmechanismen werden aktiv? (IFS-Perspektive: Welcher Anteil übernimmt?)
• **Körpersignale** – Wie dein Körper reagiert (Anspannung, Herzrasen, etc.)
• **Das dahinterliegende Bedürfnis** – Was du eigentlich brauchst (GfK-Perspektive)
• **Regulationstechniken** – Konkrete Übungen zur Beruhigung
• **Reframing** – Ein neuer, heilsamer Blickwinkel
• **Integrationsfrage** – Eine tiefe Frage zum Mitnehmen

**200 Karten in 10 Lebensbereichen:**
Beziehung, Leistung, Familie, Selbstwert, Sicherheit, Intimität, Status, Sinn, Körper und Zukunft.

**Wie du sie nutzt:**
1. Stöbere durch die Kategorien oder mache den Selbsttest
2. Speichere Karten, die dich ansprechen
3. Starte direkt eine Reflexion mit Oria zu einer Karte

**Tipp:** Wenn du neu bei IFS und GfK bist, nutze den Modus **"Frag Oria"** – dort kannst du Oria jederzeit fragen, was Begriffe wie "Manager-Anteil" oder "Bedürfnis nach Autonomie" bedeuten.`
  },
  {
    question: "Wie funktioniert der Trigger-Selbsttest?",
    answer: `Der Trigger-Selbsttest hilft dir herauszufinden, welche Lebensbereiche bei dir besonders sensibel sind.

**So funktioniert es:**
• Du beantwortest Fragen zu verschiedenen Alltagssituationen
• Der Test erkennt, in welchen Bereichen du besonders stark reagierst
• Am Ende bekommst du eine Übersicht deiner Trigger-Sensibilität

**Nach dem Test:**
• Du siehst, welche Kategorien für dich am relevantesten sind
• Du kannst direkt die passenden Trigger-Karten erkunden
• Du bekommst ein besseres Bild deiner emotionalen Landkarte

**Tipp:** Der Test ist keine Diagnose. Er ist ein Kompass, der dir zeigt, wo du genauer hinschauen könntest.`
  },
  {
    question: "Was sind eigene Trigger-Karten und wie erstelle ich sie?",
    answer: `Neben den 200 vorgefertigten Karten kannst du auch **eigene Trigger-Karten** erstellen – passgenau für deine persönlichen Situationen.

**So funktioniert es:**
Oria führt dich in einem kurzen Dialog durch 4-5 einfache Fragen:
1. **Deine Trigger-Situation** – Was passiert genau?
2. **Deine Gefühle & Körperreaktionen** – Was spürst du dabei?
3. **Dein Reaktionsmuster** – Wie reagierst du automatisch?
4. **Dein Bedürfnis** – Was brauchst du eigentlich?

Aus deinen Antworten erstellt Oria eine vollständige, persönliche Trigger-Karte mit allen Elementen: Körpersignale, Regulationstechniken, Reframing und mehr.

**Du kannst auch bestehende Karten personalisieren:**
Wenn dich eine der 200 Karten anspricht, kannst du sie über den "Personalisieren"-Button in eine eigene Karte umwandeln. Dabei passt Oria die Inhalte an deine persönlichen Erfahrungen an.

**Deine eigenen Karten:**
• Werden in einem separaten Tab "Eigene" gespeichert
• Können jederzeit gelöscht werden
• Dienen wie alle Karten als Startpunkt für Reflexionen mit Oria`
  },
  {
    question: "Wie nutze ich Trigger-Karten für eine Reflexion mit Oria?",
    answer: `Jede Trigger-Karte hat einen **"Mit Oria reflektieren"**-Button. Damit startest du eine geführte Reflexion, die genau auf das Thema der Karte zugeschnitten ist.

**Was passiert dabei:**
• Oria kennt den Kontext der Karte (innere Geschichte, Bedürfnis, Körpersignale)
• Das Gespräch beginnt nicht bei null, sondern dort, wo die Karte aufhört
• Du kannst tiefer in dein persönliches Erleben eintauchen

**Wann ist das besonders hilfreich?**
• Wenn du eine Trigger-Situation gerade erlebt hast
• Wenn du ein Muster verstanden hast und es vertiefen möchtest
• Wenn du die Regulationstechniken üben willst
• Wenn du spürst, dass hinter dem Trigger noch mehr steckt

**Tipp:** Speichere Karten, die dich besonders ansprechen. So findest du sie schnell wieder, wenn du sie brauchst.`
  },
  {
    question: "Wie läuft eine Reflexion mit Oria ab?",
    answer: `Der Reflexionsprozess mit Oria folgt einem sanften, strukturierten Ablauf – du wirst Schritt für Schritt begleitet.

**So läuft es ab:**

1. **Impuls oder Situation wählen**
   • Du bekommst einen zufälligen Selfcare-Impuls oder beschreibst eine Situation, die dich beschäftigt

2. **Erste Resonanz teilen**
   • Oria fragt dich, was der Impuls oder die Situation in dir auslöst
   • Du teilst deine ersten Gedanken und Gefühle

3. **Gefühle & Körper erkunden**
   • Welches Gefühl entsteht? Wo spürst du es im Körper?
   • Oria hilft dir, die Verbindung zwischen Emotion und Körper zu erkennen

4. **Bedürfnisse entdecken**
   • Was brauchst du eigentlich gerade?
   • Oria nutzt das Oria-Modell (IFS, GfK), um dir zu helfen, deine tieferen Bedürfnisse zu verstehen

5. **Integration & nächster Schritt**
   • Oria fragt: Wo und wie wurde dieses Bedürfnis in den letzten Wochen und Monaten erfüllt?
   • Du spürst nach, wie sich das angefühlt hat
   • Daraus entsteht ein kleiner, liebevoller nächster Schritt

6. **Abschluss**
   • Du entscheidest: Möchtest du das Thema vertiefen oder die Reflexion im Tresor speichern?

**Gut zu wissen:**
• Das Gespräch dauert ca. **5–7 Minuten**
• Oria passt sich deinem Tempo an – knappe oder ausführliche Antworten sind gleichermaßen willkommen
• Du kannst jederzeit abbrechen oder das Thema wechseln`
  },
  {
    question: "Was ist der Bereich 'Meine Anteile' im Tresor?",
    answer: `Der Bereich **"Meine Anteile"** ist ein persönliches Sammelalbum für innere Anteile (Parts), die du in IFS-Meditationen kennengelernt hast. Jeder Anteil wird als Spielkarte dargestellt – mit einem KI-generierten Bild und allen wichtigen Informationen.

**Wofür ist das gut?**
• Du dokumentierst deine inneren Anteile an einem sicheren Ort
• Du behältst den Überblick über dein inneres System
• Du kannst Veränderungen und Fortschritte im Integrationsprozess festhalten
• Die visuelle Darstellung als Karte macht abstrakte innere Erfahrungen greifbarer
• Du stärkst die Beziehung zu deinen Anteilen, indem du sie bewusst wahrnimmst und festhältst

**Die 10 Dimensionen der Anteilserfassung:**

Jeder Anteil kann entlang von 10 therapeutisch fundierten Dimensionen erfasst werden, die direkt aus dem IFS-Modell (Internal Family Systems) nach Richard C. Schwartz abgeleitet sind:

**1. 🛡️ Rolle im System**
Im IFS gibt es drei Hauptrollen:
• **Exil** – Trägt den ursprünglichen Schmerz (Verletzung, Scham, Einsamkeit). Exilanten wurden oft in der Kindheit "weggesperrt", weil ihre Gefühle zu überwältigend waren.
• **Manager** – Kontrolliert präventiv, um zu verhindern, dass Exile aktiviert werden. Typische Manager: der Perfektionist, der Planer, der Kritiker.
• **Feuerwehr** – Reagiert impulsiv, wenn ein Exil trotzdem durchbricht. Typische Strategien: Essen, Ablenkung, Wut, Rückzug, Substanzen.
• **Mischform** – Manche Anteile erfüllen mehrere Rollen je nach Kontext.
Die zentrale Frage: *Wovor schützt dieser Anteil das System?*

**2. 🔥 Auslöser (Trigger)**
Ohne Triggeranalyse bleibt die Arbeit unscharf. Erfasst wird:
• *Wann* wird der Anteil aktiv? (Situationen, Tageszeiten)
• *Bei welchen Personen?* (Partner, Eltern, Autoritäten, Fremde)
• *In welchen Kontexten?* (Arbeit, Beziehung, Alleinsein, Gruppen)
• *Körperliche Zustände?* (Müdigkeit, Hunger, Überstimulation)

**3. 💔 Kernemotion**
Jeder Anteil trägt ein primäres Gefühl:
• Angst, Scham, Wut, Trauer, Einsamkeit, Ohnmacht
**Wichtig:** Manager zeigen oft *sekundäre* Emotionen – z.B. Ärger statt der darunterliegenden Angst. Die wahre Kernemotion liegt häufig eine Schicht tiefer.

**4. 🌱 Dahinterliegendes Bedürfnis (GFK-Brücke)**
Hinter jeder Schutzstrategie steht ein unerfülltes Bedürfnis. Die App nutzt hier die Brücke zur Gewaltfreien Kommunikation (GFK):
• Sicherheit, Zugehörigkeit, Autonomie, Wertschätzung, Kontrolle, Orientierung, Bedeutung
Hier entsteht die eigentliche **Integrationsarbeit**: Wenn das Bedürfnis erkannt wird, kann Self es auf neue Weise erfüllen.

**5. 💭 Glaubenssatz / Innere Logik**
Jeder Anteil hat eine tief verankerte Überzeugung, die seine Schutzstrategie begründet:
• *„Wenn ich nicht perfekt bin, werde ich abgelehnt."*
• *„Nähe ist gefährlich."*
• *„Ich muss stark sein, sonst bricht alles zusammen."*
Diese Glaubenssätze sind die innere Logik des Anteils – sie waren einmal sinnvoll und schützend.

**6. 👶 Alter / Entwicklungszeit**
Viele Anteile (besonders Exile) sind in einem bestimmten Lebensalter "eingefroren":
• 4–6 Jahre → häufig Scham, Verlassenheit
• 8–10 Jahre → Vergleich, Leistungsdruck
• Pubertät → Autonomiekonflikte, Identität
Die Frage lautet: *Wie alt fühlt sich dieser Anteil an?* – nicht wie alt du warst, sondern wie alt der Anteil *jetzt noch* wirkt.

**7. 🫁 Körperort**
Anteile manifestieren sich oft an bestimmten Stellen im Körper:
• **Brust** = Bindung, Sehnsucht
• **Bauch** = Angst, Unsicherheit
• **Hals** = Unterdrückte Stimme, nicht Gesagtes
• **Schultern** = Verantwortung, Last
Das Spüren des Körperorts hilft bei der Regulation und beim Zugang zum Anteil in Meditationen.

**8. 🔗 Beziehung zu anderen Anteilen**
IFS ist Systemarbeit, keine Einzelarbeit. Wichtige Fragen:
• Wer bekämpft wen?
• Wer schützt wen?
• Wer dominiert im System?
• Wer wird unterdrückt oder ignoriert?

**9. ⚖️ Grad der Polarisierung**
Viele Anteile stehen in einem Spannungsverhältnis zueinander:
• Antreiber vs. Erschöpfter Anteil
• Nähebedürfnis vs. Autonomiebedürfnis
• Kontrolleur vs. Rebell
Polarisierung ist oft **zentraler als das Trauma selbst** – zwei Anteile halten sich gegenseitig in Schach und blockieren Veränderung.

**10. 🤝 Vertrauen in Self**
Die zentrale Frage in IFS: Hat dieser Anteil Vertrauen in dein Self (dein wahres, mitfühlendes Kern-Selbst)?
• Misstraut er dir? Glaubt er, er muss selbst die Führung übernehmen?
• Hat er Self je wirklich erlebt?
• Auf einer Skala von 0–10: Wie viel Vertrauen besteht aktuell?
Das Ziel der IFS-Arbeit ist, dass alle Anteile Self vertrauen und ihre extremen Rollen loslassen können.`
  },
  {
    question: "Brauche ich IFS-Erfahrung für die Anteilserfassung?",
    answer: `**Ja, IFS-Meditationserfahrung ist sehr empfehlenswert.**

Die Anteilserfassung ist kein Selbstlernwerkzeug für IFS, sondern ein **Begleitwerkzeug für Menschen, die bereits mit IFS arbeiten** – sei es in Therapie, Coaching oder eigenständiger Meditationspraxis.

**Warum ist IFS-Erfahrung wichtig?**
• Die Begriffe wie "Manager", "Feuerwehr", "Exilant" und "Self" stammen aus dem IFS-Modell (Internal Family Systems) und haben spezifische Bedeutungen
• Anteile zeigen sich in der Regel erst durch achtsame, angeleitete Innenschau – nicht durch bloßes Nachdenken
• Ohne Meditationserfahrung besteht die Gefahr, Anteile intellektuell zu "konstruieren" statt sie wirklich zu erleben
• Der Kontakt mit Exilanten (verletzten inneren Kindern) erfordert einen sicheren Rahmen und Self-Energie

**Wann ist der richtige Zeitpunkt?**
• Du hast bereits in einer IFS-Meditation einen Anteil kennengelernt
• Du konntest Kontakt zu diesem Anteil aufnehmen und ihn wahrnehmen
• Du möchtest das Erlebte festhalten, um es nicht zu vergessen

**Tipp:** Nutze die Anteilskarten als **Reflexionstagebuch** nach deinen Meditationen. So baust du nach und nach eine Landkarte deines inneren Systems auf.`
  },
  {
    question: "Wie funktioniert die KI-Bildgenerierung für Anteile?",
    answer: `Jede Anteilskarte kann ein **KI-generiertes Bild** enthalten, das deinen inneren Anteil visuell darstellt.

**So gehst du vor:**
1. Erstelle oder bearbeite einen Anteil im Tresor
2. Fülle das Feld **"Bildbeschreibung für AI-Generierung"** aus
3. Beschreibe, wie du dir diesen Anteil vorstellst – z.B. Alter, Aussehen, Umgebung, Stimmung
4. Speichere den Anteil
5. Tippe auf den **Zauberstab (🪄)** auf der Karte, um das Bild zu generieren

**Tipps für gute Beschreibungen:**
• "Ein kleines Mädchen, ca. 5 Jahre, sitzt allein in einem dunklen Raum und hält ein Licht"
• "Ein starker Ritter in goldener Rüstung, der vor einer Mauer steht und alles beschützt"
• "Eine weise, alte Frau in einem Garten voller Blumen, die ruhig lächelt"

Die Bilder werden im **Fantasy-Spielkarten-Stil** generiert – künstlerisch, symbolisch und emotional. Du kannst das Bild jederzeit neu generieren, indem du die Beschreibung änderst und erneut auf den Zauberstab tippst.`
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
      
      {/* Header - Sticky */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/30 pt-[max(env(safe-area-inset-top),20px)]">
        <div className="px-6 py-3 flex items-center gap-4">
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
            <h1 className="text-xl font-semibold text-foreground">Hilfe & FAQ</h1>
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto px-6 pb-[max(env(safe-area-inset-bottom,24px),24px)]">
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
