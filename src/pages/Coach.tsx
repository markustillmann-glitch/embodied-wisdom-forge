import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Send, 
  Plus, 
  MessageSquare, 
  Loader2, 
  LogOut,
  Trash2,
  Music,
  Music2,
  Heart,
  Briefcase,
  Users,
  BookOpen,
  X,
  Menu,
  Plane,
  Trophy,
  UserCheck,
  Archive,
  Save,
  Sparkles,
  Pencil,
  MoreVertical,
  Brain,
  Download,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import bbOwlLogo from '@/assets/bb-owl-new.png';

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

interface UserProfile {
  displayName: string | null;
  previousTopics?: string[];
}

const Coach = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Save memory dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memorySummary, setMemorySummary] = useState('');
  const [memoryEmotion, setMemoryEmotion] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [coachSuggestions, setCoachSuggestions] = useState<{title?: string, summary?: string, emotion?: string} | null>(null);

  // Rename dialog state
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);

  // Psychogram state
  const [psychogramDialogOpen, setPsychogramDialogOpen] = useState(false);
  const [psychogramContent, setPsychogramContent] = useState<string>('');
  const [psychogramMemoryCount, setPsychogramMemoryCount] = useState<number>(0);
  const [isGeneratingPsychogram, setIsGeneratingPsychogram] = useState(false);
  const [psychogramCompact, setPsychogramCompact] = useState(false);
  const extractCoachSuggestions = () => {
    // Look through recent assistant messages for suggestions
    const recentAssistantMessages = messages
      .filter(m => m.role === 'assistant')
      .slice(-5)
      .map(m => m.content)
      .join('\n');
    
    const suggestions: {title?: string, summary?: string, emotion?: string} = {};
    
    // Look for title suggestions (common patterns from coach)
    const titlePatterns = [
      /Titel[:\s]*[„"«]([^"»„]+)[»""]/i,
      /Titel[:\s]*["']([^"']+)["']/i,
      /vorgeschlagener Titel[:\s]*[„"«]([^"»„]+)[»""]/i,
      /Title[:\s]*[„"«]([^"»„]+)[»""]/i,
      /\*\*Titel\*\*[:\s]*([^\n]+)/i,
    ];
    
    for (const pattern of titlePatterns) {
      const match = recentAssistantMessages.match(pattern);
      if (match) {
        suggestions.title = match[1].trim();
        break;
      }
    }
    
    // Look for summary suggestions
    const summaryPatterns = [
      /Zusammenfassung[:\s]*[„"«]([^"»„]+)[»""]/i,
      /Zusammenfassung[:\s]*["']([^"']+)["']/i,
      /Summary[:\s]*[„"«]([^"»„]+)[»""]/i,
      /\*\*Zusammenfassung\*\*[:\s]*([^\n]+(?:\n[^\n*]+)*)/i,
    ];
    
    for (const pattern of summaryPatterns) {
      const match = recentAssistantMessages.match(pattern);
      if (match) {
        suggestions.summary = match[1].trim();
        break;
      }
    }
    
    // Look for emotion suggestions
    const emotionPatterns = [
      /Gefühl[:\s]*[„"«]([^"»„]+)[»""]/i,
      /Emotion[:\s]*[„"«]([^"»„]+)[»""]/i,
      /dominante[s]?\s*Gefühl[:\s]*([^\n.,]+)/i,
      /\*\*Emotion\*\*[:\s]*([^\n]+)/i,
      /\*\*Gefühl\*\*[:\s]*([^\n]+)/i,
    ];
    
    for (const pattern of emotionPatterns) {
      const match = recentAssistantMessages.match(pattern);
      if (match) {
        suggestions.emotion = match[1].trim();
        break;
      }
    }
    
    return Object.keys(suggestions).length > 0 ? suggestions : null;
  };

  const openSaveDialog = () => {
    const suggestions = extractCoachSuggestions();
    setCoachSuggestions(suggestions);
    if (suggestions) {
      if (suggestions.title) setMemoryTitle(suggestions.title);
      if (suggestions.summary) setMemorySummary(suggestions.summary);
      if (suggestions.emotion) setMemoryEmotion(suggestions.emotion);
    }
    setSaveDialogOpen(true);
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close sidebar on mobile when conversation is selected
  const selectConversation = (id: string) => {
    setCurrentConversation(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

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
    if (user) {
      loadUserProfile();
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

  const loadUserProfile = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();
    
    if (profile) {
      setUserProfile({
        displayName: profile.display_name,
      });
    }
  };

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
        title: t('vault.error'),
        description: t('coach.errorCreatingConversation'),
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
        title: t('vault.error'),
        description: t('coach.errorDeletingConversation'),
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

  const openRenameDialog = (conv: Conversation) => {
    setRenameConversationId(conv.id);
    setRenameTitle(conv.title);
    setRenameDialogOpen(true);
  };

  const renameConversation = async () => {
    if (!renameConversationId || !renameTitle.trim()) return;

    const { error } = await supabase
      .from('conversations')
      .update({ title: renameTitle.trim() })
      .eq('id', renameConversationId);

    if (error) {
      toast({
        title: t('vault.error'),
        description: t('coach.errorRenamingConversation'),
        variant: 'destructive',
      });
      return;
    }

    setConversations(prev => prev.map(c => 
      c.id === renameConversationId ? { ...c, title: renameTitle.trim() } : c
    ));
    setRenameDialogOpen(false);
    setRenameConversationId(null);
    setRenameTitle('');
  };

  const openDeleteDialog = (id: string) => {
    setDeleteConversationId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConversationId) return;
    await deleteConversation(deleteConversationId);
    setDeleteDialogOpen(false);
    setDeleteConversationId(null);
  };

  const generatePsychogram = async (compact: boolean = false) => {
    setIsGeneratingPsychogram(true);
    setPsychogramCompact(compact);
    setPsychogramDialogOpen(true);
    setPsychogramContent('');
    
    try {
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-psychogram`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ language, compact }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate psychogram');
      }

      const data = await response.json();
      setPsychogramContent(data.psychogram);
      setPsychogramMemoryCount(data.memoryCount || 0);
    } catch (error) {
      console.error('Psychogram error:', error);
      toast({
        title: t('vault.error'),
        description: t('coach.psychogramError'),
        variant: 'destructive',
      });
      setPsychogramDialogOpen(false);
    } finally {
      setIsGeneratingPsychogram(false);
    }
  };

  const exportPsychogramMarkdown = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `psychogram-${date}.md`;
    const content = `# ${t('coach.psychogramTitle')}\n\n${t('coach.psychogramSubtitle').replace('{count}', String(psychogramMemoryCount))}\n\n---\n\n${psychogramContent}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPsychogramPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: t('vault.error'),
        description: 'Could not open print window. Please allow popups.',
        variant: 'destructive',
      });
      return;
    }
    
    const date = new Date().toLocaleDateString();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t('coach.psychogramTitle')}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #666; padding-bottom: 10px; }
            .subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
            .content { white-space: pre-wrap; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${t('coach.psychogramTitle')}</h1>
          <p class="subtitle">${t('coach.psychogramSubtitle').replace('{count}', String(psychogramMemoryCount))} • ${date}</p>
          <div class="content">${psychogramContent.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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

  const sendMessage = async (directMessage?: string) => {
    const messageToSend = directMessage || input.trim();
    if (!messageToSend || !currentConversation || isStreaming) return;

    const userMessage = messageToSend;
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
        title: t('vault.error'),
        description: t('coach.errorSavingMessage'),
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
      const songHint = language === 'en' 
        ? `\n\n[A song link was shared: ${songLink}. Please analyze this song in the context of the Beyond Bias model.]`
        : `\n\n[Ein Song-Link wurde geteilt: ${songLink}. Bitte analysiere diesen Song im Kontext des Beyond Bias Modells.]`;
      chatMessages[chatMessages.length - 1].content += songHint;
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
          body: JSON.stringify({ messages: chatMessages, userProfile, language }),
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

  // Detect memory type from conversation
  const detectMemoryType = (): string => {
    const firstUserMessage = messages.find(m => m.role === 'user')?.content.toLowerCase() || '';
    if (firstUserMessage.includes('konzert') || firstUserMessage.includes('concert')) return 'concert';
    if (firstUserMessage.includes('beziehung') || firstUserMessage.includes('relationship')) return 'relationship';
    if (firstUserMessage.includes('beruf') || firstUserMessage.includes('work') || firstUserMessage.includes('arbeit')) return 'work';
    if (firstUserMessage.includes('kindheit') || firstUserMessage.includes('childhood')) return 'childhood';
    if (firstUserMessage.includes('reise') || firstUserMessage.includes('travel')) return 'travel';
    if (firstUserMessage.includes('freund') || firstUserMessage.includes('friendship')) return 'friendship';
    if (firstUserMessage.includes('erfolg') || firstUserMessage.includes('success')) return 'success';
    if (firstUserMessage.includes('meditation') || firstUserMessage.includes('meditieren') || firstUserMessage.includes('meditate')) return 'meditation';
    if (firstUserMessage.includes('song') || firstUserMessage.includes('lied') || firstUserMessage.includes('lyrics') || firstUserMessage.includes('text')) return 'song';
    return 'general';
  };

  // Save memory to vault
  const saveMemory = async () => {
    if (!user) {
      console.error('Cannot save memory: No user logged in');
      toast({
        title: t('vault.error'),
        description: t('coach.pleaseLogin'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!currentConversation) {
      console.error('Cannot save memory: No conversation selected');
      toast({
        title: t('vault.error'),
        description: t('coach.noConversationSelected'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!memoryTitle.trim()) {
      console.error('Cannot save memory: No title provided');
      toast({
        title: t('vault.error'),
        description: t('coach.pleaseEnterTitle'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    
    // Compile conversation content
    const content = messages.map(m => 
      `${m.role === 'user' ? '👤' : '🦉'} ${m.content}`
    ).join('\n\n---\n\n');
    
    const memoryData = {
      user_id: user.id,
      title: memoryTitle.trim(),
      summary: memorySummary.trim() || null,
      content,
      memory_type: detectMemoryType(),
      emotion: memoryEmotion.trim() || null,
      conversation_id: currentConversation,
      memory_date: new Date().toISOString(),
    };
    
    console.log('Saving memory with data:', memoryData);
    
    const { data, error } = await supabase
      .from('memories')
      .insert(memoryData)
      .select();
    
    setIsSaving(false);
    
    if (error) {
      console.error('Error saving memory:', error);
      toast({
        title: t('vault.error'),
        description: `${t('vault.saveError')}: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      console.log('Memory saved successfully:', data);
      toast({
        title: t('vault.saved'),
        description: t('vault.savedDesc'),
      });
      setSaveDialogOpen(false);
      // Reset form
      setMemoryTitle('');
      setMemorySummary('');
      setMemoryEmotion('');
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
    <div className="h-screen flex bg-background relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 z-50",
        isMobile 
          ? "fixed inset-y-0 left-0 w-72" 
          : "w-64",
        isMobile && !sidebarOpen && "-translate-x-full",
        !isMobile && !sidebarOpen && "w-0 overflow-hidden"
      )}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t('nav.toHome')}
            </Link>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
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
                  "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                  currentConversation === conv.id
                    ? "bg-secondary"
                    : "hover:bg-secondary/50"
                )}
                onClick={() => selectConversation(conv.id)}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm truncate flex-1">{conv.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-secondary rounded transition-all">
                      <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => openRenameDialog(conv)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      {t('coach.rename')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => openDeleteDialog(conv.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('coach.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={isGeneratingPsychogram}
                className="w-full justify-start"
              >
                {isGeneratingPsychogram ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                {t('coach.psychogram')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => generatePsychogram(false)}>
                <div className="flex flex-col">
                  <span className="font-medium">{t('coach.psychogramDetailed')}</span>
                  <span className="text-xs text-muted-foreground">{t('coach.psychogramDetailedDesc')}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generatePsychogram(true)}>
                <div className="flex flex-col">
                  <span className="font-medium">{t('coach.psychogramCompact')}</span>
                  <span className="text-xs text-muted-foreground">{t('coach.psychogramCompactDesc')}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/vault">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Archive className="h-4 w-4 mr-2" />
              {t('vault.openVault')}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            {t('auth.signOut')}
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 sm:h-18 border-b border-border flex items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            <img src={bbOwlLogo} alt="Oria" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <div className="flex flex-col">
              <h1 className="font-serif text-base sm:text-lg leading-tight">{t('nav.askOria')}</h1>
              <span className="text-xs text-muted-foreground">{t('nav.yourPersonalCoach')}</span>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={openSaveDialog}
              className="shrink-0"
            >
              <Save className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t('vault.saveMemory')}</span>
            </Button>
          )}
        </header>

        {currentConversation ? (
          <>
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground px-2">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-base sm:text-lg font-serif mb-2">{t('coach.welcome')}</p>
                    <p className="text-sm mb-4 sm:mb-6">{t('coach.welcomeDesc')}</p>
                    
                    {/* Quick action buttons for journaling - responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto mt-4 sm:mt-6">
                      <button
                        onClick={() => sendMessage(t('coach.prompts.concert'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Music className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.concert')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.concert')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.relationship'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Heart className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.relationship')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.relationship')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.work'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Briefcase className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.work')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.work')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.childhood'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Users className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.childhood')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.childhood')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.travel'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Plane className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.travel')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.travel')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.friendship'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <UserCheck className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.friendship')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.friendship')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.success'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Trophy className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.success')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.success')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.meditation'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Sparkles className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.meditation')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.meditation')}</p>
                        </div>
                      </button>
                      <button
                        onClick={() => sendMessage(t('coach.prompts.song'))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 active:bg-secondary/70 transition-colors text-left"
                      >
                        <Music2 className="h-5 w-5 text-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{t('coach.promptLabels.song')}</p>
                          <p className="text-xs text-muted-foreground truncate">{t('coach.promptDesc.song')}</p>
                        </div>
                      </button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4 sm:mt-6">{t('coach.journalingHint')}</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 sm:gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3",
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
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    <div className="bg-secondary rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-3 sm:p-4 border-t border-border safe-area-inset-bottom">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('coach.inputPlaceholder')}
                  disabled={isStreaming}
                  className="flex-1 text-base"
                />
                <Button 
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  size="default"
                  className="shrink-0 px-3 sm:px-4"
                >
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2 hidden sm:block">
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

      {/* Save Memory Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-accent" />
              {t('vault.saveTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {coachSuggestions && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-accent mb-2">
                  <Sparkles className="h-4 w-4" />
                  {language === 'de' ? 'Coach-Vorschläge' : 'Coach Suggestions'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'de' 
                    ? 'Die Felder wurden mit den Vorschlägen des Coaches vorausgefüllt. Du kannst sie anpassen.' 
                    : 'Fields have been pre-filled with the coach\'s suggestions. You can adjust them.'}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                {t('vault.saveTitle')} *
                {coachSuggestions?.title && (
                  <span className="text-xs text-accent flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                  </span>
                )}
              </label>
              <Input
                value={memoryTitle}
                onChange={(e) => setMemoryTitle(e.target.value)}
                placeholder={t('vault.saveTitlePlaceholder')}
                className={cn("mt-1.5", coachSuggestions?.title && "border-accent/30")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                {t('vault.saveSummary')}
                {coachSuggestions?.summary && (
                  <span className="text-xs text-accent flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                  </span>
                )}
              </label>
              <Textarea
                value={memorySummary}
                onChange={(e) => setMemorySummary(e.target.value)}
                placeholder={t('vault.saveSummary')}
                className={cn("mt-1.5 h-20", coachSuggestions?.summary && "border-accent/30")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                {t('vault.saveEmotion')}
                {coachSuggestions?.emotion && (
                  <span className="text-xs text-accent flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                  </span>
                )}
              </label>
              <Input
                value={memoryEmotion}
                onChange={(e) => setMemoryEmotion(e.target.value)}
                placeholder="z.B. Dankbarkeit, Nostalgie, Stolz..."
                className={cn("mt-1.5", coachSuggestions?.emotion && "border-accent/30")}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                {t('nav.back')}
              </Button>
              <Button onClick={saveMemory} disabled={!memoryTitle.trim() || isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? t('vault.saving') : t('vault.saveMemory')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('coach.renameConversation')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                {t('coach.renameTitle')}
              </label>
              <Input
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="mt-1.5"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    renameConversation();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                {t('coach.cancel')}
              </Button>
              <Button onClick={renameConversation} disabled={!renameTitle.trim()}>
                {t('coach.rename')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('coach.deleteConversation')}</DialogTitle>
            <DialogDescription>{t('coach.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('coach.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('coach.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Psychogram Dialog */}
      <Dialog open={psychogramDialogOpen} onOpenChange={setPsychogramDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              {t('coach.psychogramTitle')}
              {psychogramCompact && (
                <span className="text-xs font-normal bg-accent/10 text-accent px-2 py-0.5 rounded">
                  {t('coach.psychogramCompact')}
                </span>
              )}
            </DialogTitle>
            {psychogramMemoryCount > 0 && (
              <DialogDescription>
                {t('coach.psychogramSubtitle').replace('{count}', String(psychogramMemoryCount))}
              </DialogDescription>
            )}
            {psychogramMemoryCount > 0 && psychogramMemoryCount < 20 && !isGeneratingPsychogram && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {t('coach.psychogramStabilityWarning')}
                </p>
              </div>
            )}
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto max-h-[60vh] py-4 pr-2">
            {isGeneratingPsychogram ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
                <p className="text-muted-foreground">{t('coach.generatingPsychogram')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {psychogramContent.split('\n').map((line, index) => {
                  // Main headings (##)
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-lg font-semibold text-foreground mt-6 mb-2 pb-1 border-b border-border">
                        {line.replace('## ', '')}
                      </h2>
                    );
                  }
                  // Sub-headings (###)
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-base font-medium text-foreground mt-4 mb-1">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  // Bold text (**text**)
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold text-foreground mt-3">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  // List items
                  if (line.startsWith('- ') || line.startsWith('• ')) {
                    return (
                      <div key={index} className="flex gap-2 pl-2">
                        <span className="text-accent">•</span>
                        <span className="text-muted-foreground">{line.replace(/^[-•]\s*/, '')}</span>
                      </div>
                    );
                  }
                  // Numbered list items
                  if (/^\d+\.\s/.test(line)) {
                    const [num, ...rest] = line.split('. ');
                    return (
                      <div key={index} className="flex gap-2 pl-2">
                        <span className="text-accent font-medium min-w-[1.5rem]">{num}.</span>
                        <span className="text-muted-foreground">{rest.join('. ')}</span>
                      </div>
                    );
                  }
                  // Empty lines
                  if (line.trim() === '') {
                    return <div key={index} className="h-2" />;
                  }
                  // Regular paragraphs
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
          <DialogFooter className="pt-4 border-t border-border flex-wrap gap-2">
            {psychogramContent && !isGeneratingPsychogram && (
              <>
                <Button variant="outline" size="sm" onClick={exportPsychogramMarkdown}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t('coach.exportMarkdown')}
                </Button>
                <Button variant="outline" size="sm" onClick={exportPsychogramPdf}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('coach.exportPdf')}
                </Button>
              </>
            )}
            <Button onClick={() => setPsychogramDialogOpen(false)}>
              {t('coach.closePsychogram')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coach;
