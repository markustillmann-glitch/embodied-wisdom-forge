import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, Sparkles, Target, Users, BookOpen, Lightbulb, Shield, Compass, Zap, PenTool, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AppHeader from '@/components/AppHeader';
import bbOwlLogo from '@/assets/bb-owl-new.png';
import { modellContent as c } from '@/data/modellContent';

const Modell = () => {
  const navigate = useNavigate();
  const { t, language: lang } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)' }} />
      <AppHeader />
      <div className="relative z-10 px-4 sm:px-6 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4 py-6">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{c.hero.title[lang]}</motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"><Compass className="w-4 h-4" />{c.hero.badge[lang]}</motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground">{c.hero.subtitle[lang]}</motion.p>
          </div>

          {/* Intro */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-foreground leading-relaxed">{c.intro.p1[lang]}</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">{c.intro.p2[lang]}</p>
          </motion.div>

          {/* Vorwort */}
          <Section icon={<BookOpen className="w-5 h-5" />} title={c.ch1.title[lang]} subtitle={c.ch1.subtitle[lang]} delay={0.5}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch1.p1[lang]}</p>
            <HighlightBox>{c.ch1.highlight1[lang]}</HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">{c.ch1.p2[lang]}</p>
            <Quote>{c.ch1.quote1[lang]}</Quote>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">{c.ch1.p3[lang]}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch1.p4[lang]}</p>
            <p className="text-muted-foreground leading-relaxed">{c.ch1.p5[lang]}</p>
          </Section>

          {/* Kapitel 1 */}
          <Section icon={<Brain className="w-5 h-5" />} title={c.ch2.title[lang]} delay={0.6}>
            <h4 className="font-semibold text-foreground mb-2">{c.ch2.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch2.s1_p1[lang]}</p>
            <HighlightBox>{c.ch2.s1_highlight[lang]}</HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">{c.ch2.s1_p2[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-4">{c.ch2.s1_list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
            <p className="text-muted-foreground leading-relaxed mb-6 italic">{c.ch2.s1_conclusion[lang]}</p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch2.s2_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch2.s2_p1[lang]}</p>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <h5 className="font-medium text-foreground mb-2">{c.ch2.s2_explicit_title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch2.s2_explicit_sub[lang]}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {c.ch2.s2_explicit_items[lang].map((item, i) => <li key={i}>• {item}</li>)}
                  <li className="italic mt-2">{c.ch2.s2_explicit_quote[lang]}</li>
                </ul>
              </div>
              <div className="bg-primary/10 rounded-xl p-4">
                <h5 className="font-medium text-foreground mb-2">{c.ch2.s2_implicit_title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch2.s2_implicit_sub[lang]}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {c.ch2.s2_implicit_items[lang].map((item, i) => <li key={i}>• {item}</li>)}
                  <li className="italic mt-2">{c.ch2.s2_implicit_quote[lang]}</li>
                </ul>
              </div>
            </div>
            <Quote>{c.ch2.s2_quote[lang]}</Quote>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch2.s3_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch2.s3_p1[lang]}</p>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium">{c.ch2.s3_chain_label[lang]}</p>
              <p className="text-muted-foreground text-sm mt-2">{c.ch2.s3_chain[lang]}</p>
            </div>
          </Section>

          {/* Kapitel 2 */}
          <Section icon={<Heart className="w-5 h-5" />} title={c.ch3.title[lang]} delay={0.7}>
            <h4 className="font-semibold text-foreground mb-2">{c.ch3.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch3.s1_p1[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-4">{c.ch3.s1_list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
            <HighlightBox>{c.ch3.s1_highlight[lang]}</HighlightBox>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch3.s2_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch3.s2_p1[lang]}</p>
            <Quote>{c.ch3.s2_quote[lang]}</Quote>
            <p className="text-muted-foreground leading-relaxed mt-4">{c.ch3.s2_p2[lang]}</p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch3.s3_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch3.s3_p1[lang]}</p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch3.s4_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch3.s4_p1[lang]}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch3.s4_p2[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-4">{c.ch3.s4_list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
            <Quote>{c.ch3.s4_quote[lang]}</Quote>
          </Section>

          {/* Kapitel 3: Meditation */}
          <Section icon={<Sparkles className="w-5 h-5" />} title={c.ch4.title[lang]} delay={0.75}>
            <h4 className="font-semibold text-foreground mb-2">{c.ch4.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch4.s1_p1[lang]}</p>
            <ol className="space-y-2 text-muted-foreground mb-4 list-decimal list-inside">{c.ch4.s1_list[lang].map((item, i) => <li key={i}>{item}</li>)}</ol>
            <HighlightBox>{c.ch4.s1_highlight[lang]}</HighlightBox>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch4.s2_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch4.s2_p1[lang]}</p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch4.s3_title[lang]}</h4>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <h5 className="font-medium text-green-700 mb-2">{c.ch4.s3_integrative_title[lang]}</h5>
                <ul className="text-sm text-muted-foreground space-y-1">{c.ch4.s3_integrative_items[lang].map((item, i) => <li key={i}>• {item}</li>)}</ul>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h5 className="font-medium text-red-700 mb-2">{c.ch4.s3_retrauma_title[lang]}</h5>
                <ul className="text-sm text-muted-foreground space-y-1">{c.ch4.s3_retrauma_items[lang].map((item, i) => <li key={i}>• {item}</li>)}</ul>
              </div>
            </div>
          </Section>

          {/* Kapitel 4: IFS */}
          <Section icon={<Users className="w-5 h-5" />} title={c.ch5.title[lang]} delay={0.8}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch5.p1[lang]}</p>
            <h4 className="font-semibold text-foreground mb-2">{c.ch5.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch5.s1_p1[lang]}</p>
            <HighlightBox>{c.ch5.s1_highlight[lang]}</HighlightBox>

            <h4 className="font-semibold text-foreground mb-3 mt-6">{c.ch5.s2_title[lang]}</h4>
            <div className="space-y-3">
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h5 className="font-medium text-blue-700 mb-1">{c.ch5.manager.title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch5.manager.desc[lang]}</p>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                <h5 className="font-medium text-orange-700 mb-1">{c.ch5.firefighter.title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch5.firefighter.desc[lang]}</p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <h5 className="font-medium text-purple-700 mb-1">{c.ch5.exile.title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch5.exile.desc[lang]}</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-3 mt-6">{c.ch5.s3_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch5.s3_p1[lang]}</p>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <h5 className="font-medium text-green-700 mb-2">{c.ch5.s3_qualities_title[lang]}</h5>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                {c.ch5.s3_qualities[lang].map((q, i) => <span key={i}>• {q}</span>)}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">{c.ch5.s3_p2[lang]}</p>
            <p className="text-muted-foreground leading-relaxed mb-4 italic">{c.ch5.s3_p3[lang]}</p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch5.s4_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch5.s4_p1[lang]}</p>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch5.s5_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch5.s5_p1[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li><strong>{c.ch5.s5_manager[lang].split(':')[0]}:</strong> {c.ch5.s5_manager[lang].split(':').slice(1).join(':')}</li>
              <li><strong>{c.ch5.s5_fear[lang].split(':')[0]}:</strong> {c.ch5.s5_fear[lang].split(':').slice(1).join(':')}</li>
            </ul>
            <Quote>{c.ch5.s5_quote[lang]}</Quote>
          </Section>

          {/* Kapitel 5: NVC */}
          <Section icon={<Sparkles className="w-5 h-5" />} title={c.ch6.title[lang]} delay={0.85}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch6.p1[lang]}</p>
            <h4 className="font-semibold text-foreground mb-2">{c.ch6.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch6.s1_p1[lang]}</p>

            <h4 className="font-semibold text-foreground mb-3 mt-4">{c.ch6.s2_title[lang]}</h4>
            <div className="space-y-3">
              {c.ch6.steps.map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">{item.step}</div>
                  <div>
                    <h5 className="font-medium text-foreground">{item.title[lang]}</h5>
                    <p className="text-sm text-muted-foreground">{item.desc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch6.s3_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed">{c.ch6.s3_p1[lang]}</p>
          </Section>

          {/* Kapitel 6: Prozessmodell */}
          <Section icon={<Target className="w-5 h-5" />} title={c.ch7.title[lang]} delay={0.9}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch7.p1[lang]}</p>
            <h4 className="font-semibold text-foreground mb-3">{c.ch7.s1_title[lang]}</h4>
            <div className="space-y-2">
              {c.ch7.flow.map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-muted/30 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{item.label[lang]}</span>
                    {item.desc[lang] && <span className="text-muted-foreground ml-2">{item.desc[lang]}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mt-4 mb-4">
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h5 className="font-medium text-red-700 mb-2">{c.ch7.auto_title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch7.auto_desc[lang]}</p>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <h5 className="font-medium text-green-700 mb-2">{c.ch7.pause_title[lang]}</h5>
                <p className="text-sm text-muted-foreground">{c.ch7.pause_desc[lang]}</p>
              </div>
            </div>
            <div className="space-y-2">
              {c.ch7.flow2.map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-muted/30 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{item.label[lang]}:</span>
                    <span className="text-muted-foreground ml-2">{item.desc[lang]}</span>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-foreground mb-3 mt-6">{c.ch7.s2_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4"><strong>{c.ch7.s2_situation[lang]}</strong></p>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <h5 className="font-medium text-red-700 mb-2">{c.ch7.auto_mode_title[lang]}</h5>
                <ul className="text-sm text-muted-foreground space-y-1">{c.ch7.auto_items[lang].map((item, i) => <li key={i}><strong>{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</li>)}</ul>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <h5 className="font-medium text-green-700 mb-2">{c.ch7.int_mode_title[lang]}</h5>
                <ul className="text-sm text-muted-foreground space-y-1">{c.ch7.int_items[lang].map((item, i) => <li key={i}><strong>{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</li>)}</ul>
              </div>
            </div>
          </Section>

          {/* Kapitel 7: Bias */}
          <Section icon={<Eye className="w-5 h-5" />} title={c.ch8.title[lang]} delay={0.95}>
            <h4 className="font-semibold text-foreground mb-2">{c.ch8.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch8.s1_p1[lang]}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch8.s1_p2[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-4">{c.ch8.s1_list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
            <HighlightBox>{c.ch8.s1_highlight[lang]}</HighlightBox>
          </Section>

          {/* Kapitel 8: Journaling */}
          <Section icon={<PenTool className="w-5 h-5" />} title={c.ch9.title[lang]} delay={1.0}>
            <h4 className="font-semibold text-foreground mb-2">{c.ch9.s1_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch9.s1_p1[lang]}</p>
            <h4 className="font-semibold text-foreground mb-2 mt-6">{c.ch9.s2_title[lang]}</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch9.s2_p1[lang]}</p>
            <p className="text-muted-foreground leading-relaxed mb-2">{c.ch9.s2_p2[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-4">{c.ch9.s2_list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
          </Section>

          {/* Angrenzende Themenfelder */}
          <Section icon={<Zap className="w-5 h-5" />} title={c.ch10.title[lang]} delay={1.05}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch10.p1[lang]}</p>
            <ul className="space-y-2 text-muted-foreground">{c.ch10.list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
          </Section>

          {/* Zentrale These */}
          <Section icon={<Lightbulb className="w-5 h-5" />} title={c.ch11.title[lang]} delay={1.1}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch11.p1[lang]}</p>
            <Quote className="text-lg">{c.ch11.quote[lang]}</Quote>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-4">{c.ch11.p2[lang]}</p>
            <HighlightBox>{c.ch11.highlight[lang]}</HighlightBox>
            <p className="text-muted-foreground leading-relaxed mt-4 mb-2">{c.ch11.p3[lang]}</p>
            <ul className="space-y-2 text-muted-foreground">{c.ch11.list[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
          </Section>

          {/* Für neugierige Menschen */}
          <Section icon={<Shield className="w-5 h-5" />} title={c.ch12.title[lang]} delay={1.15}>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.ch12.p1[lang]}</p>
            <ul className="space-y-2 text-muted-foreground mb-6">{c.ch12.list1[lang].map((item, i) => <ListItem key={i}>{item}</ListItem>)}</ul>
            <h4 className="font-semibold text-foreground mb-3">{c.ch12.subtitle[lang]}</h4>
            <ul className="space-y-2 text-muted-foreground">
              {c.ch12.benefits.map((b, i) => <li key={i}><strong>{b.label[lang]}</strong> {b.desc[lang]}</li>)}
            </ul>
          </Section>

          {/* Footer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-foreground shadow-lg flex items-center justify-center mx-auto mb-4">
              <img src={bbOwlLogo} alt="Oria" className="w-12 h-12 object-contain" />
            </div>
            <p className="text-muted-foreground">{c.footer.text[lang]}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
const Section = ({ icon, title, subtitle, children, delay = 0 }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode; delay?: number }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
    </div>
    {subtitle && <p className="text-sm text-muted-foreground mb-4 ml-13">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </motion.section>
);

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl px-4 py-3 my-4">
    <p className="text-foreground font-medium leading-relaxed">👉 {children}</p>
  </div>
);

const Quote = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <blockquote className={`border-l-4 border-accent pl-4 py-2 my-4 italic ${className}`}>
    <p className="text-muted-foreground leading-relaxed">"{children}"</p>
  </blockquote>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="text-primary mt-1.5">•</span>
    <span>{children}</span>
  </li>
);

export default Modell;
