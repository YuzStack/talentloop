import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deleteAssessmentRecord } from '../../../services/apiRecommendations';
import { supabase } from '../../../services/supabase';
import { RoadmapDatabaseInstance } from '../../career-recommendation/hooks/useRecommendations';

// Strict contract shape for rows residing in public.assessments inside Supabase
export interface AssessmentRecordRow {
  id: string;
  user_id: string;
  tested_discipline: string;
  selected_skills: string[];
  verified_match_score: number;
  raw_performance_payload: any;
  generated_recommendations?: any;
  created_at: string;
}

// Structured output wrapper for the aggregated dashboard query
export interface DashboardDataPayload {
  history: AssessmentRecordRow[];
  roadmaps: RoadmapDatabaseInstance[];
}

/**
 * Custom hook to aggregate historic logs for the main workspace landing page
 */
export function useDashboardData(
  userId: string | undefined,
): UseQueryResult<DashboardDataPayload, Error> {
  return useQuery({
    queryKey: ['dashboardHistory', userId],
    queryFn: async () => {
      if (!userId) return { history: [], roadmaps: [] };

      // 1. Fetch all evaluation records ordered by newest first from PostgreSQL
      const { data: history, error: historyError } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (historyError) throw new Error(historyError.message);

      // 2. Fetch all persistent roadmaps saved to the user profile
      const { data: roadmaps, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', userId);

      if (roadmapError) throw new Error(roadmapError.message);

      return {
        history: history as AssessmentRecordRow[],
        roadmaps: roadmaps as RoadmapDatabaseInstance[],
      };
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2, // 2-minute refresh buffer
  });
}

/**
 * React Query mutation to handle clearing history rows with instant cache updates
 */
export function useDeleteAssessment(): UseMutationResult<any, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssessmentRecord,
    onSuccess: () => {
      toast.success('Evaluation record permanently removed.');
      // Invalidate the cache matrix to trigger an automatic background update across the UI
      queryClient.invalidateQueries({ queryKey: ['dashboardHistory'] });
      // Also clear active roadmap cache headers since child records cascaded away
      queryClient.invalidateQueries({ queryKey: ['activeRoadmap'] });
    },
    onError: (err: Error) => {
      toast.error('Failed to clear row: ' + err.message);
    },
  });
}
