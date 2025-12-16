import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Send, 
  Plus, 
  MessageSquare, 
  Loader2, 
  LogOut,
  Trash2,
  Music
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const Coach = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation);
    }
  }, [currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    setConversations(data || []);
    
    if (data && data.length > 0 && !currentConversation) {
      setCurrentConversation(data[0].id);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages((data || []).map(m => ({ ...m, role: m.role as 'user' | 'assistant' })));
  };

  const createNewConversation = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: t('coach.newConversation') })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Fehler',
        description: 'Konversation konnte nicht erstellt werden.',
        variant: 'destructive',
      });
      return;
    }

    setConversations(prev => [data, ...prev]);
    setCurrentConversation(data.id);
    setMessages([]);
  };

  const deleteConversation = async (id: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Fehler',
        description: 'Konversation konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
      return;
    }

    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (currentConversation === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setCurrentConversation(remaining.length > 0 ? remaining[0].id : null);
      setMessages([]);
    }
  };

  const detectSongLink = (text: string): string | null => {
    const patterns = [
      /https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /https?:\/\/youtu\.be\/[\w-]+/,
      /https?:\/\/open\.spotify\.com\/track\/[\w-]+/,
      /https?:\/\/music\.apple\.com\/[\w/-]+/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentConversation || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    
    const songLink = detectSongLink(userMessage);
    
    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    // Save user message to database
    const { data: savedUserMsg, error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation,
        role: 'user',
        content: userMessage,
      })
      .select()
      .single();

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
      toast({
        title: 'Fehler',
        description: 'Nachricht konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
      return;
    }

    const typedUserMsg = { ...savedUserMsg, role: savedUserMsg.role as 'user' | 'assistant' };
    // Replace temp message with saved one
    setMessages(prev => prev.map(m => m.id === tempUserMessage.id ? typedUserMsg : m));

    // Update conversation title if it's the first message
    if (messages.length === 0) {
      const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
      await supabase
        .from('conversations')
        .update({ title })
        .eq('id', currentConversation);
      
      setConversations(prev => prev.map(c => 
        c.id === currentConversation ? { ...c, title } : c
      ));
    }

    // Prepare messages for AI
    const chatMessages = [...messages, savedUserMsg].map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Add song context hint if detected
    if (songLink) {
      chatMessages[chatMessages.length - 1].content += `\n\n[Ein Song-Link wurde geteilt: ${songLink}. Bitte analysiere diesen Song im Kontext des Beyond Bias Modells.]`;
    }

    setIsStreaming(true);
    let assistantContent = '';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: chatMessages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'AI service error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      // Add streaming assistant message
      const streamingMessage: Message = {
        id: `streaming-${Date.now()}`,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, streamingMessage]);

      while (reader) {
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
              setMessages(prev => prev.map(m =>
                m.id === streamingMessage.id ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Save assistant message to database
      const { data: savedAssistantMsg, error: assistantMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation,
          role: 'assistant',
          content: assistantContent,
        })
        .select()
        .single();

      if (assistantMsgError) {
        console.error('Error saving assistant message:', assistantMsgError);
      } else {
        const typedAssistantMsg = { ...savedAssistantMsg, role: savedAssistantMsg.role as 'user' | 'assistant' };
        setMessages(prev => prev.map(m =>
          m.id === streamingMessage.id ? typedAssistantMsg : m
        ));
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation);

    } catch (error) {
      console.error('Streaming error:', error);
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten.',
        variant: 'destructive',
      });
      // Remove streaming message on error
      setMessages(prev => prev.filter(m => !m.id.startsWith('streaming-')));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t('nav.toHome')}
          </Link>
          <Button onClick={createNewConversation} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t('coach.newConversation')}
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                  currentConversation === conv.id
                    ? "bg-secondary"
                    : "hover:bg-secondary/50"
                )}
                onClick={() => setCurrentConversation(conv.id)}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            {t('auth.signOut')}
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <h1 className="font-serif text-lg">{t('coach.title')}</h1>
        </header>

        {currentConversation ? (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-serif mb-2">{t('coach.welcome')}</p>
                    <p className="text-sm">{t('coach.welcomeDesc')}</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-secondary rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('coach.inputPlaceholder')}
                  disabled={isStreaming}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!input.trim() || isStreaming}>
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t('coach.hint')}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{t('coach.noConversation')}</p>
              <Button onClick={createNewConversation}>
                <Plus className="h-4 w-4 mr-2" />
                {t('coach.newConversation')}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Coach;
