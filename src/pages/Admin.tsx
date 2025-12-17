import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Brain, Coins, TrendingUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--muted))', 'hsl(var(--secondary))', 'hsl(var(--destructive))'];

export default function Admin() {
  const { data, loading, error, isAdmin } = useAdminAnalytics();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">{t('admin.loading')}</div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-destructive text-lg">{error || t('admin.accessDenied')}</div>
        <Link to="/" className="text-accent hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('admin.backHome')}
        </Link>
      </div>
    );
  }

  // Aggregate data for charts
  const memoryByType = data?.memoryStats.reduce((acc, stat) => {
    const type = stat.memory_type || 'unknown';
    acc[type] = (acc[type] || 0) + stat.count;
    return acc;
  }, {} as Record<string, number>) || {};

  const memoryTypeData = Object.entries(memoryByType).map(([name, value]) => ({ name, value }));

  const tokenByFunction = data?.tokenStats.reduce((acc, stat) => {
    const fn = stat.function_name || 'unknown';
    acc[fn] = (acc[fn] || 0) + stat.total_tokens;
    return acc;
  }, {} as Record<string, number>) || {};

  const tokenFunctionData = Object.entries(tokenByFunction).map(([name, value]) => ({ name, value }));

  const totalTokens = data?.tokenStats.reduce((sum, s) => sum + s.total_tokens, 0) || 0;
  const totalCost = data?.tokenStats.reduce((sum, s) => sum + (s.total_cost || 0), 0) || 0;
  const totalMessages = data?.messageStats.reduce((sum, s) => sum + s.message_count, 0) || 0;
  const totalConversations = data?.conversationStats.reduce((sum, s) => sum + s.conversation_count, 0) || 0;
  const totalMemories = data?.memoryStats.reduce((sum, s) => sum + s.count, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-serif font-semibold text-foreground">{t('admin.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Brain className="w-4 h-4" />
                <span className="text-xs">{t('admin.memories')}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{totalMemories}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">{t('admin.conversations')}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{totalConversations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">{t('admin.messages')}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{totalMessages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Coins className="w-4 h-4" />
                <span className="text-xs">{t('admin.tokens')}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{totalTokens.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Coins className="w-4 h-4" />
                <span className="text-xs">{t('admin.cost')}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">${totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs">{t('admin.segments')}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{data?.userSegments.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Memory Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.memoryTypes')}</CardTitle>
              <CardDescription>{t('admin.memoryTypesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {memoryTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={memoryTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="hsl(var(--accent))"
                      dataKey="value"
                    >
                      {memoryTypeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  {t('admin.noData')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Usage by Function */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.tokenUsage')}</CardTitle>
              <CardDescription>{t('admin.tokenUsageDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {tokenFunctionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={tokenFunctionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  {t('admin.noData')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Segments & Insight Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('admin.userSegments')}
              </CardTitle>
              <CardDescription>{t('admin.userSegmentsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.userSegments && data.userSegments.length > 0 ? (
                <div className="space-y-3">
                  {data.userSegments.map((segment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-foreground">{segment.segment || 'Unknown'}</span>
                      <span className="text-sm font-medium text-accent">{segment.user_count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {t('admin.noData')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Insight Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                {t('admin.insightPatterns')}
              </CardTitle>
              <CardDescription>{t('admin.insightPatternsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.insightPatterns && data.insightPatterns.length > 0 ? (
                <div className="space-y-3">
                  {data.insightPatterns.map((pattern, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{pattern.insight_type || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">{pattern.confidence_level}</span>
                      </div>
                      <span className="text-sm font-medium text-accent">{pattern.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {t('admin.noData')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
