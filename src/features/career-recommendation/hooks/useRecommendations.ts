import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

import { supabase } from '../../../services/supabase';
import {
  generateAiCareerRecommendations,
  generateAiTimelineRoadmap,
} from '../../../services/apiRecommendations';

// Type blueprint describing a single structured career path option
export interface CareerOption {
  id: number;
  title: string;
  description: string;
  match_percentage: number;
  strengths: string[];
  gaps: string[];
}

// Unified interface container describing the career recommendations payload structure
export interface CareerRecommendationsPayload {
  assessment: any; // Dynamic baseline assessment database record row
  recommendations: CareerOption[];
}

// Structure contract matching your PostgreSQL JSONB schema row inside public.roadmaps
export interface TimelineMilestone {
  id: number;
  month: string;
  title: string;
  completed: boolean;
  links: Array<{
    text: string;
    url: string;
  }>;
}

// Full database row contract for the public.roadmaps table entries
export interface RoadmapDatabaseInstance {
  id: string;
  user_id: string;
  assessment_id: string;
  target_career_title: string;
  suitability_percentage: number;
  verified_strengths: string[];
  identified_gaps: string[];
  timeline_milestones_json: TimelineMilestone[];
  created_at?: string;
}

interface UpdateProgressMutationParams {
  roadmapId: string;
  updatedMilestones: TimelineMilestone[];
}

/**
 * 1. Hook to grab the user's latest assessment and its generated career options
 */
export function useCareerRecommendations(
  userId: string | undefined,
): UseQueryResult<CareerRecommendationsPayload | null, Error> {
  return useQuery({
    queryKey: ['latestAssessment', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Pull latest assessment row from PostgreSQL
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw new Error(error.message);
      const assessment = data[0] || null;
      if (!assessment) return null;

      // If recommendations have already been generated and saved, return them immediately!
      if (assessment.generated_recommendations) {
        return {
          assessment,
          recommendations:
            assessment.generated_recommendations as CareerOption[],
        };
      }

      // If not, fetch them fresh from Gemini AI tracking configurations
      const recommendations: CareerOption[] =
        await generateAiCareerRecommendations(assessment);

      // Save them to the database instantly in the background so it never repeats
      await supabase
        .from('assessments')
        .update({ generated_recommendations: recommendations })
        .eq('id', assessment.id);

      return { assessment, recommendations };
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 30, // 30 Minute local cache lock
  });
}

/**
 * 2. Hook to fetch or build a personalized learning roadmap from the database
 */
export function useTimelineRoadmap(
  userId: string | undefined,
  targetCareer: string | null,
): UseQueryResult<RoadmapDatabaseInstance | null, Error> {
  return useQuery({
    queryKey: ['activeRoadmap', userId, targetCareer],
    queryFn: async () => {
      if (!userId || !targetCareer) return null;

      // A. Check if this specific roadmap row already exists in Supabase
      const { data: existingRoadmap } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', userId)
        .eq('target_career_title', targetCareer)
        .limit(1);

      if (existingRoadmap && existingRoadmap.length > 0) {
        return existingRoadmap[0] as RoadmapDatabaseInstance;
      }

      // B. If it doesn't exist, fetch the parent assessment details to find gaps
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      const latestAssessment = assessmentData?.[0];
      const identifiedGaps: string[] = latestAssessment?.selected_skills || [
        'General Core Skills',
      ];

      // C. Trigger Gemini to construct the 6-month milestones configuration map
      const generatedMilestones: TimelineMilestone[] =
        await generateAiTimelineRoadmap({
          targetCareer,
          identifiedGaps,
        });

      // D. Save it directly to the database row so it persists permanently inside PostgreSQL
      const { data: newRoadmap, error: saveError } = await supabase
        .from('roadmaps')
        .insert([
          {
            user_id: userId,
            assessment_id:
              latestAssessment?.id || '00000000-0000-0000-0000-000000000000',
            target_career_title: targetCareer,
            suitability_percentage: 85,
            verified_strengths: latestAssessment?.selected_skills || [],
            identified_gaps: [],
            timeline_milestones_json: generatedMilestones,
          },
        ])
        .select()
        .single();

      if (saveError) throw new Error(saveError.message);
      return newRoadmap as RoadmapDatabaseInstance;
    },
    enabled: Boolean(userId) && Boolean(targetCareer),
    staleTime: 1000 * 60 * 60, // 1 hour data stability cache
  });
}

/**
 * 3. Mutation hook to update completion checkboxes in real time
 */
export function useUpdateRoadmapProgress(): UseMutationResult<
  RoadmapDatabaseInstance,
  Error,
  UpdateProgressMutationParams
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roadmapId,
      updatedMilestones,
    }: UpdateProgressMutationParams) => {
      const { data, error } = await supabase
        .from('roadmaps')
        .update({ timeline_milestones_json: updatedMilestones })
        .eq('id', roadmapId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as RoadmapDatabaseInstance;
    },
    onSuccess: (data: RoadmapDatabaseInstance) => {
      // Invalidate the cache line to reflect updates everywhere instantly
      queryClient.invalidateQueries({
        queryKey: ['activeRoadmap', data.user_id, data.target_career_title],
      });
    },
  });
}
