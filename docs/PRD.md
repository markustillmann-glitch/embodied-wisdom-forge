# Product Requirements Document (PRD)
## Beyond the Shallow – Through Memories

**Version:** 1.0  
**Erstellt:** 19. Dezember 2024  
**Status:** Produktiv (MVP)  
**Produkt-Owner:** [TBD]

---

## 1. Produktvision & Ziele

### 1.1 Vision Statement
Beyond the Shallow – Through Memories ist eine KI-gestützte Selbstreflexions-Plattform, die Menschen dabei unterstützt, über Erinnerungsarbeit Zugang zu tieferen Schichten ihres Selbst zu finden – ohne die Hürde einer Therapie.

### 1.2 Produktziele

| Ziel | Metrik | Target |
|------|--------|--------|
| Nutzer-Engagement | Durchschnittliche Session-Dauer | > 15 Minuten |
| Retention | Wöchentliche Wiederkehrrate | > 40% |
| Konversion | Seminar-Anfragen pro Monat | > 10 |
| Qualität | Gespeicherte Erinnerungen pro aktivem Nutzer | > 5 |

### 1.3 Nicht-Ziele (Out of Scope)
- Ersatz für professionelle Therapie
- Diagnostische Funktionen
- Community-Features (Foren, Gruppen)
- Native Mobile Apps (vorerst PWA-fokussiert)

---

## 2. Zielgruppen (User Personas)

### 2.1 Persona: "Die Selbstentdeckerin" (Primär)
- **Alter:** 28-45
- **Kontext:** Berufstätig, interessiert an Persönlichkeitsentwicklung
- **Motivation:** Will sich selbst besser verstehen, ohne direkt in Therapie zu gehen
- **Schmerzpunkt:** Ratgeber-Bücher sind zu allgemein, Therapie fühlt sich zu groß an
- **Technische Affinität:** Mittel bis hoch, nutzt Apps regelmäßig

### 2.2 Persona: "Der Seminar-Teilnehmer" (Sekundär)
- **Kontext:** Hat bereits ein Beyond the Shallow Seminar besucht
- **Motivation:** Möchte zwischen Seminaren weiterarbeiten
- **Schmerzpunkt:** Vergisst Erkenntnisse aus Seminaren
- **Nutzung:** Regelmäßig, tiefere Auseinandersetzung

### 2.3 Persona: "Die HSP" (Highly Sensitive Person)
- **Kontext:** Hochsensibel, schnell überwältigt
- **Motivation:** Sanfter, dosierbarer Zugang zu emotionaler Arbeit
- **Schmerzpunkt:** Gruppen-Settings sind oft zu intensiv
- **Anforderung:** Tempo selbst bestimmen können

---

## 3. Epics & User Stories

### EPIC 1: Authentifizierung & Benutzerverwaltung

#### US-1.1: Registrierung
**Als** neuer Besucher  
**möchte ich** ein Konto mit E-Mail und Passwort erstellen  
**damit** ich meine persönlichen Daten sicher speichern kann.

**Akzeptanzkriterien:**
- [ ] E-Mail-Validierung gemäß RFC 5322
- [ ] Passwort mindestens 6 Zeichen
- [ ] Optionale Eingabe eines Anzeigenamens
- [ ] Bei Erfolg: Automatischer Login und Weiterleitung zu /coach
- [ ] Bei bestehendem Account: Fehlermeldung mit Hinweis auf Login
- [ ] Auto-Confirm für E-Mail aktiviert (kein E-Mail-Verifizierungsschritt)

**Technische Notizen:**
- Supabase Auth mit `signUp()`
- Profil-Erstellung via Trigger in `profiles` Tabelle
- Zod-Validierung im Frontend

---

#### US-1.2: Login
**Als** registrierter Nutzer  
**möchte ich** mich mit E-Mail und Passwort anmelden  
**damit** ich auf meine gespeicherten Daten zugreifen kann.

