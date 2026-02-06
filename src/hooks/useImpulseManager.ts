import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Base impulses available to all users
export const BASE_IMPULSES = [
  "Manchmal gewinnt man, manchmal lernt man",
  "Wachse und gedeihe",
  "Umgib dich mit Menschen, die dich wachsen sehen wollen",
  "Betrachte die Welt, als würdest du sie zum ersten Mal sehen",
  "Je stiller du bist, desto mehr wirst du hören",
  "Scheue dich nie, um die Hilfe zu bitten, die du brauchst",
  "Begrenze nicht die Herausforderungen, fordere die Grenzen heraus",
  "Vergleichen macht unglücklich",
  "Weniger scrollen, mehr leben",
  "Lass ab von dem, was war, und vertraue dem, was kommt",
  "Eine Umarmung macht alles besser",
  "Finde heraus, was du brauchst, scheue dich nicht, darum zu bitten",
  "Du kontrollierst deine Finanzen, nicht sie dich",
  "Aus kleinen Samen wachsen mächtige Bäume",
  "Nimm jeden Tag, wie er kommt",
  "Ein Duft kann tausend Erinnerungen zurückbringen",
  "Es sind die kleinen Dinge, die den größten Unterschied machen",
  "Die Welt gehört jenen, die lesen",
  "Kreativität ist eine unendliche Ressource: je mehr du sie nutzt, desto mehr hast du",
  "Das Leben ist ein Song: Singe!",
  "To do: Lebe den Moment",
  "Aufgeräumtes Haus, aufgeräumte Seele",
  "Wenn nicht jetzt, wann dann?",
  "Manchmal ist Entspannung das Produktivste, was man tun kann",
  "Verwandle Angst in Energie",
  "Achte auf dich von innen heraus",
  "Entwickle gesunde Gewohnheiten, nicht Einschränkungen",
  "Kleine Schritte führen zu großen Veränderungen",
  "Entspannen, erfrischen, erholen",
  "Kreiere deine eigene Stille",
  "Lehre dich die Kunst des Ausruhens",
  "Dein Heim ist ein Zufluchtsort: erfülle es mit Frieden",
  "Tanke neue Kraft, erneuere deinen Geist",
  "Verliebe dich in deine Selbstpflege",
  "Nimm dir Zeit für Dinge, die deine Seele glücklich machen",
  "In der Selbstfreundlichkeit liegt die Kraft",
  "Verbringe Quality Time mit dir selbst",
  "Lass dich von der Natur beleben",
  "Auf Regen folgt immer Sonnenschein",
  "Folge keinem Weg – gehe deinen eigenen",
  "Beruhige deinen Geist, befreie deinen Körper",
  "Dein größter Reichtum ist deine Gesundheit",
  "Nähre dich, um zu gedeihen",
  "Beginne jeden Tag mit einem positiven Gedanken und sieh, wohin er dich führt",
  "Wie du mit dir selbst sprichst, macht viel aus",
  "Das Leben ist schöner, wenn man es mit einem Freund teilt",
  "Sei freundlich zu dir selbst – du gibst dein Bestes",
  "Es gibt immer etwas, für das man dankbar sein kann",
  "Sei kämpferisch, nicht grüblerisch",
  "So, wie du bist, bist du genug",
  "Das Leben ist schöner, wenn man lacht",
  "In der Einfachheit liegt so viel Schönheit",
  "Du darfst langsam sein",
  "Ruhe ist kein Stillstand, sondern Regeneration",
  "Höre auf deinen Körper – er spricht mit dir",
  "Selbstfürsorge ist kein Luxus, sondern eine Grundlage",
  "Du musst nicht alles heute schaffen",
  "Deine Bedürfnisse sind wichtig",
  "Atme ein – lass los",
  "Grenzen setzen ist ein Akt der Selbstachtung",
  "Nicht jeder Tag muss produktiv sein",
  "Du darfst Pausen machen, ohne sie zu rechtfertigen",
  "Sanftheit ist auch eine Stärke",
  "Dein Wert hängt nicht von deiner Leistung ab",
  "Manchmal ist genug wirklich genug",
  "Erholung ist Teil des Weges, nicht die Abweichung",
  "Sei geduldig mit deinem Prozess",
  // GfK impulses
  "Ich wünsche mir, gehört zu werden, ohne mich rechtfertigen zu müssen",
  "Mir ist wichtig, dass mein Beitrag ernst genommen wird",
  "Ich brauche Raum, um mich in meinem Tempo zu entwickeln",
  "Ich sehne mich nach Klarheit darüber, was von mir erwartet wird",
  "Ich möchte mich sicher fühlen, wenn ich meine Meinung äußere",
  "Mir tut es gut, wenn meine Anstrengungen gesehen werden",
  "Ich brauche Verlässlichkeit, um entspannen zu können",
  "Ich wünsche mir Verbindung, ohne mich verbiegen zu müssen",
  "Mir ist wichtig, selbst entscheiden zu dürfen",
  "Ich brauche Pausen, um meine Kraft zu bewahren",
  "Ich möchte verstehen, was hinter dem Verhalten anderer steht",
  "Mir gibt es Ruhe, wenn Absprachen eingehalten werden",
  "Ich wünsche mir Wertschätzung – auch für kleine Schritte",
  "Ich brauche Orientierung, um mich sicher zu fühlen",
  "Ich möchte dazugehören, ohne mich anpassen zu müssen",
  "Mir ist Fairness wichtig, auch wenn Meinungen unterschiedlich sind",
  "Ich brauche Zeit, um Vertrauen aufzubauen",
  "Ich wünsche mir Offenheit für meine Perspektive",
  "Mir ist Ehrlichkeit wichtig, auch wenn sie unbequem ist",
  "Ich brauche Unterstützung, ohne dafür schwach zu sein",
  "Ich möchte mich wirksam erleben in dem, was ich tue",
  "Mir ist es wichtig, respektvoll behandelt zu werden",
  "Ich brauche Verständnis für meine Grenzen",
  "Ich wünsche mir Leichtigkeit neben all der Verantwortung",
  "Mir gibt es Kraft, wenn ich mich verbunden fühle",
  "Ich brauche Stabilität, um mutig sein zu können",
  "Ich möchte lernen dürfen, ohne bewertet zu werden",
  "Mir ist Transparenz wichtig, um Vertrauen zu entwickeln",
  "Ich brauche Anerkennung für das, was mir wichtig ist",
  "Ich wünsche mir Gleichwertigkeit im Miteinander",
  "Ich möchte mich zeigen dürfen, so wie ich bin",
  "Mir ist wichtig, dass meine Bedürfnisse Platz haben",
  "Ich brauche Ruhe, um meine Gedanken zu sortieren",
  "Ich wünsche mir Kooperation statt Konkurrenz",
  "Mir gibt es Sicherheit, wenn Konflikte offen angesprochen werden",
  "Ich brauche Sinn in dem, was ich tue",
  "Ich möchte mich respektiert fühlen – auch bei Unterschiedlichkeit",
  "Mir ist es wichtig, lernen und wachsen zu dürfen",
  "Ich brauche Verbundenheit, besonders in schwierigen Momenten",
  "Ich wünsche mir Vertrauen in meine Fähigkeiten",
  "Ich möchte Entscheidungen mittragen können, die mich betreffen",
  "Mir ist wichtig, dass Gefühle ernst genommen werden",
  "Ich brauche Erholung, um langfristig präsent zu sein",
  "Ich wünsche mir Mitgefühl – auch für mich selbst",
  "Mir gibt es Halt, wenn ich nicht alleine bin",
  "Ich brauche Freiheit innerhalb klarer Strukturen",
  "Ich möchte beitragen, auf eine Weise, die stimmig für mich ist",
  "Mir ist wichtig, gesehen zu werden – nicht nur meine Leistung",
  "Ich brauche Hoffnung, um dranzubleiben",
  "Ich wünsche mir ein Miteinander, das nährt statt erschöpft",
];

