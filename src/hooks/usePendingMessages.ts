import { useState, useEffect, useCallback } from 'react';

interface PendingMessage {
  id: string;
  conversationId: string;
  content: string;
  timestamp: number;
  retryCount: number;
}

const STORAGE_KEY = 'oria_pending_messages';
const MAX_RETRIES = 3;

export const usePendingMessages = () => {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);

  // Load pending messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PendingMessage[];
        // Filter out messages older than 24 hours
        const validMessages = parsed.filter(
          msg => Date.now() - msg.timestamp < 24 * 60 * 60 * 1000
        );
        setPendingMessages(validMessages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validMessages));
      }
    } catch (error) {
      console.error('Error loading pending messages:', error);
    }
  }, []);

  // Save pending messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingMessages));
  }, [pendingMessages]);

  const addPendingMessage = useCallback((conversationId: string, content: string): string => {
    const id = `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message: PendingMessage = {
      id,
      conversationId,
      content,
      timestamp: Date.now(),
      retryCount: 0,
    };
    setPendingMessages(prev => [...prev, message]);
    return id;
  }, []);

  const removePendingMessage = useCallback((id: string) => {
    setPendingMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const incrementRetryCount = useCallback((id: string): boolean => {
    let shouldRemove = false;
    setPendingMessages(prev => 
      prev.map(msg => {
        if (msg.id === id) {
          const newCount = msg.retryCount + 1;
          if (newCount >= MAX_RETRIES) {
            shouldRemove = true;
          }
          return { ...msg, retryCount: newCount };
        }
        return msg;
      }).filter(msg => msg.retryCount < MAX_RETRIES)
    );
    return shouldRemove;
  }, []);

  const getPendingForConversation = useCallback((conversationId: string): PendingMessage[] => {
    return pendingMessages.filter(msg => msg.conversationId === conversationId);
  }, [pendingMessages]);

  const clearPendingForConversation = useCallback((conversationId: string) => {
    setPendingMessages(prev => prev.filter(msg => msg.conversationId !== conversationId));
  }, []);

  return {
    pendingMessages,
    addPendingMessage,
    removePendingMessage,
    incrementRetryCount,
    getPendingForConversation,
    clearPendingForConversation,
  };
};