**Akzeptanzkriterien:**
- [ ] Erfolgreicher Login leitet zu /coach weiter
- [ ] Bei falschen Credentials: Lokalisierte Fehlermeldung
- [ ] Session bleibt über Browser-Schließung erhalten (Refresh Token)
- [ ] Loading-State während Auth-Check

---

#### US-1.3: Passwort vergessen
**Als** Nutzer, der sein Passwort vergessen hat  
**möchte ich** einen Reset-Link per E-Mail erhalten  
**damit** ich wieder Zugang zu meinem Konto bekomme.

**Akzeptanzkriterien:**
- [ ] E-Mail-Eingabe mit Validierung
- [ ] Erfolgs-Toast unabhängig davon, ob E-Mail existiert (Sicherheit)
- [ ] Reset-Link leitet zu /auth?reset=true
- [ ] Neues Passwort muss mind. 6 Zeichen haben
- [ ] Passwort-Bestätigung muss übereinstimmen

---

#### US-1.4: Passwort ändern (eingeloggt)
**Als** eingeloggter Nutzer  
**möchte ich** mein Passwort auf der Profilseite ändern können  
**damit** ich meine Kontosicherheit verwalten kann.

**Akzeptanzkriterien:**
- [ ] Eingabe neues Passwort + Bestätigung
- [ ] Validierung: Mind. 6 Zeichen, Felder müssen übereinstimmen
- [ ] Erfolgs-Toast nach Änderung
- [ ] Kein Re-Login erforderlich

---

### EPIC 2: AI Coach "Oria"

#### US-2.1: Chat-Konversation starten
**Als** eingeloggter Nutzer  
**möchte ich** eine neue Konversation mit Oria beginnen  
**damit** ich Unterstützung bei Selbstreflexion erhalte.

**Akzeptanzkriterien:**
- [ ] Neue Konversation wird mit Titel "Neue Konversation" erstellt
- [ ] Konversation erscheint sofort in der Sidebar
- [ ] Chat-Bereich ist leer und bereit für Eingabe
- [ ] Eingabefeld hat Fokus

**Technische Notizen:**
- Speicherung in `conversations` Tabelle
- RLS: Nutzer sieht nur eigene Konversationen

---

#### US-2.2: Streaming-Nachrichten
**Als** Nutzer im Chat  
**möchte ich** die Antwort von Oria Wort für Wort erscheinen sehen  
**damit** ich ein natürliches Gesprächsgefühl habe.

**Akzeptanzkriterien:**
- [ ] Antwort wird Token-by-Token gestreamt
- [ ] Typing-Indikator während Generierung
- [ ] Scroll-to-Bottom bei neuen Tokens
- [ ] Bei Fehler: Toast-Benachrichtigung
- [ ] Rate-Limit-Fehler (429, 402) werden nutzerfreundlich angezeigt

**Technische Notizen:**
- SSE-Streaming via Lovable AI Gateway
- Edge Function: `coach-chat`
- Model: `google/gemini-2.5-flash`

---

#### US-2.3: Journaling-Templates
**Als** Nutzer, der eine Erinnerung teilt  
**möchte ich** ein strukturiertes Template zum Durcharbeiten angeboten bekommen  
**damit** ich tiefer in die Erinnerung eintauchen kann.

**Akzeptanzkriterien:**
- [ ] Oria erkennt Memory-Typen: concert, relationship, work, childhood, early_childhood, travel, success, friendship, meditation, song, general
- [ ] Template-Anpassung je nach Typ (z.B. early_childhood = fragmentarisch, keine Fakten-Fragen)
- [ ] Compact Mode (5 Schritte) oder Detailed Mode (11 Schritte) wählbar
- [ ] Fortschrittsanzeige: "📍 3/5" oder "Wir sind bei Punkt 6 von 11..."
- [ ] Pro Nachricht nur EINE Frage/Aufgabe
- [ ] Bei "überspringen": Nächster Punkt ohne Nachfrage