// Pack-specific impulses (only available when pack is activated)
export const PACK_IMPULSES: Record<string, string[]> = {
  musik: [
    "Welches Lied beschreibt dein Leben gerade?",
    "In der Stille findest du deinen Rhythmus",
    "Manchmal braucht die Seele Musik statt Worte",
    "Welcher Klang beruhigt dich sofort?",
    "Dein Herzschlag ist dein erster Beat",
    "Musik ist die Sprache der Emotionen",
    "Lass dich von Melodien tragen",
    "Welches Instrument wärst du?",
    "Die Pause zwischen den Tönen macht die Musik",
    "Summe deine Stimmung",
    "Finde deinen inneren Rhythmus",
    "Welches Lied verbindet dich mit deiner Kindheit?",
    "Musik kann heilen, was Worte nicht erreichen",
    "Tanz, als würde niemand zusehen",
    "Welche Melodie tröstet dich?",
    "Der Klang deiner Stimme ist einzigartig",
    "Manchmal braucht es nur ein Lied",
    "Musik öffnet verschlossene Türen",
    "Welcher Rhythmus passt zu deinem Tag?",
    "Lass die Musik durch dich fließen",
    "Deine Lieblingsmelodie sagt viel über dich",
    "Finde Harmonie in dir selbst",
    "Musik ist Meditation in Bewegung",
    "Welches Lied würdest du der Welt schenken?",
    "In jedem von uns steckt eine Melodie",
  ],
  reisen: [
    "Wohin würde dich dein Herz führen?",
    "Jede Reise beginnt mit dem ersten Schritt",
    "Welcher Ort fühlt sich wie Zuhause an?",
    "Manchmal ist der Weg das Ziel",
    "Entdecke neue Welten in dir selbst",
  ],
  natur: [
    "Die Natur kennt keine Eile",
    "Welche Jahreszeit spiegelt deine Seele?",
    "Im Wald findest du dich selbst",
    "Wasser reinigt nicht nur den Körper",
    "Verwurzelt sein und trotzdem wachsen",
  ],
  beziehungen: [
    "Wer hat dein Leben berührt?",
    "Verbindung beginnt bei dir selbst",
    "Manchmal sagt Schweigen mehr als Worte",
    "Grenzen sind Brücken, keine Mauern",
    "Liebe in all ihren Formen",
  ],
  kreativitaet: [
    "Kreativität kennt keine Regeln",
    "Was würdest du erschaffen, wenn nichts unmöglich wäre?",
    "Jeder Fehler ist ein neuer Anfang",
    "Deine Einzigartigkeit ist deine Superkraft",
    "Lass deine innere Stimme sprechen",
  ],
};

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface UserSubscription {
  tier: SubscriptionTier;
  activePacks: string[];
  impulsesUsedThisPeriod: number;
  periodStartDate: string;
  trialEndsAt?: string | null;
  isTrialActive?: boolean;
}

