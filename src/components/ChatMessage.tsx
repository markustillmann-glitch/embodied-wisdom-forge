import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, onSpeak, isSpeaking = false }) => {
  const formatContent = (text: string) => {
    // Split by double newlines to identify paragraphs/blocks
    const blocks = text.split(/\n\n+/);
    
    return blocks.map((block, blockIndex) => {
      // Check if it's a numbered list block
      if (/^\d+\.\s/.test(block)) {
        const items = block.split(/\n(?=\d+\.\s)/);
        return (
          <ol key={blockIndex} className="list-decimal list-outside ml-5 space-y-2 my-3">
            {items.map((item, i) => {
              const content = item.replace(/^\d+\.\s*/, '');
              return <li key={i} className="pl-1">{formatInline(content)}</li>;
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
    <div
      className={cn(
        "flex gap-2 sm:gap-3",
        role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4",
          role === 'user'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary/80 text-secondary-foreground shadow-sm"
        )}
      >
        <div className={cn(
          "text-[15px] sm:text-sm",
          role === 'assistant' && "prose-sm prose-slate dark:prose-invert max-w-none"
        )}>
          {formatContent(content)}
        </div>
        
        {/* Read aloud button for assistant messages */}
        {role === 'assistant' && onSpeak && (
          <div className="flex justify-end mt-2 pt-2 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(content)}
              disabled={isSpeaking}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isSpeaking ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 mr-1" />
              )}
              Vorlesen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