**Template-Struktur (Detailed):**
1. Rahmen – Faktische Details
2. Ankommen – Körper & Raum
3. Der Button (Trigger-Moment)
4. Beziehungsdynamik
5. Zeitliche Perspektive
6. Resonanz & Umfeld
7. Innere Stimmen (IFS)
8. Bedürfnisse (GfK)
9. Verdichtung
10. Integration
11. Abschluss

---

#### US-2.4: Automatisches Speichern in Vault
**Als** Nutzer nach Abschluss eines Templates  
**möchte ich** die Erinnerung automatisch im Vault speichern können  
**damit** ich keinen manuellen Aufwand habe.

**Akzeptanzkriterien:**
- [ ] Nach Template-Abschluss: Oria fragt "Möchtest du diese Erinnerung speichern?"
- [ ] Bei Zustimmung: Oria generiert JSON-Block `[SAVE_MEMORY]...[/SAVE_MEMORY]`
- [ ] Frontend parst Block und speichert automatisch
- [ ] Erfolgs-Toast mit Hinweis auf Vault
- [ ] Kein zusätzlicher Button-Klick nötig

---

#### US-2.5: Diskrete Lernfähigkeit
**Als** wiederkehrender Nutzer  
**möchte ich**, dass Oria sich an meine Muster erinnert  
**damit** die Gespräche persönlicher werden.

**Akzeptanzkriterien:**
- [ ] Nach jeder Konversation: Background-Call zu `coach-learn` Edge Function
- [ ] Keine UI-Anzeige des Lernens (diskret)
- [ ] Insights gespeichert in `coach_insights` mit:
  - insight_type (z.B. "trigger", "need", "pattern")
  - confidence_level (low, medium, high)
  - observation_count (verstärkt bei Wiederholung)
- [ ] Top 15 Insights werden im System-Prompt verwendet
- [ ] Insights beeinflussen NICHT die Konversation direkt (nur Kontext)

---

#### US-2.6: Krisenmonitoring
**Als** Plattform-Betreiber  
**möchte ich**, dass Oria bei Krisenzeichen reagiert  
**damit** Nutzer angemessene Hilfe erhalten.

**Akzeptanzkriterien:**
- [ ] Bei Suizidgedanken, Selbstverletzung: Sofortiger Gesprächsstopp
- [ ] Ausgabe von Krisenhotline-Nummern (DE: 0800-1110111)
- [ ] Bei Dissoziation, Panik, wiederholter Verschlechterung: Empfehlung menschlicher Coach
- [ ] Verweis auf /seminare und /anleitung
- [ ] Template-Arbeit wird nicht fortgesetzt

---

#### US-2.7: Konversation umbenennen
**Als** Nutzer mit vielen Konversationen  
**möchte ich** Titel ändern können  
**damit** ich sie leichter wiederfinde.

**Akzeptanzkriterien:**
- [ ] Drei-Punkte-Menü pro Konversation in Sidebar
- [ ] Dialog mit Eingabefeld, vorausgefüllt mit aktuellem Titel
- [ ] Speicherung bei Confirm, Toast bei Erfolg

---

#### US-2.8: Konversation löschen
**Als** Nutzer  
**möchte ich** Konversationen löschen können  
**damit** ich aufräumen kann.

**Akzeptanzkriterien:**
- [ ] Bestätigungs-Dialog vor Löschung
- [ ] Cascade-Delete der zugehörigen Messages
- [ ] Bei aktiver Konversation: Wechsel zur nächsten oder leerer Zustand
- [ ] Toast-Bestätigung

---

#### US-2.9: Psychogramm generieren
**Als** Nutzer mit mehreren gespeicherten Erinnerungen  
**möchte ich** ein übergreifendes Psychogramm erstellen lassen  
**damit** ich Muster in meinen Erinnerungen erkenne.

**Akzeptanzkriterien:**
- [ ] Verfügbar ab mind. 3 Erinnerungen
- [ ] Generierung via `generate-psychogram` Edge Function
- [ ] Anzeige in Modal-Dialog
- [ ] Compact/Detailed Toggle
- [ ] Export als Text möglich

---

### EPIC 3: Memory Vault

