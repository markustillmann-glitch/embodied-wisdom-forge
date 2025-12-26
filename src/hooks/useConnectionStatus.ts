import { useState, useEffect, useCallback } from 'react';

interface ConnectionStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string | null;
}

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: null,
  });

  const checkConnectionSpeed = useCallback(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      const isSlowConnection = effectiveType === 'slow-2g' || 
                                effectiveType === '2g' || 
                                effectiveType === '3g' ||
                                connection.downlink < 1.5; // Less than 1.5 Mbps
      
      setStatus(prev => ({
        ...prev,
        isSlowConnection,
        connectionType: effectiveType,
      }));
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      checkConnectionSpeed();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed on mount and when connection changes
    checkConnectionSpeed();

    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', checkConnectionSpeed);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', checkConnectionSpeed);
      }
    };
  }, [checkConnectionSpeed]);

  return status;
};

// Retry fetch with exponential backoff
export const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status < 500) {
        return response;
      }
      
      // Server error, retry
      lastError = new Error(`Server error: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry if aborted by user
      if (lastError.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection.');
      }
    }
    
    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => 
        setTimeout(resolve, initialDelay * Math.pow(2, attempt))
      );
    }
  }
  
  throw lastError || new Error('Failed after multiple retries');
};

// Streaming fetch with timeout
export const streamWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number = 60000 // 60s for streaming
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    // Clear timeout on successful response (streaming will continue)
    clearTimeout(timeoutId);
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Connection timed out. Please try again.');
    }
    throw error;
  }
};
