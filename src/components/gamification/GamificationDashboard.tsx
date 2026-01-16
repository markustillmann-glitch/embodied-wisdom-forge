import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GrowthGarden } from './GrowthGarden';
import { MilestonesBadges } from './MilestonesBadges';
import { NeedsCollection } from './NeedsCollection';
import { ReflectionLevel } from './ReflectionLevel';
import { WeeklyInsights } from './WeeklyInsights';

interface Plant {
  id: string;
  type: 'seedling' | 'sprout' | 'flower' | 'tree';
  topic: string;
  createdAt: string;
}

interface CollectedNeed {
  name: string;
  count: number;
  firstSeenAt: string;
}

interface WeeklyTopic {
  topic: string;
  count: number;
}

interface GamificationData {
  current_level: string;
  total_reflections: number;
  reflection_depth_score: number;
  current_streak: number;
  longest_streak: number;
  garden_plants: Plant[];
  collected_needs: CollectedNeed[];
  milestones_earned: string[];
  weekly_reflection_count: number;
  weekly_topics: WeeklyTopic[];
}

interface GamificationDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationDashboard = ({ isOpen, onClose }: GamificationDashboardProps) => {
  const { user } = useAuth();
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('garden');

  useEffect(() => {
    if (isOpen && user) {
      loadGamificationData();
    }
  }, [isOpen, user]);

  const loadGamificationData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First, try to get existing data
      let { data: gamificationData, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading gamification data:', error);
        return;
      }

      // If no data exists, create initial record
      if (!gamificationData) {
        const { data: newData, error: insertError } = await supabase
          .from('user_gamification')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating gamification data:', insertError);
          return;
        }
        gamificationData = newData;
      }

      // Also get actual reflection count from memories (all reflection types)
      const { count: reflectionCount } = await supabase
        .from('memories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('memory_type', ['selfcare-reflection', 'impulse-reflection', 'situation-reflection']);

      setData({
        current_level: gamificationData.current_level || 'observer',
        total_reflections: reflectionCount || gamificationData.total_reflections || 0,
        reflection_depth_score: gamificationData.reflection_depth_score || 0,
        current_streak: gamificationData.current_streak || 0,
        longest_streak: gamificationData.longest_streak || 0,
        garden_plants: (gamificationData.garden_plants as unknown as Plant[]) || [],
        collected_needs: (gamificationData.collected_needs as unknown as CollectedNeed[]) || [],
        milestones_earned: (gamificationData.milestones_earned as unknown as string[]) || [],
        weekly_reflection_count: gamificationData.weekly_reflection_count || 0,
        weekly_topics: (gamificationData.weekly_topics as unknown as WeeklyTopic[]) || [],
      });
    } catch (error) {
      console.error('Error in gamification:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    { id: 'garden', title: '🌱 Dein Garten', component: GrowthGarden },
    { id: 'level', title: '⭐ Dein Level', component: ReflectionLevel },
    { id: 'milestones', title: '🏆 Meilensteine', component: MilestonesBadges },
    { id: 'needs', title: '💎 Bedürfnisse', component: NeedsCollection },
    { id: 'weekly', title: '📅 Diese Woche', component: WeeklyInsights },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Dein Fortschritt</h2>
                  <p className="text-xs text-muted-foreground">Wachse mit jeder Reflexion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : data ? (
                <>
                  {sections.map((section) => (
                    <div key={section.id} className="border border-border/50 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-sm">{section.title}</span>
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedSection === section.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-2">
                              {section.id === 'garden' && (
                                <GrowthGarden 
                                  plants={data.garden_plants} 
                                  totalReflections={data.total_reflections} 
                                />
                              )}
                              {section.id === 'level' && (
                                <ReflectionLevel
                                  currentLevel={data.current_level}
                                  totalReflections={data.total_reflections}
                                  depthScore={data.reflection_depth_score}
                                />
                              )}
                              {section.id === 'milestones' && (
                                <MilestonesBadges
                                  currentStreak={data.current_streak}
                                  longestStreak={data.longest_streak}
                                  totalReflections={data.total_reflections}
                                  milestonesEarned={data.milestones_earned}
                                />
                              )}
                              {section.id === 'needs' && (
                                <NeedsCollection collectedNeeds={data.collected_needs} />
                              )}
                              {section.id === 'weekly' && (
                                <WeeklyInsights
                                  weeklyReflectionCount={data.weekly_reflection_count}
                                  weeklyTopics={data.weekly_topics}
                                />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Keine Daten verfügbar</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GamificationDashboard;