#### US-3.1: Erinnerungen anzeigen
**Als** eingeloggter Nutzer  
**möchte ich** alle meine gespeicherten Erinnerungen sehen  
**damit** ich sie durchstöbern kann.

**Akzeptanzkriterien:**
- [ ] Gruppierung nach Jahr und Monat
- [ ] Sortierung: Neueste zuerst (nach memory_date, fallback created_at)
- [ ] Anzeige: Icon nach Typ, Titel, Datum, Emotion-Badge
- [ ] Klick öffnet Detail-Ansicht rechts (Desktop) oder fullscreen (Mobile)
- [ ] Leerer Zustand mit Hinweis auf Coach

---

#### US-3.2: Passwortschutz für Vault
**Als** Nutzer mit sensiblen Erinnerungen  
**möchte ich** den Vault mit einem separaten Passwort schützen  
**damit** niemand ohne mein Wissen darauf zugreifen kann.

**Akzeptanzkriterien:**
- [ ] Passwort-Einrichtung auf UserProfile-Seite
- [ ] Min. 4 Zeichen, Bestätigungsfeld
- [ ] SHA-256 Hash, gespeichert in `user_profiles.vault_password_hash`
- [ ] Bei Vault-Zugriff: Passwort-Eingabe-Screen
- [ ] Falsche Eingabe: Toast + Eingabe bleibt
- [ ] Passwort entfernen möglich (mit Bestätigung)
- [ ] Session-basiert: Nach Entsperrung bleibt offen bis Tab geschlossen

---

#### US-3.3: Erinnerung bearbeiten
**Als** Nutzer  
**möchte ich** Titel, Zusammenfassung und Metadaten einer Erinnerung bearbeiten  
**damit** ich sie verfeinern kann.

**Akzeptanzkriterien:**
- [ ] Editierbar: Titel, Zusammenfassung, Zusätzliche Gedanken
- [ ] GfK-Felder: Gefühle danach (Multiselect aus 12 Optionen)
- [ ] GfK-Felder: Bedürfnisse (Multiselect aus 12 Optionen)
- [ ] Bild-URL änderbar
- [ ] Speichern-Button, Toast bei Erfolg

**GfK-Gefühle:** relieved, confused, peaceful, sad, grateful, hopeful, vulnerable, energized, tender, overwhelmed, curious, moved

**GfK-Bedürfnisse:** connection, understanding, autonomy, security, meaning, play, rest, authenticity, growth, contribution, empathy, clarity

---

#### US-3.4: AI-Bild generieren
**Als** Nutzer  
**möchte ich** ein KI-generiertes Bild für meine Erinnerung erstellen  
**damit** sie visuell ansprechender wird.

**Akzeptanzkriterien:**
- [ ] Button "KI-Bild generieren" im Edit-Dialog
- [ ] Loading-State während Generierung
- [ ] Bild wird in Supabase Storage hochgeladen
- [ ] Vorschau im Dialog
- [ ] Speicherung der URL in `memories.image_url`

**Technische Notizen:**
- Edge Function: `generate-memory-image`
- Basis: Titel, Zusammenfassung, Emotion, Typ

---

#### US-3.5: Bild hochladen
**Als** Nutzer  
**möchte ich** ein eigenes Bild hochladen  
**damit** ich persönliche Fotos verwenden kann.

**Akzeptanzkriterien:**
- [ ] File-Input für Bilder (jpg, png, gif, webp)
- [ ] Max. Größe: 5 MB (Frontend-Check)
- [ ] Upload zu Supabase Storage: `memory-images/{user_id}/{memory_id}-{timestamp}.{ext}`
- [ ] Vorschau nach Upload
- [ ] Ersetzt vorheriges Bild

---

#### US-3.6: Erinnerung exportieren
**Als** Nutzer  
**möchte ich** eine Erinnerung als Markdown exportieren  
**damit** ich sie außerhalb der App nutzen kann.

