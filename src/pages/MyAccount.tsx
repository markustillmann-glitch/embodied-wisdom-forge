import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, MapPin, Package, LogOut, Edit2, Save, X, FileText } from 'lucide-react';
import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useImpulseManager, TIER_LIMITS } from '@/hooks/useImpulseManager';

interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  type: string;
  last4?: string;
  expiryDate?: string;
}

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { subscription, impulsesRemaining } = useImpulseManager();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [address, setAddress] = useState<UserAddress>({
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profile?.display_name) {
        setDisplayName(profile.display_name);
      }
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { data: existing } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      if (existing) {
        await supabase.from('profiles').update({ display_name: displayName, updated_at: new Date().toISOString() }).eq('user_id', user.id);
      } else {
        await supabase.from('profiles').insert({ user_id: user.id, display_name: displayName });
      }
      toast.success(t('account.profileSaved'));
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('account.errorSaving'));
    } finally {
      setIsSaving(false);
    }
  };

  const saveAddress = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(t('account.addressSaved'));
    setIsEditingAddress(false);
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const tierLabel = subscription?.tier === 'premium' ? 'Premium' 
    : subscription?.tier === 'basic' ? 'Oria Basic' : 'Free';
  
  const tierPrice = subscription?.tier === 'premium' ? '19,99€/Monat' 
    : subscription?.tier === 'basic' ? '7,99€/Monat' : t('pricing.startFree');

  const periodLabel = subscription?.tier === 'basic' ? t('account.thisWeek') : t('account.thisMonth');
  const limit = TIER_LIMITS[subscription?.tier || 'free'].impulsesPerPeriod;

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)]">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
          }}
        />
        <div className="relative z-10 text-center">
          <p className="text-muted-foreground mb-4">{t('account.pleaseSignIn')}</p>
          <Button onClick={() => navigate('/auth')}>{t('auth.signIn')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      <div className="relative z-10">
        <AppHeader />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)] space-y-6">
        {/* Profile Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-lg overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t('account.profile')}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            {!isEditingProfile ? (
              <button onClick={() => setIsEditingProfile(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditingProfile(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={saveProfile} disabled={isSaving} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="p-5 space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">{t('account.displayName')}</Label>
              {isEditingProfile ? (
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t('account.yourName')} className="mt-1" />
              ) : (
                <p className="text-foreground mt-1">{displayName || t('account.notSpecified')}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{t('auth.email')}</Label>
              <p className="text-foreground mt-1">{email}</p>
            </div>
          </div>
        </motion.section>

        {/* Subscription Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-lg overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{t('account.myPackage')}</h2>
              <p className="text-sm text-muted-foreground">{t('account.manageSubscription')}</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className={cn("rounded-xl p-4 border-2",
              subscription?.tier === 'premium' ? "bg-purple-50 border-purple-200" :
              subscription?.tier === 'basic' ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn("px-3 py-1 rounded-full text-sm font-semibold",
                  subscription?.tier === 'premium' ? "bg-purple-200 text-purple-800" :
                  subscription?.tier === 'basic' ? "bg-amber-200 text-amber-800" : "bg-gray-200 text-gray-800"
                )}>{tierLabel}</span>
                <span className="font-semibold text-foreground">{tierPrice}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{t('account.impulses')} {periodLabel}</span>
                  <span className="font-medium">{impulsesRemaining} / {limit}</span>
                </div>
                <div className="h-2 bg-white/80 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full",
                    subscription?.tier === 'premium' ? "bg-purple-400" :
                    subscription?.tier === 'basic' ? "bg-amber-400" : "bg-gray-400"
                  )} style={{ width: `${(impulsesRemaining / limit) * 100}%` }} />
                </div>
              </div>
            </div>
            {subscription?.tier !== 'premium' && (
              <Button onClick={() => navigate('/pricing')} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                {t('account.upgradePremium')}
              </Button>
            )}
            {subscription?.tier !== 'free' && (
              <button className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('account.cancelSubscription')}
              </button>
            )}
          </div>
        </motion.section>

        {/* Payment Method */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-lg overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{t('account.paymentMethod')}</h2>
              <p className="text-sm text-muted-foreground">{t('account.managePayment')}</p>
            </div>
          </div>
          <div className="p-5">
            {paymentMethod ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div>
                    <p className="font-medium">•••• {paymentMethod.last4}</p>
                    <p className="text-xs text-muted-foreground">{t('account.expires')} {paymentMethod.expiryDate}</p>
                  </div>
                </div>
                <button className="text-sm text-primary hover:underline">{t('account.change')}</button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">{t('account.noPayment')}</p>
                <Button variant="outline" className="rounded-xl">{t('account.addPayment')}</Button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Address */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-lg overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t('account.address')}</h2>
                <p className="text-sm text-muted-foreground">{t('account.addressDesc')}</p>
              </div>
            </div>
            {!isEditingAddress ? (
              <button onClick={() => setIsEditingAddress(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditingAddress(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={saveAddress} disabled={isSaving} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="p-5 space-y-4">
            {isEditingAddress ? (
              <>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('account.streetAndNumber')}</Label>
                  <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Musterstraße 123" className="mt-1" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('account.postalCode')}</Label>
                    <Input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="12345" className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">{t('account.city')}</Label>
                    <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Berlin" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('account.country')}</Label>
                  <Input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="Deutschland" className="mt-1" />
                </div>
              </>
            ) : (
              <div>
                {address.street || address.city ? (
                  <div className="text-foreground">
                    <p>{address.street}</p>
                    <p>{address.postalCode} {address.city}</p>
                    <p>{address.country}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('account.noAddress')}</p>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* Text Export */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button onClick={() => navigate('/text-export')}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-card border border-border/50 text-foreground hover:bg-muted transition-colors font-medium">
            <FileText className="w-5 h-5" />
            {t('account.textExport') || 'Textexport für ChatGPT'}
          </button>
        </motion.section>

        {/* Sign Out */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            {t('account.signOut')}
          </button>
        </motion.section>

        {/* Footer Links */}
        <AppFooter />
      </main>
      </div>
    </div>
  );
};

export default MyAccount;
