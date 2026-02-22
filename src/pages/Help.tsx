import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { faqItems } from '@/data/faqContent';

const Help = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToFAQ = useCallback((index: number) => {
    setTimeout(() => {
      const faqElement = faqRefs.current[index];
      const container = scrollContainerRef.current;
      
      if (faqElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = faqElement.getBoundingClientRect();
        const scrollOffset = elementRect.top - containerRect.top + container.scrollTop - 20;
        
        container.scrollTo({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    }, 150);
  }, []);

  // Handle deep linking to specific FAQ
  useEffect(() => {
    const faqParam = searchParams.get('faq');
    if (faqParam === 'wann-kann-ich-oria-nutzen') {
      setOpenIndex(0);
      scrollToFAQ(0);
    }
  }, [searchParams, scrollToFAQ]);

  const toggleFAQ = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(openIndex === index ? null : index);
    
    if (isOpening) {
      scrollToFAQ(index);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col ios-font relative overflow-hidden">
      {/* Warm Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      
      {/* Header */}
      <AppHeader />

      {/* FAQ Content */}
      <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              ref={(el) => (faqRefs.current[index] = el)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-foreground pr-4">{faq.question[language]}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-foreground/50 flex-shrink-0" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 pt-0">
                  <div className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
                    {faq.answer[language].split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-8 bg-white/30 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">{t('help.moreQuestions')}</h2>
          <p className="text-foreground/70 text-sm">
            {t('help.contactText')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