**Akzeptanzkriterien:**
- [ ] Download-Button pro Erinnerung
- [ ] Format: Markdown mit Metadaten-Header
- [ ] Enthält: Titel, Datum, Typ, Gefühle, Bedürfnisse, Inhalt, Zusätzliche Gedanken
- [ ] Dateiname: `{titel_sanitized}.md`

---

#### US-3.7: Erinnerung löschen
**Als** Nutzer  
**möchte ich** Erinnerungen unwiderruflich löschen können  
**damit** ich Kontrolle über meine Daten habe.

**Akzeptanzkriterien:**
- [ ] Bestätigungs-Dialog
- [ ] Bei Erfolg: Entfernung aus Liste, Toast
- [ ] Bei aktiver Detail-Ansicht: Schließen

---

#### US-3.8: Memory Book erstellen
**Als** Nutzer  
**möchte ich** aus einer Erinnerung ein schönes "Buch" generieren  
**damit** ich sie als Geschenk oder Andenken nutzen kann.

**Akzeptanzkriterien:**
- [ ] Button "Erinnerungsbuch erstellen"
- [ ] Auswahl: Persönliches Buch oder Geschenk (mit Empfängername)
- [ ] KI generiert Kapitel: Cover, Titel, Kapitel, Zitate, Reflexion, Abschluss
- [ ] Swipe/Button-Navigation durch Seiten
- [ ] Seiten editierbar (Titel, Inhalt)
- [ ] Buch speicherbar in `memories.memory_book_data`
- [ ] Export als PDF möglich (jsPDF)

**Seitentypen:**
- cover, title, chapter, image, quote, context, reflection, ending

---

### EPIC 4: Nutzerprofil

#### US-4.1: Basis-Profil anzeigen
**Als** eingeloggter Nutzer  
**möchte ich** mein Profil sehen und bearbeiten  
**damit** Oria mich besser versteht.

**Akzeptanzkriterien:**
- [ ] Profilfoto hochladbar
- [ ] Felder: Ziele & Motivation (Textarea), Größte Herausforderungen (Textarea)
- [ ] Speichern-Button, Toast bei Erfolg

---

#### US-4.2: Erweiterte Profilfelder
**Als** Nutzer, der Oria optimieren will  
**möchte ich** detaillierte Informationen über mich hinterlegen  
**damit** Oria personalisierter antwortet.

**Profilfelder (alle optional):**

| Kategorie | Felder |
|-----------|--------|
| **Sicherheit & Regulation** | safety_feeling, overwhelm_signals, nervous_system_tempo |
| **Bedürfnisse (GfK)** | core_needs[], neglected_needs[], over_fulfilled_needs[] |
| **Zugehörigkeit** | belonging_through[], reaction_to_expectations |
| **Grenzen** | harder_closeness_or_boundaries |
| **Erinnerung** | primary_memory_channel[], memory_effect, trigger_sensitivity |
| **Leichtigkeit/Tiefe** | when_feels_light, when_depth_nourishing, when_depth_burdening, lightness_depth_balance |
| **Kommunikation** | preferred_tone[], response_preference[], language_triggers[] |
| **Lebenssituation** | life_phase, energy_level, current_focus[] |
| **Coach-Einstellungen** | coach_tonality (warm/neutral/direct), interpretation_style (validating/neutral/challenging), praise_level (high/moderate/low) |
| **Ressourcen** | safe_places[], power_sources[], body_anchors[], self_qualities[] |

**Akzeptanzkriterien:**
- [ ] Alle Felder in Sektionen gruppiert mit Icons
- [ ] Textareas für Freitext, Chip-Select für Arrays, Radio für Single-Choice
- [ ] Auto-Save bei Blur (oder expliziter Save-Button)
- [ ] Daten fließen in coach-chat System-Prompt

---

#### US-4.3: Profil-Assistent
**Als** Nutzer  
**möchte ich** mein Profil im Dialog mit einem AI-Assistenten ausfüllen  
**damit** ich nicht alle Felder selbst verstehen muss.

