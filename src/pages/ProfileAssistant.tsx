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
    // Match both with and without code blocks, handle multiline JSON
    const regexPatterns = [
      /```json\s*\[PROFILE_UPDATE\]\s*(\{[\s\S]*?\})\s*\[\/PROFILE_UPDATE\]\s*```/g,
      /```\s*\[PROFILE_UPDATE\]\s*(\{[\s\S]*?\})\s*\[\/PROFILE_UPDATE\]\s*```/g,
      /\[PROFILE_UPDATE\]\s*(\{[\s\S]*?\})\s*\[\/PROFILE_UPDATE\]/g,
    ];
    
    const updates: { field_name: string; value: any }[] = [];
    
    for (const regex of regexPatterns) {
      let match;
      while ((match = regex.exec(content)) !== null) {
        try {
          // Clean the JSON string - remove newlines and extra spaces
          const jsonStr = match[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
          const parsed = JSON.parse(jsonStr);
          
          // Validate the parsed object has required fields
          if (parsed.field_name && parsed.value !== undefined) {
            // Check if we already have this field to avoid duplicates
            if (!updates.some(u => u.field_name === parsed.field_name)) {
              updates.push(parsed);
              console.log('Parsed profile update:', parsed);
            }
          }
        } catch (e) {
          console.error('Failed to parse profile update JSON:', match[1], e);
        }
      }
    }
    
    if (updates.length > 0 && user) {
      // Build the update object
      const profileUpdate: Record<string, unknown> = {};
      updates.forEach(update => {
        // Ensure array fields are properly formatted
        const arrayFields = [
          'core_needs', 'neglected_needs', 'over_fulfilled_needs', 'belonging_through',
          'primary_memory_channel', 'preferred_tone', 'response_preference', 'language_triggers',
          'current_focus', 'safe_places', 'power_sources', 'body_anchors', 'self_qualities'
        ];
        
        if (arrayFields.includes(update.field_name)) {
          // Ensure it's an array
          if (typeof update.value === 'string') {
            profileUpdate[update.field_name] = update.value.split(',').map((s: string) => s.trim());
          } else if (Array.isArray(update.value)) {
            profileUpdate[update.field_name] = update.value;
          } else {
            profileUpdate[update.field_name] = [String(update.value)];
          }
        } else {
          // String fields
          profileUpdate[update.field_name] = String(update.value);
        }
      });
      
      console.log('Saving profile update:', profileUpdate);
      
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      let error;
      if (existingProfile) {
        // Update existing profile
        const result = await supabase
          .from('user_profiles')
          .update(profileUpdate)
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Insert new profile
        const result = await supabase
          .from('user_profiles')
          .insert({ ...profileUpdate, user_id: user.id });
        error = result.error;
      }
      
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: language === 'de' ? 'Fehler beim Speichern' : 'Save error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Profile saved successfully');
        toast({
          title: language === 'de' ? 'Profil aktualisiert' : 'Profile updated',
          description: language === 'de' 
            ? `${updates.length} Feld(er) gespeichert`
            : `${updates.length} field(s) saved`,
        });
      }
    }
    
    // Remove all PROFILE_UPDATE blocks from displayed content
    let cleanedContent = content;
    cleanedContent = cleanedContent.replace(/```json\s*\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]\s*```/g, '');
    cleanedContent = cleanedContent.replace(/```\s*\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]\s*```/g, '');
    cleanedContent = cleanedContent.replace(/\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]/g, '');
    return cleanedContent.trim();
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
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header - Mobile optimized with safe area */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between gap-2">
          <Link 
            to="/profile" 
            className="flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] -ml-2 pl-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">{t('profileAssistant.backToProfile')}</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {mode === 'quick' && hasStarted ? (
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            ) : (
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            )}
            <h1 className="font-serif text-sm sm:text-base truncate max-w-[180px] sm:max-w-none">
              {hasStarted && mode === 'quick' 
                ? (language === 'de' ? 'Schnellprofil' : 'Quick Profile')
                : t('profileAssistant.title')
              }
            </h1>
          </div>
          <div className="w-11 sm:w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden">
        {!hasStarted ? (
          /* Mode Selection - Mobile optimized */
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="text-center space-y-4 sm:space-y-6 max-w-lg w-full">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <div className="px-2">
                <h2 className="text-xl sm:text-2xl font-serif mb-2">{t('profileAssistant.welcome')}</h2>
                <p className="text-sm sm:text-base text-muted-foreground">{t('profileAssistant.welcomeDesc')}</p>
              </div>
              
              <div className="grid gap-3 pt-2 sm:pt-4">
                {/* Quick Profile - Highlighted with better touch target */}
                <Button
                  onClick={() => startConversation('quick')}
                  className="h-auto min-h-[72px] py-4 sm:py-5 flex flex-col gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:from-amber-700 active:to-orange-700 text-white border-0 touch-manipulation"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-medium text-base">{language === 'de' ? 'Schnellprofil' : 'Quick Profile'}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">~3 min</span>
                  </div>
                  <span className="text-xs sm:text-sm text-white/90">
                    {language === 'de' 
                      ? '5 wichtige Fragen für den schnellen Start'
                      : '5 key questions for a quick start'}
                  </span>
                </Button>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <Button
                    onClick={() => startConversation('initial')}
                    variant="outline"
                    className="h-auto min-h-[72px] py-4 sm:py-5 flex flex-col gap-1.5 sm:gap-2 touch-manipulation"
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
                      className="h-auto min-h-[72px] py-4 sm:py-5 flex flex-col gap-1.5 sm:gap-2 touch-manipulation"
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span className="font-medium">{t('profileAssistant.revise')}</span>
                      <span className="text-xs text-muted-foreground">{t('profileAssistant.reviseDesc')}</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground pt-2 px-4">
                {language === 'de'
                  ? 'Das Schnellprofil ist der beste Start – du kannst es jederzeit erweitern.'
                  : 'The quick profile is the best start – you can expand it anytime.'}
              </p>
            </div>
          </div>
        ) : (
          /* Chat Interface - Mobile optimized */
          <>
            <ScrollArea className="flex-1 px-3 sm:px-4 py-3" ref={scrollRef}>
              <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto pb-2">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    role={message.role}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {mode === 'quick' ? (
                        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      )}
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2.5 sm:py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area - Mobile optimized with safe area */}
            <div className="border-t border-border bg-background px-3 sm:px-4 py-2 sm:py-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('profileAssistant.inputPlaceholder')}
                  disabled={isLoading}
                  className="min-h-[44px] max-h-28 sm:max-h-32 resize-none text-base leading-relaxed"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 h-11 w-11 touch-manipulation"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
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
