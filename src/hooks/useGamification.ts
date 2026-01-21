import { supabase } from '@/integrations/supabase/client';

interface Plant {
  id: string;
  type: 'seedling' | 'sprout' | 'flower' | 'tree';
  topic: string;
  createdAt: string;
}

// Plant type based on total reflections
const getPlantType = (totalReflections: number): Plant['type'] => {
  if (totalReflections >= 20) return 'tree';
  if (totalReflections >= 10) return 'flower';
  if (totalReflections >= 5) return 'sprout';
  return 'seedling';
};

// Get level based on total reflections
const getLevel = (totalReflections: number): string => {
  if (totalReflections >= 50) return 'master';
  if (totalReflections >= 25) return 'expert';
  if (totalReflections >= 10) return 'practitioner';
  if (totalReflections >= 5) return 'explorer';
  if (totalReflections >= 1) return 'beginner';
  return 'observer';
};

export const updateGamificationOnReflection = async (
  userId: string,
  reflectionTopic: string
): Promise<void> => {
  try {
    // Get current gamification data
    let { data: gamificationData, error: fetchError } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching gamification data:', fetchError);
      return;
    }

    // Create initial record if none exists
    if (!gamificationData) {
      const { data: newData, error: insertError } = await supabase
        .from('user_gamification')
        .insert({ user_id: userId })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating gamification data:', insertError);
        return;
      }
      gamificationData = newData;
    }

    // Get actual reflection count from memories
    const { count: reflectionCount } = await supabase
      .from('memories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('memory_type', ['selfcare-reflection', 'impulse-reflection', 'situation-reflection']);

    const totalReflections = (reflectionCount || 0) + 1; // +1 for the one just saved

    // Parse existing garden plants
    const existingPlants: Plant[] = Array.isArray(gamificationData.garden_plants) 
      ? gamificationData.garden_plants as unknown as Plant[]
      : [];

    // Create new plant for this reflection
    const newPlant: Plant = {
      id: crypto.randomUUID(),
      type: getPlantType(totalReflections),
      topic: reflectionTopic.substring(0, 50),
      createdAt: new Date().toISOString(),
    };

    // Add new plant (max 12 plants displayed)
    const updatedPlants = [...existingPlants, newPlant].slice(-12);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastReflectionDate = gamificationData.last_reflection_date 
      ? new Date(gamificationData.last_reflection_date) 
      : null;
    
    let currentStreak = gamificationData.current_streak || 0;
    
    if (lastReflectionDate) {
      lastReflectionDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastReflectionDate.getTime()) / (24 * 60 * 60 * 1000));
      
      if (diffDays === 0) {
        // Same day, streak stays the same
      } else if (diffDays === 1) {
        // Next day, increment streak
        currentStreak += 1;
      } else {
        // Gap in days, reset streak
        currentStreak = 1;
      }
    } else {
      // First reflection ever
      currentStreak = 1;
    }

    const longestStreak = Math.max(gamificationData.longest_streak || 0, currentStreak);
    const newLevel = getLevel(totalReflections);

    // Check for new milestones
    const existingMilestones: string[] = Array.isArray(gamificationData.milestones_earned)
      ? gamificationData.milestones_earned as unknown as string[]
      : [];
    
    const newMilestones = [...existingMilestones];
    
    // Add milestone checks
    if (totalReflections >= 1 && !newMilestones.includes('first_reflection')) {
      newMilestones.push('first_reflection');
    }
    if (totalReflections >= 5 && !newMilestones.includes('5_reflections')) {
      newMilestones.push('5_reflections');
    }
    if (totalReflections >= 10 && !newMilestones.includes('10_reflections')) {
      newMilestones.push('10_reflections');
    }
    if (totalReflections >= 25 && !newMilestones.includes('25_reflections')) {
      newMilestones.push('25_reflections');
    }
    if (totalReflections >= 50 && !newMilestones.includes('50_reflections')) {
      newMilestones.push('50_reflections');
    }
    if (currentStreak >= 3 && !newMilestones.includes('3_day_streak')) {
      newMilestones.push('3_day_streak');
    }
    if (currentStreak >= 7 && !newMilestones.includes('7_day_streak')) {
      newMilestones.push('7_day_streak');
    }
    if (currentStreak >= 30 && !newMilestones.includes('30_day_streak')) {
      newMilestones.push('30_day_streak');
    }

    // Calculate weekly count
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
    
    const isNewWeek = !gamificationData.week_start_date || 
      new Date(gamificationData.week_start_date) < weekStart;
    
    const weeklyCount = isNewWeek ? 1 : (gamificationData.weekly_reflection_count || 0) + 1;

    // Update gamification data
    const { error: updateError } = await supabase
      .from('user_gamification')
      .update({
        total_reflections: totalReflections,
        garden_plants: updatedPlants as any,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        current_level: newLevel,
        milestones_earned: newMilestones as any,
        last_reflection_date: today.toISOString().split('T')[0],
        weekly_reflection_count: weeklyCount,
        week_start_date: isNewWeek ? weekStart.toISOString().split('T')[0] : gamificationData.week_start_date,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating gamification data:', updateError);
    }
  } catch (error) {
    console.error('Error in updateGamificationOnReflection:', error);
  }
};

export const useGamification = () => {
  return {
    updateGamificationOnReflection,
  };
};
