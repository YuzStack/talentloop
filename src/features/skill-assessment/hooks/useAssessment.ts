import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

import {
  generateAssessmentQuestions,
  AssessmentQuestion,
} from '../../../services/gemini';
import { supabase } from '../../../services/supabase';

// Explicit contract parameters shape for mutation data mapping injections
export interface SubmitAssessmentParams {
  userId: string;
  discipline: string;
  selectedSkills: string[];
  verifiedScore: number;
  rawPayload: any; // Dynamic payload array matching our structural execution outcomes
}

/**
 * React Query hook to fetch and cache Gemini AI generated multi-choice questions
 */
export function useAssessmentQuestions(
  skills: string[],
): UseQueryResult<AssessmentQuestion[], Error> {
  return useQuery({
    queryKey: ['assessmentQuestions', skills],
    queryFn: () => generateAssessmentQuestions(skills),
    enabled: !!skills && skills.length > 0, // Only execute if skills array has data
    staleTime: Infinity, // Keep the generated test stable for the duration of the exam session
    retry: 1,
  });
}

/**
 * Mutation hook to log exam data into public.assessments inside Supabase
 */
export function useSubmitAssessment(): UseMutationResult<
  any,
  Error,
  SubmitAssessmentParams
> {
  return useMutation({
    mutationFn: async ({
      userId,
      discipline,
      selectedSkills,
      verifiedScore,
      rawPayload,
    }: SubmitAssessmentParams) => {
      const { data, error } = await supabase
        .from('assessments')
        .insert([
          {
            user_id: userId,
            tested_discipline: discipline,
            selected_skills: selectedSkills,
            verified_match_score: verifiedScore,
            raw_performance_payload: rawPayload,
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });
}
