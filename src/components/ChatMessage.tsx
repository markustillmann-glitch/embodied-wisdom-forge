import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, onSpeak, isSpeaking = false }) => {
  const isUser = role === 'user';
  // Filter out internal command blocks that shouldn't be shown to users
  const filterInternalBlocks = (text: string): string => {
    let filtered = text;
    
    // Remove [SAVE_MEMORY]...[/SAVE_MEMORY] blocks (including JSON content)
    filtered = filtered.replace(/```json\s*\[SAVE_MEMORY\][\s\S]*?\[\/SAVE_MEMORY\]\s*```/gi, '');
    filtered = filtered.replace(/\[SAVE_MEMORY\][\s\S]*?\[\/SAVE_MEMORY\]/gi, '');
    
    // Remove [DEEPEN_IDEA]...[/DEEPEN_IDEA] blocks
    filtered = filtered.replace(/```json\s*\[DEEPEN_IDEA\][\s\S]*?\[\/DEEPEN_IDEA\]\s*```/gi, '');
    filtered = filtered.replace(/\[DEEPEN_IDEA\][\s\S]*?\[\/DEEPEN_IDEA\]/gi, '');
    
    // Remove any orphaned JSON code blocks that look like internal commands
    filtered = filtered.replace(/```json\s*\{\s*"title"[\s\S]*?\}\s*```/gi, '');
    
    // Clean up excessive whitespace left behind
    filtered = filtered.replace(/\n{3,}/g, '\n\n');
    filtered = filtered.trim();
    
    return filtered;
  };

  const formatContent = (text: string) => {
    // First filter out internal blocks
    const cleanedText = filterInternalBlocks(text);
    
    // Split by double newlines to identify paragraphs/blocks
    const blocks = cleanedText.split(/\n\n+/);
    
    return blocks.map((block, blockIndex) => {
      // Check if it's a numbered list block
      if (/^\d+\.\s/.test(block)) {
        const items = block.split(/\n(?=\d+\.\s)/);
        return (
          <ol key={blockIndex} className="list-decimal list-outside ml-5 space-y-2 my-3 [counter-reset:list-counter]">
            {items.map((item, i) => {
              const content = item.replace(/^\d+\.\s*/, '');
              return <li key={i} className="pl-1 [display:list-item]">{formatInline(content)}</li>;
            })}
          </ol>
        );
      }
      
      // Check if it's a bullet list block
      if (/^[-•]\s/.test(block)) {
        const items = block.split(/\n(?=[-•]\s)/);
        return (
          <ul key={blockIndex} className="list-disc list-outside ml-5 space-y-2 my-3">
            {items.map((item, i) => {
              const content = item.replace(/^[-•]\s*/, '');
              return <li key={i} className="pl-1">{formatInline(content)}</li>;
            })}
          </ul>
        );
      }
      
      // Check if it's a blockquote
      if (block.startsWith('>')) {
        const quoteContent = block.replace(/^>\s*/gm, '');
        return (
          <blockquote key={blockIndex} className="border-l-3 border-accent/50 pl-4 my-3 italic text-muted-foreground">
            {formatInline(quoteContent)}
          </blockquote>
        );
      }
      
      // Check for headers (### or ##)
      if (/^#{1,3}\s/.test(block)) {
        const level = block.match(/^(#{1,3})/)?.[1].length || 1;
        const headerContent = block.replace(/^#{1,3}\s*/, '');
        const HeadingClass = level === 1 
          ? "text-lg font-semibold mt-4 mb-2" 
          : level === 2 
            ? "text-base font-semibold mt-3 mb-2" 
            : "text-sm font-semibold mt-3 mb-1.5";
        return (
          <p key={blockIndex} className={HeadingClass}>
            {formatInline(headerContent)}
          </p>
        );
      }
      
      // Regular paragraph - handle line breaks within
      const lines = block.split('\n');
      return (
        <p key={blockIndex} className="my-2 leading-relaxed">
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {formatInline(line)}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };
  
  const formatInline = (text: string): React.ReactNode => {
    // Handle bold, italic, and inline code
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    // Pattern for **bold**, *italic*, `code`, and emoji highlights like 🎯, 💡, ✨
    const patterns = [
      { regex: /\*\*([^*]+)\*\*/, render: (match: string) => <strong key={key++} className="font-semibold text-foreground">{match}</strong> },
      { regex: /\*([^*]+)\*/, render: (match: string) => <em key={key++} className="italic">{match}</em> },
      { regex: /`([^`]+)`/, render: (match: string) => <code key={key++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{match}</code> },
      { regex: /_(.*?)_/, render: (match: string) => <em key={key++} className="italic">{match}</em> },
    ];
    
    while (remaining.length > 0) {
      let earliestMatch: { index: number; length: number; render: React.ReactNode } | null = null;
      
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match && match.index !== undefined) {
          if (!earliestMatch || match.index < earliestMatch.index) {
            earliestMatch = {
              index: match.index,
              length: match[0].length,
              render: pattern.render(match[1])
            };
          }
        }
      }
      
      if (earliestMatch) {
        if (earliestMatch.index > 0) {
          parts.push(remaining.substring(0, earliestMatch.index));
        }
        parts.push(earliestMatch.render);
        remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
      } else {
        parts.push(remaining);
        break;
      }
    }
    
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.25, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn(
        "flex gap-2 sm:gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] sm:max-w-[75%] px-4 py-[10px] ios-font",
          isUser
            ? "bg-primary text-primary-foreground rounded-[20px] rounded-br-[6px]"
            : "bg-secondary text-secondary-foreground rounded-[20px] rounded-bl-[6px] shadow-sm"
        )}
      >
        <div className={cn(
          "ios-body",
          "[&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
          "[&_ol]:my-2 [&_ol]:ml-5 [&_ol]:space-y-1.5",
          "[&_ul]:my-2 [&_ul]:ml-5 [&_ul]:space-y-1.5",
          "[&_li]:pl-0.5",
          "[&_strong]:font-semibold",
          "[&_em]:italic",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:italic [&_blockquote]:opacity-80"
        )}>
          {formatContent(content)}
        </div>
        
        {/* Read aloud button for assistant messages - iOS style */}
        {role === 'assistant' && onSpeak && (
          <div className="flex justify-end mt-2 pt-2 border-t border-border/20">
            <button
              onClick={() => onSpeak(content)}
              disabled={isSpeaking}
              className="ios-button-text flex items-center gap-1.5 ios-caption opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40"
            >
              {isSpeaking ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
              Vorlesen
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
