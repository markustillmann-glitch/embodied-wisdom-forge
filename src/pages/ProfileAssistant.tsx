import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Loader2, Sparkles, RefreshCw, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ChatMessage from '@/components/ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ProfileAssistant = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'initial' | 'revision'>('initial');
  const [hasStarted, setHasStarted] = useState(false);
  
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

  // Check if user has existing profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_profiles')
        .select('goals_motivation, core_needs')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // If profile has some data, suggest revision mode
      if (data && (data.goals_motivation || (data.core_needs && data.core_needs.length > 0))) {
        setMode('revision');
      }
    };
    
    checkExistingProfile();
  }, [user]);

  const startConversation = async (selectedMode: 'initial' | 'revision') => {
    setMode(selectedMode);
    setHasStarted(true);
    
    // Send initial greeting
    const greeting = selectedMode === 'initial'
      ? (language === 'de' 
          ? 'Hallo! Ich möchte gerne mein Profil erstellen.'
          : 'Hello! I would like to create my profile.')
      : (language === 'de'
          ? 'Hallo! Ich möchte mein bestehendes Profil überarbeiten und aktualisieren.'
          : 'Hello! I would like to revise and update my existing profile.');
    
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
      // Build update object with all fields
      const profileUpdate: Record<string, unknown> = { user_id: user.id };
      updates.forEach(update => {
        profileUpdate[update.field_name] = update.value;
      });
      
      // Use raw upsert with type assertion for flexibility
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
    
    // Remove the JSON blocks from displayed content
    return content.replace(/```json\s*\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]\s*```/g, '').trim();
  };

  const sendMessage = async (messageText: string, selectedMode?: 'initial' | 'revision') => {
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

      // Parse and apply any profile updates
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
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="font-serif text-sm sm:text-lg">{t('profileAssistant.title')}</h1>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {!hasStarted ? (
          /* Mode Selection */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-lg">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-serif mb-2">{t('profileAssistant.welcome')}</h2>
                <p className="text-muted-foreground">{t('profileAssistant.welcomeDesc')}</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <Button
                  onClick={() => startConversation('initial')}
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                >
                  <User className="h-6 w-6" />
                  <span className="font-medium">{t('profileAssistant.createNew')}</span>
                  <span className="text-xs text-muted-foreground">{t('profileAssistant.createNewDesc')}</span>
                </Button>
                
                <Button
                  onClick={() => startConversation('revision')}
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                >
                  <RefreshCw className="h-6 w-6" />
                  <span className="font-medium">{t('profileAssistant.revise')}</span>
                  <span className="text-xs text-muted-foreground">{t('profileAssistant.reviseDesc')}</span>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground pt-4">
                {t('profileAssistant.hint')}
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
                      <Sparkles className="h-4 w-4 text-primary" />
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
