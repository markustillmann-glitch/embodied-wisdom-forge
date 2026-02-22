import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserMemory } from './MemoriesSection';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MemoryChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemorySaved: (memory: UserMemory) => void;
  linkedReflectionId?: string;
  linkedPartId?: string;
  initialContext?: string;
}

export const MemoryChatDialog: React.FC<MemoryChatDialogProps> = ({
  open,
  onOpenChange,
  onMemorySaved,
  linkedReflectionId,
  linkedPartId,
  initialContext,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [memorySaved, setMemorySaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setMessages([]);
      setInput('');
      setMemorySaved(false);

      // Start with Oria's greeting
      const greeting: Message = {
        role: 'assistant',
        content: initialContext
          ? (language === 'de'
            ? `Hallo 💛 Ich sehe, du möchtest eine Erinnerung festhalten, die mit folgendem zusammenhängt:\n\n*${initialContext}*\n\nErzähl mir – was ist der besondere Moment, den du festhalten möchtest?`
            : `Hello 💛 I see you want to capture a memory related to:\n\n*${initialContext}*\n\nTell me – what's the special moment you want to capture?`)
          : (language === 'de'
            ? 'Hallo 💛 Schön, dass du eine Erinnerung festhalten möchtest! Erzähl mir – was ist passiert? Was war der besondere Moment?'
            : 'Hello 💛 Great that you want to capture a memory! Tell me – what happened? What was the special moment?'),
      };
      setMessages([greeting]);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming || !user) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/selfcare-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
            userId: user.id,
            mode: 'memory',
            language,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(language === 'de' ? 'Zu viele Anfragen. Bitte warte einen Moment.' : 'Too many requests. Please wait.');
          setIsStreaming(false);
          return;
        }
        throw new Error('Stream error');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length === updatedMessages.length + 1) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {}
        }
      }

      // Check if memory data was extracted
      const memoryMatch = assistantContent.match(/\[SAVE_MEMORY\]\s*(\{[\s\S]*?\})\s*\[\/SAVE_MEMORY\]/);
      if (memoryMatch) {
        try {
          const memoryData = JSON.parse(memoryMatch[1]);
          await saveMemory(memoryData, updatedMessages, assistantContent);
        } catch (e) {
          console.error('Failed to parse memory data:', e);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(language === 'de' ? 'Fehler beim Senden' : 'Error sending message');
    } finally {
      setIsStreaming(false);
    }
  };

  const saveMemory = async (
    data: { title: string; description: string; emotion?: string; memory_date?: string; location?: string; tags?: string[] },
    chatMessages: Message[],
    fullAssistantResponse: string
  ) => {
    if (!user || memorySaved) return;

    try {
      const chatContent = chatMessages
        .map(m => `${m.role === 'user' ? 'Du' : 'Oria'}: ${m.content}`)
        .join('\n\n');

      const { data: saved, error } = await supabase
        .from('user_memories')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          emotion: data.emotion || null,
          memory_date: data.memory_date || null,
          location: data.location || null,
          tags: data.tags || [],
          media: [],
          linked_reflection_id: linkedReflectionId || null,
          linked_part_id: linkedPartId || null,
          chat_content: chatContent,
        })
        .select()
        .single();

      if (error) throw error;

      setMemorySaved(true);
      toast.success(language === 'de' ? 'Erinnerung gespeichert! 💛' : 'Memory saved! 💛');

      if (saved) {
        onMemorySaved({
          ...saved,
          tags: saved.tags || [],
          media: (saved.media as any) || [],
        });
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    }
  };

  const filterInternalBlocks = (text: string): string => {
    let filtered = text;
    filtered = filtered.replace(/```json\s*\[SAVE_MEMORY\][\s\S]*?\[\/SAVE_MEMORY\]\s*```/gi, '');
    filtered = filtered.replace(/\[SAVE_MEMORY\][\s\S]*?\[\/SAVE_MEMORY\]/gi, '');
    filtered = filtered.replace(/\n{3,}/g, '\n\n').trim();
    return filtered;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          <DialogTitle className="text-base">
            {language === 'de' ? '✨ Erinnerung festhalten' : '✨ Capture memory'}
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' ? filterInternalBlocks(msg.content) : msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 shrink-0">
          {memorySaved ? (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Erinnerung gespeichert! Du kannst jetzt Medien hinzufügen.' : 'Memory saved! You can now add media.'}
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => onOpenChange(false)}>
                {language === 'de' ? 'Schließen' : 'Close'}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={language === 'de' ? 'Erzähl mir davon...' : 'Tell me about it...'}
                className="flex-1 resize-none border border-input rounded-xl px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-ring min-h-[40px] max-h-[100px]"
                rows={1}
                disabled={isStreaming}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
