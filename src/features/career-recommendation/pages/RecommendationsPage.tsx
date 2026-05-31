import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import {
  useCareerRecommendations,
  CareerOption,
} from '../hooks/useRecommendations';
import { useUser } from '../../authentication/hooks/useUser';
import Spinner from '../../../components/Spinner';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { user, profile } = useUser();

  // Fetch from our smart background-saving hook safely with strict type mappings
  const { data, isLoading, error } = useCareerRecommendations(user?.id);

  if (isLoading) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center font-sans'>
        <Spinner />
        <p className='text-brand-muted mt-4 animate-pulse text-sm font-medium'>
          TalentLoop AI parsing your profiles and matching career tracks...
        </p>
      </div>
    );
  }

  if (
    error ||
    !data ||
    !data.recommendations ||
    data.recommendations.length === 0
  ) {
    return (
      <div className='bg-canvas-default text-brand-dark flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center font-sans'>
        <h2 className='text-brand-dark text-xl font-bold'>
          No Active Career Blueprints Found
        </h2>
        <p className='text-brand-muted mt-1 max-w-md text-sm font-medium'>
          Complete an evaluation assessment first to generate your technical
          profile data matrix.
        </p>
        <button
          onClick={() => navigate('/skill-selector')}
          className='bg-brand-primary hover:bg-brand-primary/90 mt-6 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors'
        >
          Take Assessment Quiz
        </button>
      </div>
    );
  }

  const { assessment, recommendations } = data;
  const studentName: string = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : 'Scholar';

  return (
    <div className='bg-canvas-default text-brand-dark mx-auto min-h-[calc(100vh-4rem)] max-w-7xl space-y-8 p-4 font-sans md:p-8'>
      <div className='bg-canvas-panel border-border-subtle rounded-2xl border p-6 shadow-sm md:p-8'>
        <h1 className='text-brand-dark mb-2 text-2xl font-bold tracking-tight'>
          Assessment Results for {studentName}
        </h1>
        <p className='text-brand-muted max-w-3xl text-sm leading-relaxed font-medium'>
          Based on your recent quiz evaluation session where you scored a
          verified{' '}
          <span className='text-brand-primary font-black'>
            {assessment?.verified_match_score}% accuracy
          </span>{' '}
          across your skills matrix, your tailored pathways are completely
          ready.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {recommendations.map((rec: CareerOption) => (
          <div
            key={rec.id}
            className='bg-canvas-panel border-border-subtle hover:border-brand-primary/40 flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200'
          >
            <div className='mb-4 flex items-start justify-between gap-4'>
              <h2 className='text-brand-dark text-lg leading-snug font-bold tracking-tight'>
                {rec.title}
              </h2>
              <div
                className={`text-xxs shrink-0 rounded-full px-2.5 py-1 font-black tracking-wide ${
                  rec.match_percentage >= 80
                    ? 'bg-feedback-success/10 text-feedback-success'
                    : 'bg-brand-primary/10 text-brand-primary'
                }`}
              >
                {rec.match_percentage}% Match
              </div>
            </div>

            <p className='text-brand-muted mb-6 flex-1 text-xs leading-relaxed font-medium'>
              {rec.description}
            </p>

            <div className='mb-8 space-y-5 text-left'>
              <div>
                <h3 className='text-brand-primary text-xxs mb-3 font-black tracking-wider uppercase'>
                  Verified Strengths
                </h3>
                <ul className='space-y-2'>
                  {rec.strengths.map((str: string, i: number) => (
                    <li
                      key={i}
                      className='text-brand-dark flex items-start gap-2 text-xs font-semibold'
                    >
                      <CheckCircle2Icon
                        size={14}
                        className='text-feedback-success mt-0.5 shrink-0'
                      />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-brand-muted text-xxs mb-3 font-black tracking-wider uppercase opacity-80'>
                  Identified Gaps
                </h3>
                <ul className='space-y-2'>
                  {rec.gaps.map((gap: string, i: number) => (
                    <li
                      key={i}
                      className='text-brand-dark flex items-start gap-2 text-xs font-semibold'
                    >
                      <AlertTriangleIcon
                        size={14}
                        className='text-feedback-warning mt-0.5 shrink-0'
                      />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to={`/roadmap?job=${encodeURIComponent(rec.title)}`}
              className='bg-canvas-inset border-border-subtle text-brand-dark hover:bg-canvas-panel hover:border-brand-primary/50 mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition-colors'
            >
              View Personalized Roadmap <ArrowRightIcon size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
