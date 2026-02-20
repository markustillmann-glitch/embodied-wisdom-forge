export interface TriggerCard {
  id: string;
  category: string;
  icon: string;
  title: string;
  typischerAnteil: string;
  managerReaktion: string;
  beduerfnis: string;
  wasPassiert: string;
  koerpersignale: string;
  innereTriggerGeschichte: string;
  selfCheck: string[];
  regulation: string;
  reframing: string;
  integrationsfrage: string;
}

export const triggerCategories = [
  { id: 'beziehung', label: 'Beziehung & Bindung', icon: '💞' },
  { id: 'leistung', label: 'Leistung & Arbeit', icon: '⚡' },
  { id: 'familie', label: 'Familie & Herkunft', icon: '🌳' },
  { id: 'selbstwert', label: 'Selbstwert & Identität', icon: '🪞' },
  { id: 'sicherheit', label: 'Sicherheit & Kontrolle', icon: '🛡️' },
  { id: 'intimitaet', label: 'Intimität', icon: '🔥' },
  { id: 'status', label: 'Status & Soziales', icon: '👑' },
  { id: 'sinn', label: 'Sinn & Spiritualität', icon: '🌙' },
  { id: 'koerper', label: 'Körper & Gesundheit', icon: '🫀' },
  { id: 'zukunft', label: 'Zukunft & Lebensplanung', icon: '🧭' },
];
