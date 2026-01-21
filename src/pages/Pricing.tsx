import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Gift, Sparkles, Star, Ticket, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PricingPlan {
  name: string;
  price: string;
  priceSubtext?: string;
  description: string;
  features: { text: string; included: boolean }[];
  highlighted?: boolean;
  badge?: string;
  trialNote?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: '0€',
    priceSubtext: '/Monat',
    description: 'Zum Kennenlernen',
    trialNote: '7 Tage alle Funktionen testen',
    features: [
      { text: '3 Reflexionen pro Monat', included: true },
      { text: '25 Impulse zur Auswahl', included: true },
      { text: 'Situations-Reflexionen', included: false },
      { text: 'Zusatz-Impulse', included: false },
      { text: 'Tiefe Reflexionen (45min)', included: false },
      { text: 'Erinnerungen verschenken', included: false },
    ],
  },
  {
    name: 'Oria Basic',
    price: '7,99€',
    priceSubtext: '/Monat',
    description: 'Für regelmäßige Selbstreflexion',
    trialNote: '7 Tage alle Funktionen testen',
    features: [
      { text: '5 Reflexionen pro Woche', included: true },
      { text: '50 Impulse zur Auswahl', included: true },
      { text: 'Situations-Reflexionen', included: true },
      { text: 'Zusatz-Impulse', included: false },
      { text: 'Tiefe Reflexionen (45min)', included: false },
      { text: 'Erinnerungen verschenken', included: false },
    ],
    highlighted: true,
    badge: 'Beliebt',
  },
  {
    name: 'Premium',
    price: '19,99€',
    priceSubtext: '/Monat',
    description: 'Für tiefgehende Selbsterfahrung',
    features: [
      { text: 'Unbegrenzte Reflexionen', included: true },
      { text: '100 Impulse zur Auswahl', included: true },
      { text: 'Situations-Reflexionen', included: true },
      { text: 'Monatlich neues Impulspaket (25 Impulse)', included: true },
      { text: 'Tiefe Reflexionen (45min)', included: true },
      { text: 'Erinnerungen verschenken', included: true },
    ],
    badge: 'Alles inklusive',
  },
];

const impulsePacks = [
  { name: 'Musik & Klang', emoji: '🎵' },
  { name: 'Reisen & Orte', emoji: '✈️' },
  { name: 'Natur & Jahreszeiten', emoji: '🌿' },
  { name: 'Beziehungen', emoji: '💕' },
  { name: 'Kreativität', emoji: '🎨' },
  { name: 'Kindheit', emoji: '🧒' },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voucherCode, setVoucherCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeemVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Bitte gib einen Voucher-Code ein');
      return;
    }

    setIsRedeeming(true);
    // Simulate voucher redemption
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For now, show a message that voucher functionality will be available soon
    toast.info('Voucher-Einlösung wird bald verfügbar sein');
    setIsRedeeming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-amber-100/50 pt-[max(env(safe-area-inset-top),20px)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/80 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-foreground/70" />
            </motion.button>
            <div>
              <h1 className="text-xl font-serif font-semibold text-foreground">Oria Pakete</h1>
              <p className="text-sm text-muted-foreground">Wähle dein passendes Paket</p>
            </div>
          </div>
          
          {/* Mein Bereich Link */}
          {user && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/my-account')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
            >
              <User className="w-4 h-4 text-foreground/70" />
              <span className="text-sm font-medium text-foreground/80">Mein Bereich</span>
            </motion.button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)]">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 text-amber-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Finde dein Tempo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-3">
            Reflexion in deinem Rhythmus
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ob gelegentlich oder intensiv – wähle das Paket, das zu deinem Leben passt.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={cn(
                "relative rounded-3xl p-6 transition-all duration-300",
                plan.highlighted
                  ? "bg-gradient-to-b from-amber-100 to-orange-100 border-2 border-amber-300 shadow-xl scale-[1.02]"
                  : "bg-white/80 backdrop-blur-sm border border-amber-100/50 shadow-lg"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold",
                  plan.highlighted
                    ? "bg-amber-500 text-white"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                )}>
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.priceSubtext && (
                    <span className="text-muted-foreground">{plan.priceSubtext}</span>
                  )}
                </div>
                {plan.trialNote && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">
                    ✨ {plan.trialNote}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      feature.included
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {feature.included ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full rounded-xl h-12 font-medium",
                  plan.highlighted
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
                )}
              >
                {plan.price === '0€' ? 'Kostenlos starten' : 'Jetzt wählen'}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Premium Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 mb-12 border border-purple-100/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Premium Impulspakete
              </h3>
              <p className="text-sm text-muted-foreground">
                Jeden Monat 25 neue thematische Impulse
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {impulsePacks.map((pack, index) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white/80 rounded-xl p-4 text-center border border-purple-100/50"
              >
                <span className="text-2xl mb-2 block">{pack.emoji}</span>
                <span className="text-sm font-medium text-foreground">{pack.name}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Spezifische Reflexionslogik angepasst an jedes Themenpaket
          </p>
        </motion.div>

        {/* Gift Memories Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl p-8 mb-12 border border-rose-100/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Erinnerungen verschenken
              </h3>
              <p className="text-sm text-muted-foreground">
                Nur im Premium-Paket verfügbar
              </p>
            </div>
          </div>

          <p className="text-foreground/80 mb-4">
            Verschenke deine wertvollsten Reflexionen als digitale Erinnerung oder als 
            wunderschön gestalteten Druck – ein einzigartiges, persönliches Geschenk.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/80 rounded-lg px-4 py-2 text-sm">
              📱 Digital-Version inklusive
            </div>
            <div className="bg-white/80 rounded-lg px-4 py-2 text-sm">
              🖼️ Print-Version (zzgl. Druck & Versand)
            </div>
          </div>
        </motion.div>

        {/* Voucher Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-100/50 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Voucher einlösen
              </h3>
              <p className="text-sm text-muted-foreground">
                Hast du einen Gutschein-Code erhalten?
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Voucher-Code eingeben"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              className="flex-1 h-12 rounded-xl border-amber-200 bg-white focus:border-amber-400"
            />
            <Button
              onClick={handleRedeemVoucher}
              disabled={isRedeeming}
              className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isRedeeming ? 'Prüfe...' : 'Einlösen'}
            </Button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Alle Preise inkl. MwSt. • Jederzeit kündbar • Sichere Zahlung
        </motion.p>
      </main>
    </div>
  );
};

export default Pricing;