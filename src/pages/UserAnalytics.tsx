import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Brain, MessageSquare, Archive, Zap, Calendar } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MemoryStats {
  memory_type: string;
  count: number;
}

interface ConversationStats {
  total: number;
  thisMonth: number;
}

interface InsightStats {
  insight_type: string;
  count: number;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const UserAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [memoryStats, setMemoryStats] = useState<MemoryStats[]>([]);
  const [conversationStats, setConversationStats] = useState<ConversationStats>({ total: 0, thisMonth: 0 });
  const [totalMessages, setTotalMessages] = useState(0);
  const [insightStats, setInsightStats] = useState<InsightStats[]>([]);
  const [totalMemories, setTotalMemories] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserAnalytics();
    }
  }, [user]);

  const fetchUserAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch memory stats by type
      const { data: memories, error: memoriesError } = await supabase
        .from('memories')
        .select('memory_type')
        .eq('user_id', user.id);

      if (memoriesError) throw memoriesError;

      // Aggregate memory stats
      const memoryTypeCounts: Record<string, number> = {};
      memories?.forEach((m) => {
        memoryTypeCounts[m.memory_type] = (memoryTypeCounts[m.memory_type] || 0) + 1;
      });
      
      const memoryStatsData = Object.entries(memoryTypeCounts).map(([type, count]) => ({
        memory_type: type,
        count,
      }));
      setMemoryStats(memoryStatsData);
      setTotalMemories(memories?.length || 0);

      // Fetch conversation stats
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id, created_at')
        .eq('user_id', user.id);

      if (convError) throw convError;

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthConvs = conversations?.filter(
        (c) => new Date(c.created_at) >= thisMonth
      ).length || 0;

      setConversationStats({
        total: conversations?.length || 0,
        thisMonth: thisMonthConvs,
      });

      // Fetch message count
      const conversationIds = conversations?.map((c) => c.id) || [];
      if (conversationIds.length > 0) {
        const { count: messageCount, error: msgError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('conversation_id', conversationIds);

        if (msgError) throw msgError;
        setTotalMessages(messageCount || 0);
      }

      // Fetch insight stats
      const { data: insights, error: insightsError } = await supabase
        .from('coach_insights')
        .select('insight_type')
        .eq('user_id', user.id);

      if (insightsError) throw insightsError;

      const insightTypeCounts: Record<string, number> = {};
      insights?.forEach((i) => {
        insightTypeCounts[i.insight_type] = (insightTypeCounts[i.insight_type] || 0) + 1;
      });
      
      const insightStatsData = Object.entries(insightTypeCounts).map(([type, count]) => ({
        insight_type: type,
        count,
      }));
      setInsightStats(insightStatsData);

    } catch (error) {
      console.error('Error fetching user analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const memoryTypeLabels: Record<string, string> = {
    general: language === 'de' ? 'Allgemein' : 'General',
    concert: language === 'de' ? 'Konzert' : 'Concert',
    relationship: language === 'de' ? 'Beziehung' : 'Relationship',
    work: language === 'de' ? 'Arbeit' : 'Work',
    childhood: language === 'de' ? 'Kindheit' : 'Childhood',
    early_childhood: language === 'de' ? 'Frühe Kindheit' : 'Early Childhood',
    travel: language === 'de' ? 'Reise' : 'Travel',
    friendship: language === 'de' ? 'Freundschaft' : 'Friendship',
    success: language === 'de' ? 'Erfolg' : 'Success',
    meditation: language === 'de' ? 'Meditation' : 'Meditation',
    song: language === 'de' ? 'Song/Lyrics' : 'Song/Lyrics',
  };

  const insightTypeLabels: Record<string, string> = {
    pattern: language === 'de' ? 'Muster' : 'Pattern',
    need: language === 'de' ? 'Bedürfnis' : 'Need',
    trigger: language === 'de' ? 'Trigger' : 'Trigger',
    strength: language === 'de' ? 'Stärke' : 'Strength',
    communication: language === 'de' ? 'Kommunikation' : 'Communication',
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memoryChartData = memoryStats.map((m) => ({
    name: memoryTypeLabels[m.memory_type] || m.memory_type,
    value: m.count,
  }));

  const insightChartData = insightStats.map((i) => ({
    name: insightTypeLabels[i.insight_type] || i.insight_type,
    count: i.count,
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/oria-coach" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t('nav.back')}
          </Link>
          <h1 className="text-lg font-semibold">{t('vault.analytics')}</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Archive className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalMemories}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'de' ? 'Erinnerungen' : 'Memories'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <MessageSquare className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{conversationStats.total}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'de' ? 'Gespräche' : 'Conversations'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalMessages}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'de' ? 'Nachrichten' : 'Messages'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{insightStats.reduce((sum, i) => sum + i.count, 0)}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'de' ? 'Erkenntnisse' : 'Insights'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Memory Types Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'de' ? 'Erinnerungen nach Typ' : 'Memories by Type'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {memoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={memoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {memoryChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {language === 'de' ? 'Noch keine Erinnerungen gespeichert' : 'No memories saved yet'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Insights Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'de' ? 'Erkenntnisse nach Kategorie' : 'Insights by Category'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={insightChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {language === 'de' ? 'Noch keine Erkenntnisse gesammelt' : 'No insights collected yet'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity This Month */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {language === 'de' ? 'Aktivität diesen Monat' : 'Activity This Month'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold text-accent">{conversationStats.thisMonth}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? 'Neue Gespräche' : 'New Conversations'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-3xl font-bold text-accent">
                    {totalMemories > 20 ? '✓' : `${totalMemories}/20`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' ? 'Psychogramm-Bereitschaft' : 'Psychogram Readiness'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserAnalytics;