**Akzeptanzkriterien:**
- [ ] Zugang via Button auf UserProfile
- [ ] Modus-Auswahl: Erstes Ausfüllen oder Überarbeitung
- [ ] AI führt durch Fragen, erklärt Konzepte (GfK, IFS)
- [ ] AI gibt JSON-Blöcke aus: `[PROFILE_UPDATE]{"field": "...", "value": "..."}[/PROFILE_UPDATE]`
- [ ] Frontend parst und speichert automatisch in `user_profiles`
- [ ] Toast bei erfolgreicher Speicherung

---

### EPIC 5: Content & Informationsseiten

#### US-5.1: Startseite (Index)
**Als** Besucher  
**möchte ich** verstehen, worum es bei Beyond the Shallow geht  
**damit** ich entscheiden kann, ob es für mich relevant ist.

**Akzeptanzkriterien:**
- [ ] Hero-Bereich mit Logo, Tagline, CTA zu Oria
- [ ] Kapitel-Navigation (sticky, scrollspy)
- [ ] Sektionen: Intro, Positive Erinnerungen, Belastende Erfahrungen, Beziehungen, Oria-Vorstellung, Zielgruppe, Fazit
- [ ] Responsiv für alle Breakpoints
- [ ] Sprach-Switcher DE/EN

---

#### US-5.2: Modell-Seite
**Als** interessierter Besucher  
**möchte ich** das theoretische Modell im Detail verstehen  
**damit** ich die Grundlagen kenne.

**Akzeptanzkriterien:**
- [ ] 8 Kapitel mit Unterabschnitten:
  1. Was Erinnerung wirklich ist
  2. Somatisches Gedächtnis
  3. Meditation
  4. IFS
  5. NVC
  6. Prozessmodell
  7. Bias
  8. Journaling
- [ ] Quotes, Highlights, Listen, ProcessFlow-Komponente
- [ ] Kapitel-Navigation

---

#### US-5.3: Oria-Seite
**Als** Besucher  
**möchte ich** den AI-Coach Oria kennenlernen  
**damit** ich verstehe, was er kann.

**Akzeptanzkriterien:**
- [ ] Hero mit Eulen-Bild
- [ ] Erklärung der Eule als Symbol (5 Qualitäten)
- [ ] Erklärung des Namens "Oria"
- [ ] Persönliches Profil Sektion
- [ ] Interaktive Dialog-Beispiele
- [ ] Zielgruppen-Tabs
- [ ] Progress-Tracker Sektion
- [ ] CTA zu /coach und /profile-assistant
- [ ] Datenschutz-Sektion

---

#### US-5.4: Seminare-Seite
**Als** Besucher  
**möchte ich** die Seminarangebote sehen  
**damit** ich mich für persönliche Begleitung interessieren kann.

**Akzeptanzkriterien:**
- [ ] Drei Formate: Schnupperabend, Einführungsseminar, Jahresprogramm
- [ ] Details pro Format: Dauer, Ort, Inhaltsliste
- [ ] Mehrwert-Akkordeon (5 Benefits)
- [ ] Jahresprogramm-Timeline
- [ ] Kontaktformular mit Validierung
- [ ] Speicherung in `seminar_inquiries`

---

#### US-5.5: Kontaktformular Seminare
**Als** interessierter Besucher  
**möchte ich** Interesse an einem Seminar bekunden  
**damit** ich kontaktiert werden kann.

**Akzeptanzkriterien:**
- [ ] Pflichtfelder: Name, E-Mail, Interesse (Dropdown)
- [ ] Optionale Felder: Telefon, Nachricht
- [ ] Validierung vor Submit
- [ ] Speicherung in `seminar_inquiries`
- [ ] Erfolgs-Toast

---

### EPIC 6: Internationalisierung

#### US-6.1: Sprachauswahl
**Als** Nutzer  
**möchte ich** zwischen Deutsch und Englisch wechseln können  
**damit** ich die App in meiner Sprache nutzen kann.

