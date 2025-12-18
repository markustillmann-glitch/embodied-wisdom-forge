import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MemoryStats {
  date: string;
  emotion: string | null;
  memory_type: string | null;
  count: number;
}

interface ConversationStats {
  date: string;
  conversation_count: number;
}

interface MessageStats {
  date: string;
  role: string | null;
  message_count: number;
  avg_message_length: number;
}

interface TokenStats {
  date: string;
  function_name: string | null;
  model: string | null;
  total_tokens: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost: number;
  call_count: number;
}

interface UserSegment {
  segment: string | null;
  user_count: number;
}

interface InsightPattern {
  insight_type: string | null;
  confidence_level: string | null;
  count: number;
}

export interface AdminAnalyticsData {
  memoryStats: MemoryStats[];
  conversationStats: ConversationStats[];
  messageStats: MessageStats[];
  tokenStats: TokenStats[];
  userSegments: UserSegment[];
  insightPatterns: InsightPattern[];
}

export function useAdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminAndFetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError) {
          setError('Error checking admin status');
          setLoading(false);
          return;
        }

        if (!roleData) {
          setError('Access denied: Admin role required');
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // Fetch all analytics data using secure admin-only functions
        const [
          memoryRes,
          conversationRes,
          messageRes,
          tokenRes,
          segmentRes,
          insightRes
        ] = await Promise.all([
          supabase.rpc('get_analytics_memory_stats'),
          supabase.rpc('get_analytics_conversation_stats'),
          supabase.rpc('get_analytics_message_stats'),
          supabase.rpc('get_analytics_token_stats'),
          supabase.rpc('get_analytics_user_segments'),
          supabase.rpc('get_analytics_insight_patterns')
        ]);

        // Handle permission errors gracefully
        if (memoryRes.error?.message?.includes('Access denied')) {
          setError('Access denied: Admin role required');
          setLoading(false);
          return;
        }

        if (memoryRes.error) throw memoryRes.error;
        if (conversationRes.error) throw conversationRes.error;
        if (messageRes.error) throw messageRes.error;
        if (tokenRes.error) throw tokenRes.error;
        if (segmentRes.error) throw segmentRes.error;
        if (insightRes.error) throw insightRes.error;

        setData({
          memoryStats: memoryRes.data || [],
          conversationStats: conversationRes.data || [],
          messageStats: messageRes.data || [],
          tokenStats: tokenRes.data || [],
          userSegments: segmentRes.data || [],
          insightPatterns: insightRes.data || []
        });
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndFetchData();
  }, []);

  return { data, loading, error, isAdmin };
}
