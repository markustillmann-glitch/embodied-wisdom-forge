import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import AppFooter from '@/components/AppFooter';

interface ExportData {
  reflections: any[];
  parts: any[];
  memories: any[];
  triggerTests: any[];
  barometerResults: any[];
  savedTriggerCards: string[];
  customTriggerCards: any[];
  deepenIdeas: any[];
}

const ZONE_LABELS: Record<number, string> = {
  1: 'Reaktiv',
  2: 'Geblendet',
  3: 'Teilweise Selbstführung',
  4: 'Stabil im Selbst',
  5: 'Tiefe Selbstpräsenz',
};

const TextExport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [data, setData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [
        { data: reflections },
        { data: parts },
        { data: memories },
        { data: triggerTests },
        { data: barometerResults },
        { data: savedCards },
        { data: customCards },
        { data: ideas },
      ] = await Promise.all([
        supabase.from('memories').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('ifs_parts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_memories').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('trigger_test_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('barometer_results' as any).select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('saved_trigger_cards').select('card_id').eq('user_id', user.id),
        supabase.from('custom_trigger_cards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('deepen_ideas').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      setData({
        reflections: reflections || [],
        parts: parts || [],
        memories: memories || [],
        triggerTests: triggerTests || [],
        barometerResults: (barometerResults as any) || [],
        savedTriggerCards: (savedCards || []).map((s: any) => s.card_id),
        customTriggerCards: customCards || [],
        deepenIdeas: ideas || [],
      });
    } catch (error) {
      console.error('Error fetching export data:', error);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  const generateText = (): string => {
    if (!data) return '';

    const sections: string[] = [];
    sections.push('=== MEINE DATEN – TEXTEXPORT ===');
    sections.push(`Exportiert am: ${formatDate(new Date().toISOString())}\n`);

    // Reflections
    if (data.reflections.length > 0) {
      sections.push('━━━ REFLEXIONEN ━━━\n');
      data.reflections.forEach((r, i) => {
        sections.push(`--- Reflexion ${i + 1}: ${r.title} ---`);
        sections.push(`Datum: ${formatDate(r.created_at)}`);
        if (r.emotion) sections.push(`Emotion: ${r.emotion}`);
        if (r.location) sections.push(`Ort: ${r.location}`);
        if (r.summary) sections.push(`\nZusammenfassung:\n${r.summary}`);
        if (r.content) sections.push(`\nGespräch:\n${r.content}`);
        if (r.structured_summary) {
          const ss = r.structured_summary as any;
          if (ss.patterns?.length) sections.push(`\nMuster: ${ss.patterns.join(', ')}`);
          if (ss.needs?.length) sections.push(`Bedürfnisse: ${ss.needs.join(', ')}`);
          if (ss.insights?.length) sections.push(`Erkenntnisse: ${ss.insights.join(', ')}`);
          if (ss.recommendations) {
            sections.push(`\nEmpfehlungen:`);
            if (ss.recommendations.body_exercise) sections.push(`  Körperübung: ${ss.recommendations.body_exercise}`);
            if (ss.recommendations.micro_action) sections.push(`  Mikro-Aktion: ${ss.recommendations.micro_action}`);
            if (ss.recommendations.reflection_question) sections.push(`  Reflexionsfrage: ${ss.recommendations.reflection_question}`);
          }
        }
        if (r.feeling_after?.length) sections.push(`Gefühl danach: ${r.feeling_after.join(', ')}`);
        if (r.needs_after?.length) sections.push(`Bedürfnisse danach: ${r.needs_after.join(', ')}`);
        sections.push('');
      });
    }

    // IFS Parts
    if (data.parts.length > 0) {
      sections.push('━━━ INNERE ANTEILE (IFS) ━━━\n');
      data.parts.forEach((p, i) => {
        sections.push(`--- Anteil ${i + 1}: ${p.name} ---`);
        sections.push(`Rolle: ${p.role}`);
        if (p.age) sections.push(`Alter: ${p.age}`);
        if (p.core_emotion) sections.push(`Kernemotion: ${p.core_emotion}`);
        if (p.body_location) sections.push(`Körperstelle: ${p.body_location}`);
        if (p.trigger) sections.push(`Trigger: ${p.trigger}`);
        if (p.belief) sections.push(`Glaubenssatz: ${p.belief}`);
        if (p.need) sections.push(`Bedürfnis: ${p.need}`);
        if (p.protection_strategy) sections.push(`Schutzstrategie: ${p.protection_strategy}`);
        if (p.counterpart) sections.push(`Gegenspieler: ${p.counterpart}`);
        if (p.integration_status) sections.push(`Integrationsstand: ${p.integration_status}`);
        sections.push(`Selbstvertrauen: ${p.self_trust_level}/10`);
        if (p.ai_analysis?.text) sections.push(`\nKI-Analyse:\n${p.ai_analysis.text}`);
        sections.push('');
      });
    }

    // Memories
    if (data.memories.length > 0) {
      sections.push('━━━ ERINNERUNGEN ━━━\n');
      data.memories.forEach((m, i) => {
        sections.push(`--- Erinnerung ${i + 1}: ${m.title} ---`);
        sections.push(`Datum: ${m.memory_date ? formatDate(m.memory_date) : formatDate(m.created_at)}`);
        if (m.emotion) sections.push(`Emotion: ${m.emotion}`);
        if (m.location) sections.push(`Ort: ${m.location}`);
        if (m.description) sections.push(`Beschreibung: ${m.description}`);
        if (m.tags?.length) sections.push(`Tags: ${m.tags.join(', ')}`);
        if (m.chat_content) sections.push(`\nGespräch:\n${m.chat_content}`);
        sections.push('');
      });
    }

    // Trigger Tests
    if (data.triggerTests.length > 0) {
      sections.push('━━━ TRIGGER-SELBSTTESTS ━━━\n');
      data.triggerTests.forEach((t, i) => {
        sections.push(`--- Test ${i + 1} (${formatDate(t.created_at)}) ---`);
        const results = t.results as any[];
        if (Array.isArray(results)) {
          results.forEach((r: any) => {
            sections.push(`  ${r.category}: ${r.score}/${r.maxScore} (${r.percent}%)`);
          });
        }
        sections.push('');
      });
    }

    // Barometer Results
    if (data.barometerResults.length > 0) {
      sections.push('━━━ SELF-BAROMETER-ERGEBNISSE ━━━\n');
      data.barometerResults.forEach((b: any, i: number) => {
        sections.push(`--- Messung ${i + 1} (${formatDate(b.created_at)}) ---`);
        if (b.context) sections.push(`Bezug: ${b.context}`);
        sections.push(`Zone: ${b.zone} – ${ZONE_LABELS[b.zone] || ''}`);
        sections.push(`Gesamtwert: ${Number(b.combined_avg).toFixed(1)}/10`);
        sections.push(`8 Cs Durchschnitt: ${Number(b.qualities_avg).toFixed(1)}`);
        sections.push(`Weite-Score: ${b.weite_score}/3`);
        if (b.qualities && typeof b.qualities === 'object') {
          const q = b.qualities as Record<string, number>;
          const labels: Record<string, string> = { calm: 'Ruhe', curiosity: 'Neugier', clarity: 'Klarheit', compassion: 'Mitgefühl', confidence: 'Selbstvertrauen', courage: 'Mut', creativity: 'Kreativität', connectedness: 'Verbundenheit' };
          Object.entries(q).forEach(([key, val]) => {
            sections.push(`  ${labels[key] || key}: ${val}/10`);
          });
        }
        sections.push('');
      });
    }

    // Custom Trigger Cards
    if (data.customTriggerCards.length > 0) {
      sections.push('━━━ EIGENE TRIGGER-KARTEN ━━━\n');
      data.customTriggerCards.forEach((c, i) => {
        sections.push(`--- Karte ${i + 1}: ${c.title} ---`);
        if (c.was_passiert) sections.push(`Was passiert: ${c.was_passiert}`);
        if (c.koerpersignale) sections.push(`Körpersignale: ${c.koerpersignale}`);
        if (c.innere_trigger_geschichte) sections.push(`Innere Trigger-Geschichte: ${c.innere_trigger_geschichte}`);
        if (c.typischer_anteil) sections.push(`Typischer Anteil: ${c.typischer_anteil}`);
        if (c.manager_reaktion) sections.push(`Manager-Reaktion: ${c.manager_reaktion}`);
        if (c.beduerfnis) sections.push(`Bedürfnis: ${c.beduerfnis}`);
        if (c.regulation) sections.push(`Regulation: ${c.regulation}`);
        if (c.reframing) sections.push(`Reframing: ${c.reframing}`);
        if (c.integrationsfrage) sections.push(`Integrationsfrage: ${c.integrationsfrage}`);
        sections.push('');
      });
    }

    // Deepen Ideas
    if (data.deepenIdeas.length > 0) {
      sections.push('━━━ VERTIEFUNGSIDEEN ━━━\n');
      data.deepenIdeas.forEach((d, i) => {
        sections.push(`${i + 1}. ${d.title}${d.is_completed ? ' ✓' : ''}`);
        if (d.note) sections.push(`   Notiz: ${d.note}`);
      });
      sections.push('');
    }

    // Saved trigger card IDs
    if (data.savedTriggerCards.length > 0) {
      sections.push(`━━━ GEMERKTE TRIGGER-KARTEN (${data.savedTriggerCards.length}) ━━━`);
      sections.push(`IDs: ${data.savedTriggerCards.join(', ')}\n`);
    }

    sections.push('=== ENDE DES EXPORTS ===');
    return sections.join('\n');
  };

  const handleCopy = async () => {
    const text = generateText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(language === 'de' ? 'Text in die Zwischenablage kopiert!' : 'Text copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success('Text kopiert!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{language === 'de' ? 'Bitte melde dich an.' : 'Please log in.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            {language === 'de' ? 'Zurück' : 'Back'}
          </button>
          <h1 className="font-serif text-lg font-semibold text-foreground">
            {language === 'de' ? 'Textexport' : 'Text Export'}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchAllData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" onClick={handleCopy} disabled={loading || !data} className="gap-1.5">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? (language === 'de' ? 'Kopiert!' : 'Copied!') : (language === 'de' ? 'Alles kopieren' : 'Copy all')}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">{language === 'de' ? 'Daten werden geladen...' : 'Loading data...'}</p>
          </motion.div>
        ) : data ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'de'
                ? 'Kopiere den gesamten Text und füge ihn in ChatGPT oder ein anderes Tool ein.'
                : 'Copy the full text and paste it into ChatGPT or another tool.'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { label: 'Reflexionen', count: data.reflections.length },
                { label: 'Anteile', count: data.parts.length },
                { label: 'Erinnerungen', count: data.memories.length },
                { label: 'Barometer', count: data.barometerResults.length },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Text preview */}
            <pre className="bg-card border border-border rounded-xl p-4 text-xs text-foreground/80 whitespace-pre-wrap break-words font-mono max-h-[60vh] overflow-y-auto select-all leading-relaxed">
              {generateText()}
            </pre>

            <div className="flex justify-center mt-6">
              <Button onClick={handleCopy} disabled={loading} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopiert!' : (language === 'de' ? 'Gesamten Text kopieren' : 'Copy full text')}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </main>
      <AppFooter />
    </div>
  );
};

export default TextExport;
