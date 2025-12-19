import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2, Sparkles, RefreshCw, User, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatMessage from '@/components/ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ProfileMode = 'quick' | 'initial' | 'revision';

const ProfileAssistant = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ProfileMode>('quick');
  const [hasStarted, setHasStarted] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_profiles')
        .select('goals_motivation, core_needs')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data && (data.goals_motivation || (data.core_needs && data.core_needs.length > 0))) {
        setHasExistingProfile(true);
      }
    };
    
    checkExistingProfile();
  }, [user]);

  const startConversation = async (selectedMode: ProfileMode) => {
    setMode(selectedMode);
    setHasStarted(true);
    
    const greetings: Record<ProfileMode, { de: string; en: string }> = {
      quick: {
        de: 'Hallo! Ich möchte schnell ein Basisprofil erstellen.',
        en: 'Hello! I want to quickly create a basic profile.'
      },
      initial: {
        de: 'Hallo! Ich möchte mein vollständiges Profil erstellen.',
        en: 'Hello! I would like to create my complete profile.'
      },
      revision: {
        de: 'Hallo! Ich möchte mein Profil überarbeiten.',
        en: 'Hello! I would like to revise my profile.'
      }
    };
    
    const greeting = language === 'de' ? greetings[selectedMode].de : greetings[selectedMode].en;
    await sendMessage(greeting, selectedMode);
  };

  const parseProfileUpdates = async (content: string) => {
    const regex = /\[PROFILE_UPDATE\]\s*({[\s\S]*?})\s*\[\/PROFILE_UPDATE\]/g;
    let match;
    const updates: { field_name: string; value: any }[] = [];
    
    while ((match = regex.exec(content)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        updates.push(parsed);
      } catch (e) {
        console.error('Failed to parse profile update:', e);
      }
    }
    
    if (updates.length > 0 && user) {
      const profileUpdate: Record<string, unknown> = { user_id: user.id };
      updates.forEach(update => {
        profileUpdate[update.field_name] = update.value;
      });
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileUpdate as never, { onConflict: 'user_id' });
      
      if (error) {
        console.error('Error updating profile:', error);
      } else {
        toast({
          title: language === 'de' ? 'Profil aktualisiert' : 'Profile updated',
          description: language === 'de' 
            ? `${updates.length} Feld(er) gespeichert`
            : `${updates.length} field(s) saved`,
        });
      }
    }
    
    return content.replace(/```json\s*\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]\s*```/g, '').trim();
  };

  const sendMessage = async (messageText: string, selectedMode?: ProfileMode) => {
    if (!messageText.trim() || !user) return;
    
    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/profile-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
            language,
            mode: selectedMode || mode,
            userId: user.id,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: language === 'de' ? 'Zu viele Anfragen' : 'Too many requests',
            description: language === 'de' ? 'Bitte warte einen Moment.' : 'Please wait a moment.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';
      
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      let textBuffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      const cleanedContent = await parseProfileUpdates(assistantContent);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: cleanedContent };
        return updated;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de' ? 'Nachricht konnte nicht gesendet werden.' : 'Failed to send message.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link to="/profile" className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">{t('profileAssistant.backToProfile')}</span>
          </Link>
          <div className="flex items-center gap-2">
            {mode === 'quick' && hasStarted ? (
              <Zap className="h-5 w-5 text-amber-500" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
            <h1 className="font-serif text-sm sm:text-lg">
              {hasStarted && mode === 'quick' 
                ? (language === 'de' ? 'Schnellprofil' : 'Quick Profile')
                : t('profileAssistant.title')
              }
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {!hasStarted ? (
          /* Mode Selection */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-lg">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-serif mb-2">{t('profileAssistant.welcome')}</h2>
                <p className="text-muted-foreground">{t('profileAssistant.welcomeDesc')}</p>
              </div>
              
              <div className="grid gap-3 pt-4">
                {/* Quick Profile - Highlighted */}
                <Button
                  onClick={() => startConversation('quick')}
                  className="h-auto py-5 flex flex-col gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-medium">{language === 'de' ? 'Schnellprofil' : 'Quick Profile'}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">~3 min</span>
                  </div>
                  <span className="text-xs text-white/90">
                    {language === 'de' 
                      ? '5 wichtige Fragen für den schnellen Start'
                      : '5 key questions for a quick start'}
                  </span>
                </Button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => startConversation('initial')}
                    variant="outline"
                    className="h-auto py-5 flex flex-col gap-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{t('profileAssistant.createNew')}</span>
                    <span className="text-xs text-muted-foreground">
                      {language === 'de' ? 'Vollständiges Profil' : 'Complete profile'}
                    </span>
                  </Button>
                  
                  {hasExistingProfile && (
                    <Button
                      onClick={() => startConversation('revision')}
                      variant="outline"
                      className="h-auto py-5 flex flex-col gap-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span className="font-medium">{t('profileAssistant.revise')}</span>
                      <span className="text-xs text-muted-foreground">{t('profileAssistant.reviseDesc')}</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground pt-2">
                {language === 'de'
                  ? 'Das Schnellprofil ist der beste Start – du kannst es jederzeit erweitern.'
                  : 'The quick profile is the best start – you can expand it anytime.'}
              </p>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <>
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4 max-w-3xl mx-auto pb-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    role={message.role}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {mode === 'quick' ? (
                        <Zap className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('profileAssistant.inputPlaceholder')}
                  disabled={isLoading}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 h-11 w-11"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProfileAssistant;
