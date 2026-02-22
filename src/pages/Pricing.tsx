import { motion } from 'framer-motion';
import { Check, X, Gift, Sparkles, Star, Ticket, User } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingPlan {
  name: string;
  price: string;
  priceSubtext?: string;
  descriptionKey: string;
  features: { textKey: string; included: boolean }[];
  highlighted?: boolean;
  badgeKey?: string;
  trialNoteKey?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: '0€',
    priceSubtext: 'pricing.month',
    descriptionKey: 'pricing.getToKnow',
    trialNoteKey: 'pricing.trialNote',
    features: [
      { textKey: '3 pricing.features.reflectionsPerMonth', included: true },
      { textKey: '25 pricing.features.impulsesAvailable', included: true },
      { textKey: 'pricing.features.situationReflections', included: false },
      { textKey: 'pricing.features.extraImpulses', included: false },
      { textKey: 'pricing.features.deepReflections', included: false },
      { textKey: 'pricing.features.giftMemories', included: false },
    ],
  },
  {
    name: 'Oria Basic',
    price: '7,99€',
    priceSubtext: 'pricing.month',
    descriptionKey: 'pricing.forRegular',
    trialNoteKey: 'pricing.trialNote',
    features: [
      { textKey: '5 pricing.features.reflectionsPerWeek', included: true },
      { textKey: '50 pricing.features.impulsesAvailable', included: true },
      { textKey: 'pricing.features.situationReflections', included: true },
      { textKey: 'pricing.features.extraImpulses', included: false },
      { textKey: 'pricing.features.deepReflections', included: false },
      { textKey: 'pricing.features.giftMemories', included: false },
    ],
    highlighted: true,
    badgeKey: 'pricing.popular',
  },
  {
    name: 'Premium',
    price: '19,99€',
    priceSubtext: 'pricing.month',
    descriptionKey: 'pricing.forDeep',
    features: [
      { textKey: 'pricing.features.unlimitedReflections', included: true },
      { textKey: '100 pricing.features.impulsesAvailable', included: true },
      { textKey: 'pricing.features.situationReflections', included: true },
      { textKey: 'pricing.features.monthlyPack', included: true },
      { textKey: 'pricing.features.deepReflections', included: true },
      { textKey: 'pricing.features.giftMemories', included: true },
    ],
    badgeKey: 'pricing.allInclusive',
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [voucherCode, setVoucherCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const impulsePacks = [
    { name: t('packs.packNames.musik'), emoji: '🎵' },
    { name: t('packs.packNames.reisen'), emoji: '✈️' },
    { name: t('packs.packNames.natur'), emoji: '🌿' },
    { name: t('packs.packNames.beziehungen'), emoji: '💕' },
    { name: t('packs.packNames.kreativitaet'), emoji: '🎨' },
  ];

  const resolveFeatureText = (textKey: string): string => {
    // Handle compound keys like "3 pricing.features.reflectionsPerMonth"
    const parts = textKey.split(' ');
    if (parts.length === 2 && !isNaN(Number(parts[0]))) {
      return `${parts[0]} ${t(parts[1])}`;
    }
    return t(textKey);
  };

  const handleRedeemVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error(t('pricing.enterVoucherError'));
      return;
    }
    setIsRedeeming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.info(t('pricing.voucherComingSoon'));
    setIsRedeeming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 py-8 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 text-amber-800 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('pricing.findYourPace')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-3">{t('pricing.reflectionInYourRhythm')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('pricing.choosePackage')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}
              className={cn("relative rounded-3xl p-6 transition-all duration-300",
                plan.highlighted ? "bg-gradient-to-b from-amber-100 to-orange-100 border-2 border-amber-300 shadow-xl scale-[1.02]" : "bg-white/80 backdrop-blur-sm border border-amber-100/50 shadow-lg"
              )}
            >
              {plan.badgeKey && (
                <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold",
                  plan.highlighted ? "bg-amber-500 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                )}>{t(plan.badgeKey)}</div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t(plan.descriptionKey)}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.priceSubtext && <span className="text-muted-foreground">{t(plan.priceSubtext)}</span>}
                </div>
                {plan.trialNoteKey && <p className="text-xs text-amber-600 mt-2 font-medium">✨ {t(plan.trialNoteKey)}</p>}
              </div>
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, fi) => (
                  <div key={fi} className="flex items-start gap-3">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      feature.included ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                    )}>
                      {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <span className={cn("text-sm", feature.included ? "text-foreground" : "text-muted-foreground")}>{resolveFeatureText(feature.textKey)}</span>
                  </div>
                ))}
              </div>
              <Button className={cn("w-full rounded-xl h-12 font-medium",
                plan.highlighted ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
              )}>
                {plan.price === '0€' ? t('pricing.startFree') : t('pricing.chooseNow')}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Premium Features */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 mb-12 border border-purple-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-foreground">{t('pricing.premiumPacks')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.premiumPacksDesc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {impulsePacks.map((pack, index) => (
              <motion.div key={pack.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white/80 rounded-xl p-4 text-center border border-purple-100/50">
                <span className="text-2xl mb-2 block">{pack.emoji}</span>
                <span className="text-sm font-medium text-foreground">{pack.name}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center">{t('pricing.specificLogic')}</p>
        </motion.div>

        {/* Gift */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl p-8 mb-12 border border-rose-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-foreground">{t('pricing.giftMemories')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.giftOnlyPremium')}</p>
            </div>
          </div>
          <p className="text-foreground/80 mb-4">{t('pricing.giftDesc')}</p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/80 rounded-lg px-4 py-2 text-sm">{t('pricing.digitalIncluded')}</div>
            <div className="bg-white/80 rounded-lg px-4 py-2 text-sm">{t('pricing.printVersion')}</div>
          </div>
        </motion.div>

        {/* Voucher */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-100/50 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-foreground">{t('pricing.redeemVoucher')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.haveVoucher')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Input placeholder={t('pricing.enterVoucher')} value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              className="flex-1 h-12 rounded-xl border-amber-200 bg-white focus:border-amber-400" />
            <Button onClick={handleRedeemVoucher} disabled={isRedeeming} className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white">
              {isRedeeming ? t('pricing.checking') : t('pricing.redeem')}
            </Button>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center text-sm text-muted-foreground mt-8">
          {t('pricing.footer')}
        </motion.p>
      </main>
      <AppFooter />
    </div>
  );
};

export default Pricing;
