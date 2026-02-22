type Lang = 'de' | 'en';

type LangText = Record<Lang, string>;

export const modellContent = {
  hero: {
    title: {
      de: 'Innere Führung durch gelebte Erinnerungen',
      en: 'Inner Guidance Through Lived Memories'
    } as LangText,
    badge: {
      de: 'Das Inner Compass Framework',
      en: 'The Inner Compass Framework'
    } as LangText,
    subtitle: {
      de: 'Für mehr Klarheit in Zeiten konstanter Überforderung.',
      en: 'For more clarity in times of constant overwhelm.'
    } as LangText,
  },
  intro: {
    p1: {
      de: 'Das Handlungsmodell hinter der Oria Selfcare App verbindet moderne Neurobiologie und Epigenetik mit praktischer Selbstführungskompetenz.',
      en: 'The action model behind the Oria Selfcare App connects modern neurobiology and epigenetics with practical self-leadership competence.'
    } as LangText,
    p2: {
      de: 'Kein Ratgeber oder Theoriemodell, sondern Landkarte, praktischer Wegweiser und Transformationshilfe für das menschliche Betriebssystem unter Druck.',
      en: 'Not a guidebook or theoretical model, but a map, practical guide, and transformation aid for the human operating system under pressure.'
    } as LangText,
  },
  ch1: {
    title: {
      de: 'Vorwort: Wenn viel auf dem Spiel steht',
      en: 'Foreword: When Much Is at Stake'
    } as LangText,
    subtitle: {
      de: 'Weshalb dieses Wissen entscheidend ist für Führung, Selbststeuerung – und jeden neugierigen Menschen.',
      en: 'Why this knowledge is crucial for leadership, self-management – and every curious person.'
    } as LangText,
    p1: {
      de: 'In der modernen Führung – sei es von Unternehmen, Teams oder dem eigenen Leben – stoßen rein kognitive Strategien an ihre Grenzen. Wir wissen oft intellektuell, was die richtige Entscheidung oder die richtige Art der Kommunikation wäre. Doch unter Druck, Zeitmangel oder in Konflikten greifen wir auf automatisierte Muster zurück.',
      en: 'In modern leadership – whether of companies, teams, or one\'s own life – purely cognitive strategies reach their limits. We often intellectually know what the right decision or communication style would be. But under pressure, time constraints, or in conflicts, we fall back on automated patterns.'
    } as LangText,
    highlight1: {
      de: 'Wir handeln nicht nach unserem besten Wissen, sondern nach unserem am tiefsten verankerten Zustand.',
      en: 'We don\'t act according to our best knowledge, but according to our most deeply anchored state.'
    } as LangText,
    p2: {
      de: 'Dieses Framework schließt die Lücke zwischen dem Anspruch („Ich will besonnen und strategisch handeln") und der Realität („Ich wurde getriggert und habe reagiert").',
      en: 'This framework closes the gap between aspiration ("I want to act thoughtfully and strategically") and reality ("I was triggered and reacted").'
    } as LangText,
    quote1: {
      de: 'Der Mensch ist kein denkendes Wesen mit einem Körper – sondern ein verkörpertes Wesen, das denken gelernt hat.',
      en: 'Humans are not thinking beings with a body – but embodied beings who have learned to think.'
    } as LangText,
    p3: {
      de: 'Erinnerungen, Impulse, Vorurteile (Bias) und Selbstbilder entstehen nicht primär im Kopf. Sie entstehen in einem Zusammenspiel aus Körperzustand, uralten Überlebensprogrammen, epigenetischem Erbe und inneren Anteilen.',
      en: 'Memories, impulses, biases, and self-images don\'t primarily originate in the head. They arise from an interplay of body state, ancient survival programs, epigenetic heritage, and inner parts.'
    } as LangText,
    p4: {
      de: 'Wer führt, führt nicht nur Köpfe, sondern reguliert Nervensysteme – zuerst das eigene, dann das des Systems. Dieses Kompendium liefert die Architektur dafür.',
      en: 'Those who lead don\'t just lead minds, but regulate nervous systems – first their own, then the system\'s. This compendium provides the architecture for that.'
    } as LangText,
    p5: {
      de: 'Doch dieses Wissen ist nicht nur für Führungskräfte oder Menschen in Krisen relevant. Es ist für jeden, der neugierig ist, sich selbst besser zu verstehen – unabhängig von Alter, Beruf oder Lebenssituation. Die Frage „Warum reagiere ich so, wie ich reagiere?" ist universell menschlich.',
      en: 'But this knowledge isn\'t just relevant for leaders or people in crisis. It\'s for anyone curious about understanding themselves better – regardless of age, profession, or life situation. The question "Why do I react the way I react?" is universally human.'
    } as LangText,
  },
  ch2: {
    title: { de: 'Kapitel 1: Was Erinnerung wirklich ist', en: 'Chapter 1: What Memory Really Is' } as LangText,
    s1_title: { de: '1.1 Erinnerung ist kein Archiv', en: '1.1 Memory Is Not an Archive' } as LangText,
    s1_p1: { de: 'Die verbreitetste Illusion über unser Gedächtnis ist die des „Videoarchivs". Wir glauben, wir rufen ab, was exakt gespeichert wurde. Das ist falsch.', en: 'The most widespread illusion about our memory is that of a "video archive". We believe we retrieve exactly what was stored. This is wrong.' } as LangText,
    s1_highlight: { de: 'Erinnerungen sind keine gespeicherten Filme, sondern rekonstruierte Zustände.', en: 'Memories are not stored films, but reconstructed states.' } as LangText,
    s1_p2: { de: 'Bei jedem Erinnern werden verschiedene Fragmente im Gehirn neu kombiniert:', en: 'With each act of remembering, different fragments in the brain are recombined:' } as LangText,
    s1_list: { de: ['Sinneseindrücke (Gerüche, Geräusche)', 'Damalige Emotionen', 'Aktuelle Körperzustände', 'Bedeutungen, die wir dem Ereignis heute geben'], en: ['Sensory impressions (smells, sounds)', 'Emotions from that time', 'Current body states', 'Meanings we assign to the event today'] },
    s1_conclusion: { de: 'Fazit: Jede Erinnerung ist keine Reise in die Vergangenheit, sondern aktive Gegenwartsarbeit. Wie wir uns heute fühlen, bestimmt, was wir von gestern erinnern.', en: 'Conclusion: Every memory is not a journey into the past, but active present-moment work. How we feel today determines what we remember from yesterday.' } as LangText,
    s2_title: { de: '1.2 Explizites vs. implizites Gedächtnis', en: '1.2 Explicit vs. Implicit Memory' } as LangText,
    s2_p1: { de: 'Um menschliches Verhalten zu verstehen, müssen wir zwei Speichersysteme unterscheiden:', en: 'To understand human behavior, we must distinguish between two storage systems:' } as LangText,
    s2_explicit_title: { de: '1. Explizites Gedächtnis', en: '1. Explicit Memory' } as LangText,
    s2_explicit_sub: { de: '(Der Verstand)', en: '(The Mind)' } as LangText,
    s2_explicit_items: { de: ['Fakten, Geschichten, chronologische Abläufe', 'Sprachlich und bewusst zugänglich'], en: ['Facts, stories, chronological sequences', 'Linguistically and consciously accessible'] },
    s2_explicit_quote: { de: '„Ich weiß noch, dass…"', en: '"I still remember that…"' } as LangText,
    s2_implicit_title: { de: '2. Implizites Gedächtnis', en: '2. Implicit Memory' } as LangText,
    s2_implicit_sub: { de: '(Der Körper & das Gefühl)', en: '(The Body & Feeling)' } as LangText,
    s2_implicit_items: { de: ['Körperreaktionen, automatisierte Erwartungen', 'Vorsprachlich, schneller und unbewusst'], en: ['Body reactions, automated expectations', 'Pre-linguistic, faster and unconscious'] },
    s2_implicit_quote: { de: '„Es fühlt sich plötzlich so an, als ob…"', en: '"It suddenly feels as if…"' } as LangText,
    s2_quote: { de: 'Das implizite Gedächtnis ist älter, schneller und hochgradig auf Sicherheit und Beziehung ausgerichtet. Es steuert unsere Sofortreaktionen.', en: 'The implicit memory is older, faster, and highly oriented toward safety and relationship. It controls our immediate reactions.' } as LangText,
    s3_title: { de: '1.3 Memory Trigger', en: '1.3 Memory Trigger' } as LangText,
    s3_p1: { de: 'Ein Trigger (Auslöser durch Musik, Orte, Tonlagen, soziale Situationen wie Kritik) öffnet nicht nur eine mentale Datei. Er aktiviert eine ganze „Zustandslandschaft".', en: 'A trigger (activated by music, places, tones of voice, social situations like criticism) doesn\'t just open a mental file. It activates an entire "state landscape".' } as LangText,
    s3_chain_label: { de: 'Ein Trigger aktiviert eine Kette:', en: 'A trigger activates a chain:' } as LangText,
    s3_chain: { de: 'Erinnerung (implizit) + Alter Körperzustand + Schutzstrategie + Aktuelles Bedürfnis', en: 'Memory (implicit) + Old body state + Protection strategy + Current need' } as LangText,
  },
  ch3: {
    title: { de: 'Kapitel 2: Das somatische Gedächtnis (Body Memory)', en: 'Chapter 2: Somatic Memory (Body Memory)' } as LangText,
    s1_title: { de: '2.1 Was der Körper speichert', en: '2.1 What the Body Stores' } as LangText,
    s1_p1: { de: 'Während der Verstand die „Story" speichert, speichert der Körper die „Energie" der Situation. Er registriert vor allem:', en: 'While the mind stores the "story", the body stores the "energy" of the situation. It primarily registers:' } as LangText,
    s1_list: { de: ['Alarm- vs. Sicherheitszustände', 'Bindungserfahrungen (War ich willkommen? War ich allein?)', 'Ohnmacht vs. Handlungsspielraum', 'Rhythmus, Atemmuster, muskuläre Spannung'], en: ['Alarm vs. safety states', 'Attachment experiences (Was I welcome? Was I alone?)', 'Helplessness vs. agency', 'Rhythm, breathing patterns, muscular tension'] },
    s1_highlight: { de: 'Der Körper speichert nicht primär „was passiert ist", sondern die Antwort auf die Frage: „Wie sicher war ich?"', en: 'The body doesn\'t primarily store "what happened", but the answer to the question: "How safe was I?"' } as LangText,
    s2_title: { de: '2.2 Warum der Körper schneller ist als das Denken', en: '2.2 Why the Body Is Faster Than Thinking' } as LangText,
    s2_p1: { de: 'Dies ist der entscheidende Punkt für Führung und Selbstmanagement unter Stress: Neurobiologisch reagieren der Körper und das limbische System (Emotionszentrum) in Millisekunden auf einen Reiz. Die Kognition (das bewusste Denken) folgt deutlich verzögert.', en: 'This is the crucial point for leadership and self-management under stress: Neurobiologically, the body and the limbic system (emotion center) react to a stimulus in milliseconds. Cognition (conscious thinking) follows with a significant delay.' } as LangText,
    s2_quote: { de: 'Das Denken ist oft nur der „Pressesprecher", der nachträglich erklärt (oder rationalisiert), was der Körper längst entschieden hat.', en: 'Thinking is often just the "spokesperson" that subsequently explains (or rationalizes) what the body has long since decided.' } as LangText,
    s2_p2: { de: 'Das erklärt Phänomene wie emotionale Überreaktionen und den Satz: „Ich weiß es rational besser, aber ich kann gerade nicht anders."', en: 'This explains phenomena like emotional overreactions and the statement: "I rationally know better, but I just can\'t help it right now."' } as LangText,
    s3_title: { de: '2.3 Body Memory ist nicht pathologisch', en: '2.3 Body Memory Is Not Pathological' } as LangText,
    s3_p1: { de: 'Das somatische Gedächtnis ist nicht „kaputt" oder irrational. Es ist ein hocheffizientes Schutzsystem, das auf vergangenen Erfahrungen basiert.', en: 'Somatic memory is not "broken" or irrational. It is a highly efficient protection system based on past experiences.' } as LangText,
    s4_title: { de: '2.4 Das Erbe in den Zellen: Epigenetik', en: '2.4 The Legacy in Our Cells: Epigenetics' } as LangText,
    s4_p1: { de: 'Das implizite Gedächtnis beginnt nicht erst mit der eigenen Geburt. Die Forschung der Epigenetik zeigt, dass traumatische Erfahrungen, langanhaltende Stresszustände oder existenzielle Krisen Marker auf der DNA hinterlassen, die vererbt werden können.', en: 'Implicit memory doesn\'t begin only at birth. Epigenetics research shows that traumatic experiences, prolonged stress states, or existential crises leave markers on DNA that can be inherited.' } as LangText,
    s4_p2: { de: 'Das bedeutet:', en: 'This means:' } as LangText,
    s4_list: { de: ['Ein Nervensystem kann mit einer erhöhten Alarmbereitschaft auf die Welt kommen, ohne selbst je Gefahr erlebt zu haben.', 'Bestimmte Trigger (z.B. Autorität, Mangel, Plötzlichkeit) aktivieren Ängste, die eigentlich die Realität der Eltern oder Großeltern widerspiegeln.'], en: ['A nervous system can come into the world with heightened alertness without ever having experienced danger itself.', 'Certain triggers (e.g. authority, scarcity, suddenness) activate fears that actually reflect the reality of parents or grandparents.'] },
    s4_quote: { de: 'Wir erinnern uns biologisch an die Krisen unserer Vorfahren. Das erklärt oft diffuse Ängste oder Blockaden, die „keinen Sinn ergeben", wenn wir nur auf die eigene Biografie schauen.', en: 'We biologically remember the crises of our ancestors. This often explains diffuse fears or blockages that "don\'t make sense" when we only look at our own biography.' } as LangText,
  },
  ch4: {
    title: { de: 'Kapitel 3: Meditation als Zugang (und Risiko)', en: 'Chapter 3: Meditation as Access (and Risk)' } as LangText,
    s1_title: { de: '3.1 Was Meditation wirklich macht', en: '3.1 What Meditation Really Does' } as LangText,
    s1_p1: { de: 'In diesem Kontext ist Meditation keine Entspannungstechnik, sondern ein Wahrnehmungswerkzeug. Sie tut drei Dinge:', en: 'In this context, meditation is not a relaxation technique, but a perception tool. It does three things:' } as LangText,
    s1_list: { de: ['Sie reduziert äußere Reize (Stille).', 'Sie erhöht die Interozeption (die Fähigkeit, Signale aus dem Körperinneren wahrzunehmen).', 'Sie senkt die kognitive Kontrolle (das „Gedankenkarussell" wird leiser).'], en: ['It reduces external stimuli (silence).', 'It increases interoception (the ability to perceive signals from within the body).', 'It lowers cognitive control (the "thought carousel" becomes quieter).'] },
    s1_highlight: { de: 'Das öffnet den direkten Zugang zum impliziten Gedächtnis. Der „Lärm" des Alltags übertönt nicht mehr die Signale des Körpers.', en: 'This opens direct access to implicit memory. The "noise" of everyday life no longer drowns out the body\'s signals.' } as LangText,
    s2_title: { de: '3.2 Warum in Meditation „alte Dinge" auftauchen', en: '3.2 Why "Old Things" Surface in Meditation' } as LangText,
    s2_p1: { de: 'Wenn es still wird, wird es oft nicht ruhig, sondern laut im Inneren. Nicht weil Meditation Probleme macht, sondern weil der Körper endlich den Raum bekommt, „zu sprechen" und unvollständige Prozesse sichtbar werden.', en: 'When it becomes quiet, it often doesn\'t become calm, but loud inside. Not because meditation creates problems, but because the body finally gets the space to "speak" and incomplete processes become visible.' } as LangText,
    s3_title: { de: '3.3 Die entscheidende Unterscheidung: Heilung vs. Überforderung', en: '3.3 The Crucial Distinction: Healing vs. Overwhelm' } as LangText,
    s3_integrative_title: { de: 'Meditation wirkt integrativ, wenn:', en: 'Meditation works integratively when:' } as LangText,
    s3_integrative_items: { de: ['das Tempo stimmt und eine Grundsicherheit im Hier und Jetzt vorhanden ist.', 'Selbstmitgefühl aktiv ist (nicht wertendes Beobachten).'], en: ['the pace is right and a basic sense of safety in the here and now is present.', 'self-compassion is active (non-judgmental observing).'] },
    s3_retrauma_title: { de: 'Meditation wirkt retraumatisierend, wenn:', en: 'Meditation works retraumatizing when:' } as LangText,
    s3_retrauma_items: { de: ['sie als „Durchbruchtechnik" genutzt wird („no pain no gain").', 'intensive Körperreaktionen (Zittern, Panik) ignoriert werden.'], en: ['it\'s used as a "breakthrough technique" ("no pain no gain").', 'intense body reactions (trembling, panic) are ignored.'] },
  },
  ch5: {
    title: { de: 'Kapitel 4: IFS – Die innere Architektur', en: 'Chapter 4: IFS – The Inner Architecture' } as LangText,
    p1: { de: 'Wenn wir verstehen, dass der Körper Erinnerungen speichert, hilft uns das Framework der „Internal Family Systems" (IFS), die daraus resultierenden Verhaltensweisen zu ordnen.', en: 'When we understand that the body stores memories, the "Internal Family Systems" (IFS) framework helps us organize the resulting behaviors.' } as LangText,
    s1_title: { de: '4.1 Grundannahme von IFS', en: '4.1 Core Assumption of IFS' } as LangText,
    s1_p1: { de: 'Wir bestehen aus vielen verschiedenen inneren Anteilen (Teilen), ähnlich einem inneren Team.', en: 'We consist of many different inner parts, similar to an inner team.' } as LangText,
    s1_highlight: { de: 'Es gibt keine schlechten Teile. Jeder Teil hat – oder hatte ursprünglich – eine schützende Funktion für das System.', en: 'There are no bad parts. Every part has – or originally had – a protective function for the system.' } as LangText,
    s2_title: { de: '4.2 Die drei zentralen Teiltypen', en: '4.2 The Three Central Part Types' } as LangText,
    manager: { title: { de: 'Manager (Proaktive Beschützer)', en: 'Managers (Proactive Protectors)' } as LangText, desc: { de: 'Wollen Schmerz verhindern durch Kontrolle, Perfektionismus, Planung, Intellektualisieren.', en: 'Want to prevent pain through control, perfectionism, planning, intellectualizing.' } as LangText },
    firefighter: { title: { de: 'Firefighter (Reaktive Beschützer)', en: 'Firefighters (Reactive Protectors)' } as LangText, desc: { de: 'Wenn Schmerz durchbricht, sorgen sie für sofortige Ablenkung (Wut, Sucht, Rückzug).', en: 'When pain breaks through, they provide immediate distraction (anger, addiction, withdrawal).' } as LangText },
    exile: { title: { de: 'Exile (Die Verbannten)', en: 'Exiles (The Banished)' } as LangText, desc: { de: 'Verletzte Anteile, die Scham oder Angst tragen und von den anderen geschützt werden.', en: 'Wounded parts that carry shame or fear and are protected by the others.' } as LangText },
    s3_title: { de: '4.3 Das Selbst (Self-Energy)', en: '4.3 The Self (Self-Energy)' } as LangText,
    s3_p1: { de: 'Das „Selbst" ist kein Teil, sondern die Kernessenz – ein Zustand von Präsenz und natürlicher Führungsqualität. Es ist immer da, wird aber oft von Teilen überlagert.', en: 'The "Self" is not a part, but the core essence – a state of presence and natural leadership quality. It is always there, but is often overlaid by parts.' } as LangText,
    s3_qualities_title: { de: 'Die 8 C-Qualitäten des Selbst:', en: 'The 8 C-Qualities of the Self:' } as LangText,
    s3_qualities: { de: ['Calm (Ruhe)', 'Curiosity (Neugier)', 'Clarity (Klarheit)', 'Compassion (Mitgefühl)', 'Confidence (Zuversicht)', 'Courage (Mut)', 'Creativity (Kreativität)', 'Connectedness (Verbundenheit)'], en: ['Calm', 'Curiosity', 'Clarity', 'Compassion', 'Confidence', 'Courage', 'Creativity', 'Connectedness'] },
    s3_p2: { de: 'Wenn wir aus dem Selbst heraus handeln, können wir alle Teile mit Wohlwollen führen, ohne sie zu unterdrücken oder zu bekämpfen.', en: 'When we act from the Self, we can lead all parts with goodwill, without suppressing or fighting them.' } as LangText,
    s3_p3: { de: 'Ziel der Arbeit: Nicht die Teile loswerden, sondern Selbst-Führung entwickeln – die Fähigkeit, aus dieser Kernessenz heraus zu leben und alle Teile liebevoll zu integrieren.', en: 'Goal of the work: Not to get rid of parts, but to develop Self-leadership – the ability to live from this core essence and lovingly integrate all parts.' } as LangText,
    s4_title: { de: '4.4 Verbindung zum Körper', en: '4.4 Connection to the Body' } as LangText,
    s4_p1: { de: 'Teile zeigen sich immer auch somatisch (Spannung, Übelkeit, Unruhe). Der Körper ist der Kompass.', en: 'Parts always also show themselves somatically (tension, nausea, restlessness). The body is the compass.' } as LangText,
    s5_title: { de: '4.5 Übernommene Lasten („Legacy Burdens")', en: '4.5 Inherited Burdens ("Legacy Burdens")' } as LangText,
    s5_p1: { de: 'Nicht alle unsere Teile sind durch eigene Erfahrung entstanden. In Systemen übernehmen Kinder oft unbewusst die Rollenbilder und Glaubenssätze der Eltern, um die Bindung zu sichern.', en: 'Not all our parts were created through our own experience. In systems, children often unconsciously adopt their parents\' role models and beliefs to secure attachment.' } as LangText,
    s5_manager: { de: 'Der kopierte Manager: Agiert dein innerer Antreiber so, wie du es brauchst, oder exakt so, wie dein Vater mit Stress umging?', en: 'The copied Manager: Does your inner driver act the way you need, or exactly the way your father dealt with stress?' } as LangText,
    s5_fear: { de: 'Die übernommene Angst: Trägt ein Teil vielleicht die unaufgelöste Panik der Mutter vor Ausgrenzung?', en: 'The inherited fear: Does a part perhaps carry the mother\'s unresolved panic about exclusion?' } as LangText,
    s5_quote: { de: 'Die entscheidende Frage ist: „Gehört dieses Gefühl eigentlich mir – oder trage ich es für jemand anderen?"', en: 'The crucial question is: "Does this feeling actually belong to me – or am I carrying it for someone else?"' } as LangText,
  },
  ch6: {
    title: { de: 'Kapitel 5: NVC – Sprache für innere Wahrheit', en: 'Chapter 5: NVC – Language for Inner Truth' } as LangText,
    p1: { de: 'IFS hilft zu verstehen, wer in uns spricht. Gewaltfreie Kommunikation (NVC) hilft dabei, wie wir dies ausdrücken, um Verbindung herzustellen.', en: 'IFS helps understand who speaks within us. Nonviolent Communication (NVC) helps with how we express this to create connection.' } as LangText,
    s1_title: { de: '5.1 Warum NVC hier passt', en: '5.1 Why NVC Fits Here' } as LangText,
    s1_p1: { de: 'NVC moralisiert und pathologisiert nicht. Es ist ein Präzisionswerkzeug, um somatische Zustände in beziehungsfähige Sprache zu übersetzen.', en: 'NVC doesn\'t moralize or pathologize. It\'s a precision tool for translating somatic states into relational language.' } as LangText,
    s2_title: { de: '5.2 Die vier Schritte – verkörpert gedacht', en: '5.2 The Four Steps – Embodied' } as LangText,
    steps: [
      { step: '1', title: { de: 'Beobachtung', en: 'Observation' } as LangText, desc: { de: 'Was ist faktisch passiert? (Beruhigt das Alarmsystem)', en: 'What factually happened? (Calms the alarm system)' } as LangText },
      { step: '2', title: { de: 'Gefühl', en: 'Feeling' } as LangText, desc: { de: 'Was fühle ich? (Verbindung zum impliziten Gedächtnis)', en: 'What do I feel? (Connection to implicit memory)' } as LangText },
      { step: '3', title: { de: 'Bedürfnis', en: 'Need' } as LangText, desc: { de: 'Was braucht gerade Schutz oder Erfüllung? (Der Kernantrieb)', en: 'What needs protection or fulfillment right now? (The core drive)' } as LangText },
      { step: '4', title: { de: 'Bitte', en: 'Request' } as LangText, desc: { de: 'Was wäre ein konkreter nächster Schritt?', en: 'What would be a concrete next step?' } as LangText },
    ],
    s3_title: { de: '5.3 Bedürfnisse als Brücke', en: '5.3 Needs as a Bridge' } as LangText,
    s3_p1: { de: 'Bedürfnisse sind der gemeinsame Nenner aller Teile. Auch ein destruktiver Teil versucht oft nur, ein Bedürfnis nach Sicherheit zu erfüllen.', en: 'Needs are the common denominator of all parts. Even a destructive part often just tries to fulfill a need for safety.' } as LangText,
  },
  ch7: {
    title: { de: 'Kapitel 6: Das integrierte Prozessmodell', en: 'Chapter 6: The Integrated Process Model' } as LangText,
    p1: { de: 'Wir fügen die Ebenen zusammen. Dies ist die Architektur einer bewussten Reaktion unter Druck.', en: 'We put the layers together. This is the architecture of a conscious response under pressure.' } as LangText,
    s1_title: { de: '6.1 Die Gesamtbewegung (Der Flow)', en: '6.1 The Overall Movement (The Flow)' } as LangText,
    flow: [
      { label: { de: 'AUSLÖSER', en: 'TRIGGER' } as LangText, desc: { de: 'Trigger im Außen: Kritik, Blick, Zeitdruck', en: 'External trigger: criticism, look, time pressure' } as LangText },
      { label: { de: 'SOMATISCHE REAKTION', en: 'SOMATIC REACTION' } as LangText, desc: { de: 'Implizites Gedächtnis feuert: Alarm, Anspannung', en: 'Implicit memory fires: alarm, tension' } as LangText },
      { label: { de: 'TEIL-AKTIVIERUNG & ERBE', en: 'PART ACTIVATION & LEGACY' } as LangText, desc: { de: 'Ein Beschützer-Teil übernimmt', en: 'A protector part takes over' } as LangText },
      { label: { de: 'DIE ENTSCHEIDENDE GABELUNG', en: 'THE CRUCIAL FORK' } as LangText, desc: { de: '', en: '' } as LangText },
    ],
    auto_title: { de: 'AUTOMATIK-ROUTE', en: 'AUTOMATIC ROUTE' } as LangText,
    auto_desc: { de: 'Reagieren (Fight/Flight/Freeze)', en: 'React (Fight/Flight/Freeze)' } as LangText,
    pause_title: { de: 'DIE PAUSE / SELF-ENERGY', en: 'THE PAUSE / SELF-ENERGY' } as LangText,
    pause_desc: { de: 'Wahrnehmung + Neugier statt Identifikation', en: 'Perception + curiosity instead of identification' } as LangText,
    flow2: [
      { label: { de: 'ÜBERSETZUNG', en: 'TRANSLATION' } as LangText, desc: { de: 'NVC-Check-In: Gefühl + Bedürfnis', en: 'NVC check-in: feeling + need' } as LangText },
      { label: { de: 'BEWUSSTE HANDLUNG', en: 'CONSCIOUS ACTION' } as LangText, desc: { de: 'Antworten statt Reagieren', en: 'Responding instead of reacting' } as LangText },
    ],
    s2_title: { de: '6.2 Praxis-Beispiel: Die kritische Situation', en: '6.2 Practical Example: The Critical Situation' } as LangText,
    s2_situation: { de: 'Die Situation: Sie stellen ein Projekt vor. Ein Stakeholder unterbricht genervt: „Das funktioniert hier nicht. Nächster Punkt."', en: 'The situation: You\'re presenting a project. A stakeholder interrupts impatiently: "That doesn\'t work here. Next point."' } as LangText,
    auto_mode_title: { de: 'Automatik-Modus', en: 'Automatic Mode' } as LangText,
    auto_items: { de: ['Trigger: Unterbrechung & Tonfall', 'Somatik: Stich im Magen, Hitze', 'Teil: „Verteidiger" wehrt Inkompetenzgefühle ab', 'Reaktion: Zynismus oder Gegenangriff → Eskalation'], en: ['Trigger: Interruption & tone of voice', 'Somatics: Stab in stomach, heat', 'Part: "Defender" wards off feelings of incompetence', 'Reaction: Cynicism or counterattack → Escalation'] },
    int_mode_title: { de: 'Integrierter Modus', en: 'Integrated Mode' } as LangText,
    int_items: { de: ['Trigger: Unterbrechung', 'Somatik: Sie spüren Stich und Hitze', 'Pause: Ausatmen, Impuls erkennen, nicht ausagieren', 'Übersetzung: „Ich bin irritiert, weil ich möchte, dass die Arbeit gesehen wird."', 'Handlung: Deeskalierende Frage → Verbindung'], en: ['Trigger: Interruption', 'Somatics: You feel the stab and heat', 'Pause: Exhale, recognize impulse, don\'t act on it', 'Translation: "I\'m irritated because I want the work to be seen."', 'Action: De-escalating question → Connection'] },
  },
  ch8: {
    title: { de: 'Kapitel 7: Unconscious Bias neu verstanden', en: 'Chapter 7: Unconscious Bias Reunderstood' } as LangText,
    s1_title: { de: '7.1 Bias als Körperphänomen', en: '7.1 Bias as a Body Phenomenon' } as LangText,
    s1_p1: { de: 'Bias ist kein reiner Denkfehler, sondern ein somatischer Sicherheitsmechanismus unter Zeitdruck.', en: 'Bias is not a pure thinking error, but a somatic safety mechanism under time pressure.' } as LangText,
    s1_p2: { de: 'Das Gehirn scannt: „Sicher oder unsicher?"', en: 'The brain scans: "Safe or unsafe?"' } as LangText,
    s1_list: { de: ['Bias = Ein Schutzteil unter Stress', 'Gefühl: Unsicherheit, Angst vor dem Fremden', 'Bedürfnis: Vorhersagbarkeit, Zugehörigkeit'], en: ['Bias = A protection part under stress', 'Feeling: Insecurity, fear of the unfamiliar', 'Need: Predictability, belonging'] },
    s1_highlight: { de: 'Regulation schlägt Belehrung. Wenn ich mich sicher fühle, brauche ich meine Vorurteile weniger dringend als Schutzschild.', en: 'Regulation beats lecturing. When I feel safe, I need my biases less urgently as a shield.' } as LangText,
  },
  ch9: {
    title: { de: 'Kapitel 8: Erinnerungskultur & Journaling', en: 'Chapter 8: Memory Culture & Journaling' } as LangText,
    s1_title: { de: '8.1 Erinnerungen sind formbar', en: '8.1 Memories Are Malleable' } as LangText,
    s1_p1: { de: 'Wir können die emotionale Ladung einer Erinnerung verändern, indem wir den Zustand ändern, in dem wir uns erinnern.', en: 'We can change the emotional charge of a memory by changing the state in which we remember.' } as LangText,
    s2_title: { de: '8.2 Integratives Journaling', en: '8.2 Integrative Journaling' } as LangText,
    s2_p1: { de: 'Fragen Sie beim Reflektieren nicht nur: „Was ist passiert?"', en: 'When reflecting, don\'t just ask: "What happened?"' } as LangText,
    s2_p2: { de: 'Sondern:', en: 'But rather:' } as LangText,
    s2_list: { de: ['Wie hat es sich im Körper angefühlt?', 'Welcher Teil war aktiv?', 'Gehört dieses Gefühl mir oder ist es ein Erbe?', 'Welches Bedürfnis war lebendig?'], en: ['How did it feel in the body?', 'Which part was active?', 'Does this feeling belong to me or is it a legacy?', 'Which need was alive?'] },
  },
  ch10: {
    title: { de: 'Angrenzende Themenfelder', en: 'Related Topic Areas' } as LangText,
    p1: { de: 'Dieses Modell bildet das Fundament für die Arbeit mit:', en: 'This model forms the foundation for working with:' } as LangText,
    list: { de: ['Polyvagal-Theorie (Nervensystem & Sicherheit)', 'Window of Tolerance (Stresstoleranz-Fenster)', 'Bindungsstile (Beziehungsmuster)', 'Embodied Cognition (Verkörpertes Denken)'], en: ['Polyvagal Theory (Nervous system & safety)', 'Window of Tolerance (Stress tolerance window)', 'Attachment Styles (Relationship patterns)', 'Embodied Cognition'] },
  },
  ch11: {
    title: { de: 'Die zentrale These', en: 'The Central Thesis' } as LangText,
    p1: { de: 'Wenn wir die Ebenen von Körpergedächtnis, Epigenetik, inneren Anteilen und Bedürfnissen zusammenführen, kommen wir zu einer radikalen Schlussfolgerung:', en: 'When we bring together the layers of body memory, epigenetics, inner parts, and needs, we come to a radical conclusion:' } as LangText,
    quote: { de: 'Viele menschliche Probleme sind keine Denkprobleme, sondern Zustandsprobleme.', en: 'Many human problems are not thinking problems, but state problems.' } as LangText,
    p2: { de: 'Wir versuchen oft, Konflikte durch mehr Analyse zu lösen. Doch wenn das Nervensystem im Alarmzustand ist, ist der Zugang zu Lösungen blockiert.', en: 'We often try to solve conflicts through more analysis. But when the nervous system is in alarm state, access to solutions is blocked.' } as LangText,
    highlight: { de: 'Die Arbeit beginnt bei der Regulation des Zustands.', en: 'The work begins with regulating the state.' } as LangText,
    p3: { de: 'Wenn der Zustand reguliert ist:', en: 'When the state is regulated:' } as LangText,
    list: { de: ['werden Teile kooperativ.', 'werden Bedürfnisse verhandelbar.', 'können wir unterscheiden: Was ist mein Stress, und was ist altes Erbe?', 'wird echte Beziehung möglich.'], en: ['parts become cooperative.', 'needs become negotiable.', 'we can distinguish: What is my stress, and what is old legacy?', 'genuine relationship becomes possible.'] },
  },
  ch12: {
    title: { de: 'Für neugierige Menschen in jeder Lebenssituation', en: 'For Curious People in Every Life Situation' } as LangText,
    p1: { de: 'Du musst keine Krise erleben, um von diesem Wissen zu profitieren. Neugier auf dich selbst ist der beste Ausgangspunkt.', en: 'You don\'t need to experience a crisis to benefit from this knowledge. Curiosity about yourself is the best starting point.' } as LangText,
    list1: { de: ['Verstehe, warum du in bestimmten Situationen so reagierst, wie du reagierst', 'Entdecke verborgene Muster und Prägungen, die dein Verhalten formen', 'Entwickle ein tieferes Verständnis für deine Emotionen und Bedürfnisse', 'Finde mehr Gelassenheit im Alltag durch Selbsterkenntnis', 'Verbessere deine Beziehungen durch besseres Verstehen deiner selbst'], en: ['Understand why you react the way you do in certain situations', 'Discover hidden patterns and imprints that shape your behavior', 'Develop a deeper understanding of your emotions and needs', 'Find more equanimity in daily life through self-knowledge', 'Improve your relationships through better understanding of yourself'] },
    subtitle: { de: 'Die Mehrwerte für neugierige Selbstentdecker', en: 'Benefits for Curious Self-Explorers' } as LangText,
    benefits: [
      { label: { de: 'Selbsterkenntnis:', en: 'Self-knowledge:' } as LangText, desc: { de: 'Lerne die Sprache deines Körpers und deiner Emotionen zu verstehen', en: 'Learn to understand the language of your body and emotions' } as LangText },
      { label: { de: 'Authentizität:', en: 'Authenticity:' } as LangText, desc: { de: 'Unterscheide zwischen echten Bedürfnissen und übernommenen Mustern', en: 'Distinguish between genuine needs and adopted patterns' } as LangText },
      { label: { de: 'Gelassenheit:', en: 'Equanimity:' } as LangText, desc: { de: 'Reagiere bewusster statt automatisch', en: 'Respond more consciously instead of automatically' } as LangText },
      { label: { de: 'Beziehungstiefe:', en: 'Relationship depth:' } as LangText, desc: { de: 'Verstehe dich selbst besser und kommuniziere klarer', en: 'Understand yourself better and communicate more clearly' } as LangText },
      { label: { de: 'Lebensqualität:', en: 'Quality of life:' } as LangText, desc: { de: 'Triff Entscheidungen, die wirklich zu dir passen', en: 'Make decisions that truly fit you' } as LangText },
    ],
  },
  footer: {
    text: { de: 'Oria begleitet dich dabei, dieses Modell im Alltag anzuwenden – sanft, dosiert und auf deine Bedürfnisse abgestimmt.', en: 'Oria accompanies you in applying this model in everyday life – gently, in measured doses, and tailored to your needs.' } as LangText,
  },
};