export interface ImpulseStatus {
  text: string;
  packId: string;
  isUsed: boolean;
  usedAt?: string;
}

// Limits per tier
export const TIER_LIMITS = {
  free: { impulsesPerPeriod: 3, periodDays: 30 }, // 3 per month
  basic: { impulsesPerPeriod: 5, periodDays: 7 }, // 5 per week
  premium: { impulsesPerPeriod: 100, periodDays: 30 }, // 100 per month
};

export function useImpulseManager() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usedImpulses, setUsedImpulses] = useState<ImpulseStatus[]>([]);
  const [availableImpulses, setAvailableImpulses] = useState<ImpulseStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [impulsesRemaining, setImpulsesRemaining] = useState(0);

  const loadSubscription = useCallback(async () => {
    if (!user) return;

    try {
      let { data: sub, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
        return;
      }

      // Create default subscription if none exists - all users get permanent premium
      if (!sub) {
        const { data: newSub, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            tier: 'premium',
            active_packs: ['basis', 'musik', 'reisen', 'natur', 'beziehungen', 'kreativitaet'],
            impulses_used_this_period: 0,
            period_start_date: new Date().toISOString().split('T')[0],
            trial_ends_at: null, // No trial - permanent premium
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating subscription:', insertError);
          return;
        }
        sub = newSub;
      }

      // All users are permanent premium - no trial/downgrade logic
      const effectiveTier: SubscriptionTier = 'premium';
      const isTrialActive = false;

      // Check if period has reset
      const tier = effectiveTier;
      const periodDays = TIER_LIMITS[tier].periodDays;
      const periodStart = new Date(sub.period_start_date);
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceStart >= periodDays) {
        // Reset period
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            impulses_used_this_period: 0,
            period_start_date: new Date().toISOString().split('T')[0],
          })
          .eq('user_id', user.id);

        if (!updateError) {
          sub.impulses_used_this_period = 0;
          sub.period_start_date = new Date().toISOString().split('T')[0];
        }
      }

      setSubscription({
        tier: effectiveTier,
        activePacks: sub.active_packs || [],
        impulsesUsedThisPeriod: sub.impulses_used_this_period,
        periodStartDate: sub.period_start_date,
        trialEndsAt: sub.trial_ends_at,
        isTrialActive,
      });

      // Calculate remaining impulses
      const limit = TIER_LIMITS[effectiveTier].impulsesPerPeriod;
      setImpulsesRemaining(Math.max(0, limit - sub.impulses_used_this_period));

    } catch (error) {
      console.error('Error in loadSubscription:', error);
    }
  }, [user]);

  const loadImpulses = useCallback(async () => {
    if (!user || !subscription) return;

    try {
      // Get all used impulses
      const { data: impulses, error } = await supabase
        .from('user_impulses')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading impulses:', error);
        return;
      }

      const used: ImpulseStatus[] = (impulses || [])
        .filter(i => i.is_used)
        .map(i => ({
          text: i.impulse_text,
          packId: i.pack_id,
          isUsed: true,
          usedAt: i.used_at,
        }));

      setUsedImpulses(used);

      // Build available impulses list (base + active packs, minus used)
      const usedTexts = new Set(used.map(i => i.text));
      
      // Add base impulses
      let allImpulses: ImpulseStatus[] = BASE_IMPULSES
        .filter(text => !usedTexts.has(text))
        .map(text => ({
          text,
          packId: 'basis',
          isUsed: false,
        }));

      // Add pack impulses if packs are active
      for (const packId of subscription.activePacks) {
        const packImpulses = PACK_IMPULSES[packId] || [];
        const available = packImpulses
          .filter(text => !usedTexts.has(text))
          .map(text => ({
            text,
            packId,
            isUsed: false,
          }));
        allImpulses = [...allImpulses, ...available];
      }

      setAvailableImpulses(allImpulses);

    } catch (error) {
      console.error('Error in loadImpulses:', error);
    }
  }, [user, subscription]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadSubscription().finally(() => setLoading(false));
    }
  }, [user, loadSubscription]);

  useEffect(() => {
    if (subscription) {
      loadImpulses();
    }
  }, [subscription, loadImpulses]);

  const useImpulse = async (impulseText: string, packId: string = 'basis'): Promise<boolean> => {
    if (!user || !subscription) return false;

    // Check if we have impulses remaining
    if (impulsesRemaining <= 0) {
      return false;
    }

    // Check if already used
    if (usedImpulses.some(i => i.text === impulseText)) {
      return false;
    }

    try {
      // Record the used impulse
      const { error: insertError } = await supabase
        .from('user_impulses')
        .insert({
          user_id: user.id,
          impulse_text: impulseText,
          pack_id: packId,
          is_used: true,
          used_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error recording impulse usage:', insertError);
        return false;
      }

      // Increment used count
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          impulses_used_this_period: subscription.impulsesUsedThisPeriod + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return false;
      }

      // Update local state
      setUsedImpulses(prev => [...prev, {
        text: impulseText,
        packId,
        isUsed: true,
        usedAt: new Date().toISOString(),
      }]);
      
      setAvailableImpulses(prev => prev.filter(i => i.text !== impulseText));
      setImpulsesRemaining(prev => prev - 1);
      
      setSubscription(prev => prev ? {
        ...prev,
        impulsesUsedThisPeriod: prev.impulsesUsedThisPeriod + 1,
      } : null);

      return true;
    } catch (error) {
      console.error('Error in useImpulse:', error);
      return false;
    }
  };

  const getRandomAvailableImpulse = (packId?: string): ImpulseStatus | null => {
    let pool = availableImpulses;
    if (packId) {
      pool = pool.filter(i => i.packId === packId);
    }
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const getPackStats = (packId: string) => {
    const packImpulses = packId === 'basis' 
      ? BASE_IMPULSES 
      : (PACK_IMPULSES[packId] || []);
    
    const total = packImpulses.length;
    const used = usedImpulses.filter(i => i.packId === packId).length;
    
    return { total, used, remaining: total - used };
  };

  return {
    subscription,
    usedImpulses,
    availableImpulses,
    loading,
    impulsesRemaining,
    useImpulse,
    getRandomAvailableImpulse,
    getPackStats,
    refresh: () => {
      loadSubscription();
    },
  };
}
