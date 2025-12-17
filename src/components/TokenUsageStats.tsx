import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageData {
  function_name: string;
  total_tokens: number;
  total_cost: number;
  call_count: number;
}

interface DailyUsage {
  date: string;
  tokens: number;
  cost: number;
}

export const TokenUsageStats = () => {
  const { language } = useLanguage();
  const [usageByFunction, setUsageByFunction] = useState<UsageData[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [totalStats, setTotalStats] = useState({ tokens: 0, cost: 0, calls: 0 });
  const [loading, setLoading] = useState(true);

  const isEn = language === 'en';

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        // Get usage by function
        const { data: usageData, error } = await supabase
          .from('token_usage')
          .select('function_name, total_tokens, estimated_cost_usd, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (usageData) {
          // Aggregate by function
          const byFunction: Record<string, UsageData> = {};
          let totalTokens = 0;
          let totalCost = 0;
          let totalCalls = 0;

          usageData.forEach((row) => {
            const fn = row.function_name;
            if (!byFunction[fn]) {
              byFunction[fn] = { function_name: fn, total_tokens: 0, total_cost: 0, call_count: 0 };
            }
            byFunction[fn].total_tokens += row.total_tokens || 0;
            byFunction[fn].total_cost += Number(row.estimated_cost_usd) || 0;
            byFunction[fn].call_count += 1;
            
            totalTokens += row.total_tokens || 0;
            totalCost += Number(row.estimated_cost_usd) || 0;
            totalCalls += 1;
          });

          setUsageByFunction(Object.values(byFunction));
          setTotalStats({ tokens: totalTokens, cost: totalCost, calls: totalCalls });

          // Aggregate by day (last 7 days)
          const byDay: Record<string, DailyUsage> = {};
          const now = new Date();
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            byDay[key] = { date: key, tokens: 0, cost: 0 };
          }

          usageData.forEach((row) => {
            const date = new Date(row.created_at).toISOString().split('T')[0];
            if (byDay[date]) {
              byDay[date].tokens += row.total_tokens || 0;
              byDay[date].cost += Number(row.estimated_cost_usd) || 0;
            }
          });

          setDailyUsage(Object.values(byDay));
        }
      } catch (e) {
        console.error('Failed to fetch usage stats:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const functionNameMap: Record<string, string> = {
    'coach-chat': isEn ? 'Coach Chat' : 'Coach Chat',
    'coach-learn': isEn ? 'Learning System' : 'Lernsystem',
    'generate-psychogram': isEn ? 'Psychogram' : 'Psychogramm',
    'generate-memory-image': isEn ? 'Image Generation' : 'Bildgenerierung',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isEn ? 'Total Tokens' : 'Tokens Gesamt'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.tokens.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isEn ? 'Estimated Cost' : 'Geschätzte Kosten'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.cost.toFixed(4)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isEn ? 'API Calls' : 'API-Aufrufe'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.calls}</div>
          </CardContent>
        </Card>
      </div>

      {/* Usage by Function */}
      <Card>
        <CardHeader>
          <CardTitle>{isEn ? 'Usage by Function' : 'Nutzung nach Funktion'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageByFunction.map((fn) => (
              <div key={fn.function_name} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{functionNameMap[fn.function_name] || fn.function_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {fn.call_count} {isEn ? 'calls' : 'Aufrufe'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{fn.total_tokens.toLocaleString()} tokens</div>
                  <div className="text-sm text-muted-foreground">${fn.total_cost.toFixed(4)}</div>
                </div>
              </div>
            ))}
            {usageByFunction.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                {isEn ? 'No usage data yet' : 'Noch keine Nutzungsdaten'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Usage Chart */}
      {dailyUsage.length > 0 && totalStats.calls > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{isEn ? 'Last 7 Days' : 'Letzte 7 Tage'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(v) => new Date(v).toLocaleDateString(language, { weekday: 'short' })}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Tokens']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString(language)}
                  />
                  <Bar dataKey="tokens" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