**Akzeptanzkriterien:**
- [ ] Sprachwahl-Button in Header
- [ ] Persistierung in localStorage
- [ ] Default: Deutsch
- [ ] Sofortige UI-Aktualisierung ohne Reload
- [ ] Alle UI-Texte übersetzt (2800+ Zeilen translations.ts)

---

### EPIC 7: Admin & Analytics

#### US-7.1: Admin-Dashboard
**Als** Admin  
**möchte ich** Nutzungsstatistiken sehen  
**damit** ich die Plattform monitoren kann.

**Akzeptanzkriterien:**
- [ ] Zugang nur für Nutzer mit role = "admin"
- [ ] Übersichtskarten: Memories, Conversations, Messages, Tokens, Cost, Segments
- [ ] Charts: Memory-Typen (Pie), Token-Nutzung nach Function (Bar)
- [ ] Listen: User-Segmente, Insight-Patterns
- [ ] Daten via Supabase Views (analytics_*)

**Technische Notizen:**
- Views: analytics_conversation_stats, analytics_memory_stats, analytics_message_stats, analytics_token_stats, analytics_user_segments, analytics_insight_patterns
- RPC-Functions für sichere Abfrage

---

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Performance

| Anforderung | Metrik | Target |
|-------------|--------|--------|
| Initial Page Load | Time to Interactive | < 3s (3G) |
| Chat Response | Time to First Token | < 2s |
| Streaming | Token Throughput | > 20 tokens/s |
| Memory List | Render Time (100 Items) | < 500ms |
| PDF Export | Generation Time | < 10s |

### 4.2 Skalierbarkeit
- Nutzer: Bis zu 10.000 aktive Nutzer
- Konversationen: Bis zu 100 pro Nutzer
- Messages pro Konversation: Bis zu 500
- Erinnerungen pro Nutzer: Bis zu 1.000

### 4.3 Verfügbarkeit
- Uptime: 99.5% (exkl. geplante Wartung)
- Supabase: Managed Service SLA
- Edge Functions: Cold Start < 1s

### 4.4 Sicherheit

| Bereich | Maßnahme |
|---------|----------|
| Authentifizierung | Supabase Auth, JWT, Refresh Tokens |
| Autorisierung | Row Level Security (RLS) auf allen Tabellen |
| Passwörter | Bcrypt (Supabase), SHA-256 (Vault) |
| API-Keys | Server-side only, niemals im Client |
| Datenverschlüsselung | HTTPS, At-rest encryption (Supabase) |
| DSGVO | Daten in EU (Frankfurt), Löschfunktion |

### 4.5 Barrierefreiheit
- WCAG 2.1 Level AA angestrebt
- Keyboard-Navigation für alle interaktiven Elemente
- aria-labels für Icons
- Kontraste gemäß Guidelines
- Responsive Design für Touch-Devices

### 4.6 Browser-Support
- Chrome (letzte 2 Versionen)
- Firefox (letzte 2 Versionen)
- Safari (letzte 2 Versionen)
- Edge (letzte 2 Versionen)
- Mobile Safari & Chrome (iOS/Android)

---

## 5. Technische Architektur

### 5.1 Frontend Stack
```
React 18.3 + TypeScript
├── Vite (Build)
├── Tailwind CSS + shadcn/ui (Styling)
├── Framer Motion (Animationen)
├── React Router 6 (Routing)
├── TanStack Query (Server State)
├── Zod (Validierung)
├── date-fns (Datumsformatierung)
├── jsPDF + html2canvas (PDF Export)
└── Recharts (Charts im Admin)
```

### 5.2 Backend Stack
```
Lovable Cloud (Supabase)
├── PostgreSQL 15 (Datenbank)
├── Auth (Authentifizierung)
├── Storage (Bilder)
├── Edge Functions (Deno)
│   ├── coach-chat (AI-Konversation)
│   ├── coach-learn (Diskrete Lernfähigkeit)
│   ├── profile-assistant (Profil-Dialog)
│   ├── generate-memory-book (Book-Generierung)
│   ├── generate-memory-image (Bild-Generierung)
│   ├── generate-psychogram (Psychogramm)
│   └── log-token-usage (Kosten-Tracking)
└── Realtime (nicht aktiv genutzt)
```

