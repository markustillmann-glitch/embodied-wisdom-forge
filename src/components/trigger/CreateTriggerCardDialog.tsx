import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface CreateTriggerCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCreated: () => void;
}

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-trigger-card`;

function tryParseCard(text: string) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    if (parsed.ready && parsed.card) return parsed.card;
  } catch { /* ignore */ }
  return null;
}

const CreateTriggerCardDialog: React.FC<CreateTriggerCardDialogProps> = ({ isOpen, onClose, onCardCreated }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    setIsLoading(true);
    let assistantSoFar = '';
    const initMsg: Msg[] = [{ role: 'user', content: 'Starte den Dialog zum Erstellen einer Trigger-Karte.' }];

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: initMsg }),
      });
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistantSoFar += c;
              setMessages([{ role: 'assistant', content: assistantSoFar }]);
            }
          } catch { buf = line + '\n' + buf; break; }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages([{ role: 'assistant', content: 'Es gab ein Problem. Bitte versuche es erneut. 🌿' }]);
    }
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistantSoFar += c;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { buf = line + '\n' + buf; break; }
        }
      }

      // Check if the assistant generated a card
      const card = tryParseCard(assistantSoFar);
      if (card) setGeneratedCard(card);

    } catch (e) {
      console.error(e);
      toast.error('Fehler bei der KI-Antwort.');
    }
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const saveCard = async () => {
    if (!user || !generatedCard) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('custom_trigger_cards' as any).insert({
        user_id: user.id,
        icon: generatedCard.icon || '🔮',
        title: generatedCard.title,
        category: 'eigene',
        typischer_anteil: generatedCard.typischerAnteil || '',
        manager_reaktion: generatedCard.managerReaktion || '',
        beduerfnis: generatedCard.beduerfnis || '',
        was_passiert: generatedCard.wasPassiert || '',
        koerpersignale: generatedCard.koerpersignale || '',
        innere_trigger_geschichte: generatedCard.innereTriggerGeschichte || '',
        self_check: generatedCard.selfCheck || [],
        regulation: generatedCard.regulation || '',
        reframing: generatedCard.reframing || '',
        integrationsfrage: generatedCard.integrationsfrage || '',
      } as any);
      if (error) throw error;
      toast.success('Trigger-Karte gespeichert! 🌟');
      onCardCreated();
      handleClose();
    } catch (e) {
      console.error(e);
      toast.error('Fehler beim Speichern.');
    }
    setIsSaving(false);
  };

  const handleClose = () => {
    setMessages([]);
    setInput('');
    setGeneratedCard(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="ios-headline text-foreground">Trigger-Karte erstellen</span>
        </div>
        <button onClick={handleClose} className="p-2 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="ios-body prose prose-sm dark:prose-invert max-w-none [&_pre]:hidden [&_code]:hidden">
                    <ReactMarkdown>{msg.content.replace(/```json[\s\S]*?```/g, '')}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="ios-body">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        )}
      </div>

      {/* Generated Card Preview */}
      {generatedCard && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-4 mb-2 p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{generatedCard.icon}</span>
            <span className="ios-headline text-foreground">{generatedCard.title}</span>
          </div>
          <p className="ios-caption text-muted-foreground">{generatedCard.beduerfnis}</p>
          <button
            onClick={saveCard}
            disabled={isSaving}
            className="w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold ios-body flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Karte speichern
          </button>
        </motion.div>
      )}

      {/* Input */}
      {!generatedCard && (
        <div className="px-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Deine Antwort..."
              className="flex-1 bg-secondary rounded-xl px-4 py-3 ios-body text-foreground placeholder:text-muted-foreground outline-none border border-border/40"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-accent text-accent-foreground disabled:opacity-40"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreateTriggerCardDialog;
