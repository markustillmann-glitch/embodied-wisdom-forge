import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface IOSChatBubbleProps {
  content: React.ReactNode;
  role: 'user' | 'assistant';
  timestamp?: string;
  showTail?: boolean;
}

export const IOSChatBubble: React.FC<IOSChatBubbleProps> = ({
  content,
  role,
  timestamp,
  showTail = true,
}) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.2, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn(
        "flex gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[80%] px-4 py-[10px]",
          isUser 
            ? "bg-primary text-primary-foreground rounded-[20px] rounded-br-[4px]" 
            : "bg-secondary text-secondary-foreground rounded-[20px] rounded-bl-[4px]"
        )}
      >
        <div className={cn(
          "ios-font text-[17px] leading-[22px]",
          "[&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
          "[&_ul]:my-2 [&_ul]:ml-4 [&_ul]:space-y-1",
          "[&_ol]:my-2 [&_ol]:ml-4 [&_ol]:space-y-1",
          "[&_li]:pl-1",
          "[&_strong]:font-semibold",
          "[&_em]:italic",
          "[&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:italic [&_blockquote]:opacity-80"
        )}>
          {content}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className={cn(
            "ios-caption mt-1 opacity-60",
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default IOSChatBubble;