### 5.3 AI Integration
```
Lovable AI Gateway
├── URL: https://ai.gateway.lovable.dev/v1/chat/completions
├── Model: google/gemini-2.5-flash (default)
├── Streaming: SSE
└── API Key: LOVABLE_API_KEY (auto-provisioned)
```

### 5.4 Datenmodell (ERD)

```
┌─────────────────┐     ┌─────────────────┐
│   auth.users    │────<│    profiles     │
└─────────────────┘     └─────────────────┘
        │                       
        │               ┌─────────────────┐
        ├──────────────<│  user_profiles  │
        │               └─────────────────┘
        │               
        │               ┌─────────────────┐
        ├──────────────<│  conversations  │
        │               └────────┬────────┘
        │                        │
        │               ┌────────┴────────┐
        │               │    messages     │
        │               └─────────────────┘
        │               
        │               ┌─────────────────┐
        ├──────────────<│    memories     │
        │               └─────────────────┘
        │               
        │               ┌─────────────────┐
        ├──────────────<│ coach_insights  │
        │               └─────────────────┘
        │               
        │               ┌─────────────────┐
        └──────────────<│   user_roles    │
                        └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│ seminar_inquiries│    │   token_usage   │
└─────────────────┘     └─────────────────┘
     (public)                (tracking)
```

---

## 6. Glossar

| Begriff | Definition |
|---------|------------|
| **IFS** | Internal Family Systems – Therapiemodell mit inneren Anteilen (Manager, Firefighter, Exiles, Self) |
| **GfK/NVC** | Gewaltfreie Kommunikation – Fokus auf Gefühle und Bedürfnisse |
| **Somatisch** | Körperbezogen, Body Memory |
| **Trigger** | Auslöser für emotionale Reaktionen aus der Vergangenheit |
| **Oria** | Der AI-Coach (Eulen-Symbol) |
| **Vault** | Passwortgeschützter Speicher für Erinnerungen |
| **Memory Book** | KI-generiertes "Buch" aus einer Erinnerung |
| **Psychogramm** | Übergreifende Muster-Analyse mehrerer Erinnerungen |

---

## 7. Offene Punkte & Risiken

### 7.1 Offene Entscheidungen
- [ ] Monetarisierungsmodell (Freemium, Subscription, Seminar-only)
- [ ] Therapeuten-Sharing-Feature: Scope & Datenschutz
- [ ] Push-Notifications: Web Push vs. E-Mail
- [ ] PWA-Manifest und Offline-Fähigkeit

### 7.2 Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| AI-Kosten steigen | Mittel | Hoch | Token-Monitoring, Model-Downgrade-Option |
| Nutzerdaten-Leak | Niedrig | Kritisch | RLS, Encryption, Audit-Logs |
| Krisenfall nicht erkannt | Niedrig | Kritisch | System-Prompt-Tests, Monitoring |
| Supabase-Ausfall | Niedrig | Hoch | Status-Page-Integration |

---

## 8. Anhang

### 8.1 Importieren in Projektmanagement-Tools

**Notion:**
1. Kopiere diese Datei
2. Paste in Notion (Markdown wird automatisch formatiert)
3. Erstelle Datenbank für User Stories mit Status, Priority, Epic

**Linear:**
1. Erstelle Projekt "Beyond the Shallow"
2. Erstelle Epics (Labels oder Parent Issues)
3. Importiere User Stories als Issues
4. Füge Akzeptanzkriterien als Checklisten hinzu

**Jira:**
1. Erstelle Epic pro Hauptbereich
2. Erstelle Stories mit Description (Akzeptanzkriterien als Checklist)
3. Verlinke zu diesem PRD als Confluence-Page

**GitHub Projects:**
1. Erstelle Project Board
2. Nutze Issue Templates für User Stories
3. Verlinke zu diesem PRD im Wiki

### 8.2 Versionierung

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 19.12.2024 | Initiale Version basierend auf bestehendem Code |
