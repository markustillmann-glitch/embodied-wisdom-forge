import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdminLink } from "@/components/AdminLink";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChapterSection } from "@/components/ChapterSection";
import { SubSection } from "@/components/SubSection";
import { ListBlock } from "@/components/ListBlock";
import { Highlight } from "@/components/Highlight";
import { Quote } from "@/components/Quote";
import { Shield, Lock, Brain, Users, FileCheck, HeartPulse, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import bbOwlLogo from "@/assets/bb-owl-new.png";

const Security = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <img src={bbOwlLogo} alt="Oria" className="h-6 w-auto" />
            <span className="font-serif text-lg hidden sm:inline">Beyond the Shallow</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/coach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Coach
            </Link>
            <Link to="/oria" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Oria
            </Link>
            <Link to="/seminare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {language === 'de' ? 'Seminare' : 'Seminars'}
            </Link>
            <AdminLink />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/90" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
              {language === 'de' ? 'Sicherheit bei Oria' : 'Security at Oria'}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'de' 
              ? 'Umfassende Sicherheitsstandards für Daten, KI und psychologische Begleitung – geprüft durch unabhängige Experten'
              : 'Comprehensive security standards for data, AI, and psychological guidance – verified by independent experts'}
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-6 sm:p-8 bg-secondary/30 rounded-2xl border border-border"
        >
          <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-4">
            {language === 'de' ? 'Drei Säulen der Sicherheit' : 'Three Pillars of Security'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <Lock className="w-8 h-8 text-accent mb-2" />
              <h3 className="font-medium text-foreground">{language === 'de' ? 'Datensicherheit' : 'Data Security'}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'de' ? 'Verschlüsselung & Datenschutz' : 'Encryption & Privacy'}
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Brain className="w-8 h-8 text-accent mb-2" />
              <h3 className="font-medium text-foreground">{language === 'de' ? 'KI-Sicherheit' : 'AI Security'}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'de' ? 'Geprüfte Algorithmen' : 'Verified Algorithms'}
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <HeartPulse className="w-8 h-8 text-accent mb-2" />
              <h3 className="font-medium text-foreground">{language === 'de' ? 'Inhaltliche Sicherheit' : 'Content Safety'}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'de' ? 'Fachliche Validierung' : 'Professional Validation'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Data Security */}
        <div className="border-t border-chapter-divider">
          <ChapterSection 
            number="1" 
            title={language === 'de' ? 'Datensicherheit & Datenschutz' : 'Data Security & Privacy'}
          >
            <SubSection 
              number="1.1" 
              title={language === 'de' ? 'Technische Infrastruktur' : 'Technical Infrastructure'}
            >
              <p className="mb-4">
                {language === 'de'
                  ? 'Die Sicherheit Ihrer persönlichen Daten hat für uns höchste Priorität. Unsere technische Infrastruktur entspricht aktuellen Industriestandards:'
                  : 'The security of your personal data is our highest priority. Our technical infrastructure meets current industry standards:'}
              </p>
              <ListBlock items={language === 'de'
                ? [
                  'Ende-zu-Ende-Verschlüsselung aller Übertragungen (TLS 1.3)',
                  'Verschlüsselte Datenspeicherung in europäischen Rechenzentren',
                  'Regelmäßige Sicherheitsaudits durch unabhängige IT-Sicherheitsexperten',
                  'Automatische Backups mit georedundanter Speicherung',
                  'Strenge Zugriffskontrollen und Audit-Logging'
                ]
                : [
                  'End-to-end encryption of all transmissions (TLS 1.3)',
                  'Encrypted data storage in European data centers',
                  'Regular security audits by independent IT security experts',
                  'Automatic backups with geo-redundant storage',
                  'Strict access controls and audit logging'
                ]}
              />
            </SubSection>

            <SubSection 
              number="1.2" 
              title={language === 'de' ? 'Externe Sicherheitsüberprüfung' : 'External Security Review'}
            >
              <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-xl mb-4">
                <Eye className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-foreground font-medium mb-2">
                    {language === 'de' ? 'Unabhängige Experten-Audits' : 'Independent Expert Audits'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'de'
                      ? 'Anerkannte IT-Sicherheitsexperten und Datenschutzbeauftragte sind aktiv in den Entwicklungsprozess einbezogen. Sie führen regelmäßige Penetrationstests, Code-Reviews und Datenschutz-Folgenabschätzungen durch.'
                      : 'Recognized IT security experts and data protection officers are actively involved in the development process. They conduct regular penetration tests, code reviews, and data protection impact assessments.'}
                  </p>
                </div>
              </div>
              <ListBlock items={language === 'de'
                ? [
                  'Vierteljährliche Sicherheitsaudits durch zertifizierte Prüfer',
                  'Penetrationstests nach OWASP-Standards',
                  'DSGVO-konforme Datenverarbeitung',
                  'Dokumentierte Datenschutz-Folgenabschätzungen'
                ]
                : [
                  'Quarterly security audits by certified reviewers',
                  'Penetration testing according to OWASP standards',
                  'GDPR-compliant data processing',
                  'Documented data protection impact assessments'
                ]}
              />
            </SubSection>

            <SubSection 
              number="1.3" 
              title={language === 'de' ? 'Ihre Kontrolle über Ihre Daten' : 'Your Control Over Your Data'}
            >
              <p className="mb-4">
                {language === 'de'
                  ? 'Sie behalten jederzeit die volle Kontrolle über Ihre persönlichen Daten:'
                  : 'You retain full control over your personal data at all times:'}
              </p>
              <ListBlock items={language === 'de'
                ? [
                  'Optionaler Passwortschutz für den Erinnerungstresor',
                  'Jederzeit Einsicht, Export und Löschung Ihrer Daten',
                  'Transparente Darstellung der gespeicherten Informationen',
                  'Keine Weitergabe an Dritte ohne ausdrückliche Zustimmung'
                ]
                : [
                  'Optional password protection for the memory vault',
                  'Access, export, and deletion of your data at any time',
                  'Transparent display of stored information',
                  'No disclosure to third parties without explicit consent'
                ]}
              />
            </SubSection>
          </ChapterSection>
        </div>

        {/* AI Security */}
        <div className="border-t border-chapter-divider">
          <ChapterSection 
            number="2" 
            title={language === 'de' ? 'KI-Sicherheit & Algorithmen-Transparenz' : 'AI Security & Algorithm Transparency'}
          >
            <SubSection 
              number="2.1" 
              title={language === 'de' ? 'Technische KI-Sicherheit' : 'Technical AI Security'}
            >
              <p className="mb-4">
                {language === 'de'
                  ? 'Die künstliche Intelligenz hinter Oria unterliegt strengen Sicherheitsstandards:'
                  : 'The artificial intelligence behind Oria is subject to strict security standards:'}
              </p>
              <ListBlock items={language === 'de'
                ? [
                  'Regelmäßige Überprüfung auf unbeabsichtigte Verzerrungen (Bias-Audits)',
                  'Monitoring auf potenziell schädliche Ausgaben',
                  'Strenge Prompt-Injection-Prävention',
                  'Isolierte Verarbeitung – keine Vermischung von Nutzerdaten'
                ]
                : [
                  'Regular review for unintended biases (bias audits)',
                  'Monitoring for potentially harmful outputs',
                  'Strict prompt injection prevention',
                  'Isolated processing – no mixing of user data'
                ]}
              />
            </SubSection>

            <SubSection 
              number="2.2" 
              title={language === 'de' ? 'Externe KI-Experten' : 'External AI Experts'}
            >
              <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl mb-4">
                <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-foreground font-medium mb-2">
                    {language === 'de' ? 'Neutrales Experten-Gremium' : 'Neutral Expert Panel'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'de'
                      ? 'Unabhängige KI-Sicherheitsexperten aus Wissenschaft und Industrie überprüfen regelmäßig die Algorithmen, Modellausgaben und Sicherheitsmechanismen. Sie sind von Beginn an in den Entwicklungsprozess eingebunden.'
                      : 'Independent AI security experts from academia and industry regularly review algorithms, model outputs, and safety mechanisms. They have been involved in the development process from the beginning.'}
                  </p>
                </div>
              </div>
              <ListBlock items={language === 'de'
                ? [
                  'Halbjährliche externe KI-Audits',
                  'Dokumentierte Algorithmen-Transparenz',
                  'Kontinuierliche Überwachung der Modell-Performance',
                  'Peer-Review bei wesentlichen Änderungen am KI-System'
                ]
                : [
                  'Biannual external AI audits',
                  'Documented algorithm transparency',
                  'Continuous monitoring of model performance',
                  'Peer review for significant changes to the AI system'
                ]}
              />
            </SubSection>

            <Highlight>
              {language === 'de'
                ? 'Die KI ist bewusst so konzipiert, dass sie keine Diagnosen stellt, keine therapeutischen Entscheidungen trifft und bei Hinweisen auf akute Krisen sofort an professionelle Hilfe verweist.'
                : 'The AI is deliberately designed not to make diagnoses, not to make therapeutic decisions, and to immediately refer to professional help when signs of acute crises are detected.'}
            </Highlight>
          </ChapterSection>
        </div>

        {/* Content & Psychological Safety */}
        <div className="border-t border-chapter-divider">
          <ChapterSection 
            number="3" 
            title={language === 'de' ? 'Inhaltliche & Psychologische Sicherheit' : 'Content & Psychological Safety'}
          >
            <SubSection 
              number="3.1" 
              title={language === 'de' ? 'Fachliche Fundierung des Inner Compass Framework' : 'Professional Foundation of the Inner Compass Framework'}
            >
              <p className="mb-4">
                {language === 'de'
                  ? 'Das Beyond the Shallow Inner Compass Framework basiert auf etablierten, wissenschaftlich fundierten Ansätzen und wird von Experten verschiedener Disziplinen validiert:'
                  : 'The Beyond the Shallow Inner Compass Framework is based on established, scientifically grounded approaches and is validated by experts from various disciplines:'}
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 border border-border rounded-xl">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    {language === 'de' ? 'Gewaltfreie Kommunikation (GfK)' : 'Nonviolent Communication (NVC)'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Zertifizierte GfK-Trainer überprüfen die Anwendung der Bedürfnis- und Gefühlsebenen im Coach und in den Journaling-Templates.'
                      : 'Certified NVC trainers verify the application of needs and feelings levels in the coach and journaling templates.'}
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-xl">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    {language === 'de' ? 'Internal Family Systems (IFS)' : 'Internal Family Systems (IFS)'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Ausgebildete IFS-Therapeuten und -Coaches validieren die Anwendung der Teile-Arbeit und die Integration des Selbst mit seinen 8 C-Qualitäten.'
                      : 'Trained IFS therapists and coaches validate the application of parts work and the integration of the Self with its 8 C qualities.'}
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-xl">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    {language === 'de' ? 'Körperarbeit & Somatik' : 'Bodywork & Somatics'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Erfahrene Somatik-Coaches und Körpertherapeuten stellen sicher, dass körperbezogene Anleitungen sicher und angemessen sind.'
                      : 'Experienced somatic coaches and body therapists ensure that body-related guidance is safe and appropriate.'}
                  </p>
                </div>
              </div>
            </SubSection>

            <SubSection 
              number="3.2" 
              title={language === 'de' ? 'Psychologische Sicherheit' : 'Psychological Safety'}
            >
              <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-xl mb-4">
                <HeartPulse className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-foreground font-medium mb-2">
                    {language === 'de' ? 'Psychologische Fachaufsicht' : 'Psychological Oversight'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'de'
                      ? 'Approbierte Psychotherapeuten und klinische Psychologen überwachen kontinuierlich die psychische Sicherheit der Modelle und Interaktionen. Sie stellen sicher, dass der Coach innerhalb sicherer Grenzen operiert.'
                      : 'Licensed psychotherapists and clinical psychologists continuously monitor the psychological safety of all content and interactions. They ensure the coach operates within safe boundaries.'}
                  </p>
                </div>
              </div>
              
              <ListBlock items={language === 'de'
                ? [
                  'Regelmäßige Überprüfung des Coaches und der Antworten durch Psychologen',
                  'Klare Abgrenzung von therapeutischen Interventionen',
                  'Integrierte Sicherheitsschwellen bei Krisenhinweisen',
                  'Automatische Weiterleitung an professionelle Hilfe bei Bedarf',
                  'Dokumentierte Eskalationspfade'
                ]
                : [
                  'Regular review of all coach responses by psychologists',
                  'Clear distinction from therapeutic interventions',
                  'Integrated safety thresholds for crisis indicators',
                  'Automatic referral to professional help when needed',
                  'Documented escalation pathways'
                ]}
              />

              <Quote>
                {language === 'de'
                  ? 'Oria ersetzt keine Therapie. Bei Hinweisen auf suizidale Gedanken, Selbstverletzung oder akute psychische Krisen wird die Sitzung sofort beendet und professionelle Hilfe empfohlen.'
                  : 'Oria does not replace therapy. When signs of suicidal thoughts, self-harm, or acute mental health crises are detected, the session is immediately ended and professional help is recommended.'}
              </Quote>
            </SubSection>
          </ChapterSection>
        </div>

        {/* Testing & Certification */}
        <div className="border-t border-chapter-divider">
          <ChapterSection 
            number="4" 
            title={language === 'de' ? 'Testverfahren & Zertifizierung' : 'Testing Procedures & Certification'}
          >
            <SubSection 
              number="4.1" 
              title={language === 'de' ? 'Begleitete Testgruppen' : 'Accompanied Test Groups'}
            >
              <p className="mb-4">
                {language === 'de'
                  ? 'Vor der Einführung größerer Updates durchlaufen alle Änderungen ein strukturiertes Testverfahren:'
                  : 'Before the introduction of major updates, all changes go through a structured testing procedure:'}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'de' ? 'Interne Prüfung' : 'Internal Review'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Technische und inhaltliche Überprüfung durch das Entwicklungsteam'
                        : 'Technical and content review by the development team'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'de' ? 'Begleitete Testgruppen' : 'Accompanied Test Groups'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Ausgewählte Nutzer testen neue Funktionen unter fachlicher Begleitung'
                        : 'Selected users test new features under professional supervision'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'de' ? 'Experten-Review' : 'Expert Review'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Psychologen, GfK-Trainer, IFS-Coaches und KI-Experten bewerten die Ergebnisse'
                        : 'Psychologists, NVC trainers, IFS coaches, and AI experts evaluate the results'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'de' ? 'Freigabe' : 'Release'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Erst nach positiver Bewertung erfolgt die Freigabe für alle Nutzer'
                        : 'Release to all users only after positive evaluation'}
                    </p>
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection 
              number="4.2" 
              title={language === 'de' ? 'Unbedenklichkeitserklärung & Risikoprofil' : 'Safety Declaration & Risk Profile'}
            >
              <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl mb-4">
                <FileCheck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-foreground font-medium mb-2">
                    {language === 'de' ? 'Dokumentierte Sicherheitsbewertung' : 'Documented Safety Assessment'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'de'
                      ? 'Nach jedem größeren Update wird eine umfassende Unbedenklichkeitserklärung erstellt, die alle relevanten Sicherheitsaspekte dokumentiert.'
                      : 'After each major update, a comprehensive safety declaration is created that documents all relevant security aspects.'}
                  </p>
                </div>
              </div>
              
              <p className="mb-4">
                {language === 'de'
                  ? 'Die Dokumentation umfasst:'
                  : 'The documentation includes:'}
              </p>
              <ListBlock items={language === 'de'
                ? [
                  'Technische Sicherheitsprüfung (Datenschutz, Verschlüsselung)',
                  'KI-Sicherheitsbewertung (Bias, schädliche Ausgaben)',
                  'Psychologische Risikobewertung',
                  'Identifizierte Risiken und Mitigationsmaßnahmen',
                  'Empfehlungen der externen Experten',
                  'Freigabeerklärung des interdisziplinären Teams'
                ]
                : [
                  'Technical security review (privacy, encryption)',
                  'AI safety assessment (bias, harmful outputs)',
                  'Psychological risk assessment',
                  'Identified risks and mitigation measures',
                  'Recommendations from external experts',
                  'Release declaration from the interdisciplinary team'
                ]}
              />
            </SubSection>
          </ChapterSection>
        </div>

        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 sm:p-8 bg-accent/10 rounded-2xl border border-accent/30"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h3 className="text-xl font-serif text-foreground mb-3">
                {language === 'de' ? 'Unser Sicherheitsversprechen' : 'Our Security Commitment'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'de'
                  ? 'Wir verstehen, dass die Arbeit mit persönlichen Erinnerungen und inneren Prozessen ein hohes Maß an Vertrauen erfordert. Deshalb setzen wir auf maximale Transparenz und die Einbeziehung unabhängiger Experten aus verschiedenen Fachrichtungen.'
                  : 'We understand that working with personal memories and inner processes requires a high level of trust. That\'s why we rely on maximum transparency and the involvement of independent experts from various disciplines.'}
              </p>
              <p className="text-foreground font-medium">
                {language === 'de'
                  ? 'Ihre Sicherheit – technisch, psychologisch und inhaltlich – ist die Grundlage unserer Arbeit.'
                  : 'Your safety – technical, psychological, and content-wise – is the foundation of our work.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact for Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Fragen zur Sicherheit? Kontaktieren Sie uns unter '
              : 'Questions about security? Contact us at '}
            <a href="mailto:sicherheit@beyondtheshallow.de" className="text-accent hover:underline">
              sicherheit@beyondtheshallow.de
            </a>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-chapter-divider relative overflow-hidden">
        <PolygonalBackground variant="warm" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-serif text-xl text-foreground mb-2">Beyond the Shallow Through Memories</p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              {language === 'de' ? 'Startseite' : 'Home'}
            </Link>
            <Link to="/oria" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Oria
            </Link>
            <Link to="/anleitung" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              {language === 'de' ? 'Anleitung' : 'Guide'}
            </Link>
            <Link to="/impressum" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              {language === 'de' ? 'Impressum' : 'Legal Notice'}
            </Link>
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Beyond Bias gUG. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Security;
