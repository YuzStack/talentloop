import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClockIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import {
  useAssessmentQuestions,
  useSubmitAssessment,
} from '../hooks/useAssessment';
import { useUser } from '../../authentication/hooks/useUser';
import { AssessmentQuestion } from '../../../services/gemini';
import Spinner from '../../../components/Spinner';

// Type blueprint describing the dynamic properties expected within the browser router history state
interface RouterLocationState {
  skills?: string[];
}

// Interface layout contract matching evaluation records parsed on form submission
interface EvaluationRecord {
  questionId: number;
  skill: string;
  questionText: string;
  userSelection: number | undefined;
  correctSelection: number;
  status: 'CORRECT' | 'INCORRECT';
}

export default function TestingArena() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutate: submitAssessment, isPending: isSubmitting } =
    useSubmitAssessment();

  // Extract custom state elements cleanly with a structural safety fallback cast mapping
  const selectedSkills = useMemo<string[]>(() => {
    const state = location.state as RouterLocationState | null;
    return state?.skills || [];
  }, [location.state]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const {
    data: questions,
    isLoading,
    error,
  } = useAssessmentQuestions(selectedSkills);

  useEffect(() => {
    if (selectedSkills.length === 0) {
      toast.error('No selected skills found. Redirecting to Triage.');
      navigate('/skill-selector', { replace: true });
    }
  }, [selectedSkills, navigate]);

  // Automatically configure the countdown clock based on question volume (30s per question)
  useEffect(() => {
    if (questions && questions.length > 0) {
      setTimeLeft(questions.length * 30);
    }
  }, [questions]);

  const handleSubmitQuiz = useCallback((): void => {
    if (!questions || !user) return;

    let correctCount: number = 0;

    const evaluationPayload: EvaluationRecord[] = questions.map(
      (q: AssessmentQuestion, idx: number) => {
        const chosenIdx: number | undefined = selectedAnswers[idx];
        const isCorrect: boolean = chosenIdx === q.correct_option_index;
        if (isCorrect) correctCount++;

        return {
          questionId: q.id,
          skill: q.skill,
          questionText: q.question,
          userSelection: chosenIdx,
          correctSelection: q.correct_option_index,
          status: isCorrect ? 'CORRECT' : 'INCORRECT',
        };
      },
    );

    const finalScorePercentage: number = Math.round(
      (correctCount / questions.length) * 100,
    );

    submitAssessment(
      {
        userId: user.id,
        discipline: 'General Technology Evaluation',
        selectedSkills,
        verifiedScore: finalScorePercentage,
        rawPayload: evaluationPayload,
      },
      {
        onSuccess: () => {
          toast.success('Assessment evaluation submitted successfully!');
          navigate('/recommendations');
        },
        onError: (err: any) => {
          toast.error('Failed to register assessment logs: ' + err.message);
        },
      },
    );
  }, [
    navigate,
    questions,
    selectedAnswers,
    submitAssessment,
    selectedSkills,
    user,
  ]);

  useEffect(() => {
    // Only start the countdown if questions have loaded and time is allocated
    if (!questions || questions.length === 0) return;

    const timer: NodeJS.Timeout = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(); // Automatically submit the exam if the clock hits 00:00
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, handleSubmitQuiz]);

  if (isLoading) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center font-sans'>
        <Spinner />
        <p className='text-brand-muted mt-4 animate-pulse text-sm font-medium'>
          TalentLoop compiling your dynamic interview questions...
        </p>
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center'>
        <p className='text-feedback-danger text-sm font-bold'>
          Failed to compile assessment questions from the AI engine.
        </p>
        <button
          onClick={() => navigate('/skill-selector')}
          className='text-brand-primary mt-4 cursor-pointer text-sm font-semibold hover:underline'
        >
          Go Back and Retry
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    const m: number = Math.floor(seconds / 60);
    const s: number = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optionIndex: number): void => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const currentQ: AssessmentQuestion = questions[currentIndex];
  const progressPercentage: number =
    ((currentIndex + 1) / questions.length) * 100;
  const hasAnsweredCurrent: boolean =
    selectedAnswers[currentIndex] !== undefined;

  const handleNext = (): void => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  return (
    <div className='bg-canvas-default text-brand-dark flex min-h-[calc(100vh-4rem)] flex-col font-sans'>
      {/* Top Progress Dashboard Frame */}
      <div className='bg-canvas-panel border-border-subtle sticky top-0 z-10 border-b px-4 py-4 md:px-8'>
        <div className='mx-auto flex max-w-4xl items-center justify-between gap-6'>
          <div className='flex-1'>
            <div className='text-brand-muted mb-2 flex justify-between text-xs font-bold tracking-wider uppercase'>
              <span>
                Question {currentIndex + 1} of {questions.length} (
                {currentQ.skill})
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className='bg-canvas-inset h-2 w-full overflow-hidden rounded-full'>
              <div
                className='bg-brand-primary h-full rounded-full transition-all duration-300 ease-out'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className='bg-canvas-inset border-border-subtle flex items-center gap-2 rounded-lg border px-4 py-2 shadow-inner'>
            <ClockIcon
              size={18}
              className={
                timeLeft < 60
                  ? 'text-feedback-danger animate-pulse'
                  : 'text-brand-muted'
              }
            />
            <span
              className={`font-mono text-sm font-bold ${timeLeft < 60 ? 'text-feedback-danger' : 'text-brand-dark'}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Questionnaire Box */}
      <div className='flex-1 p-4 md:p-8'>
        <div className='bg-canvas-panel border-border-subtle mx-auto mt-4 max-w-3xl rounded-2xl border p-6 shadow-md md:mt-8 md:p-10'>
          <span className='bg-brand-primary/10 text-brand-primary text-xxs border-brand-primary/20 rounded-md border px-2.5 py-1 font-black tracking-wider uppercase'>
            {currentQ.skill}
          </span>
          <h2 className='text-brand-dark mt-4 mb-8 text-lg leading-relaxed font-bold md:text-xl'>
            {currentQ.question}
          </h2>

          <div className='space-y-4'>
            {currentQ.options.map((option: string, idx: number) => {
              const isSelected: boolean = selectedAnswers[currentIndex] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 text-left shadow-sm transition-all md:p-5 ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary/5 border-2'
                      : 'border-border-subtle hover:border-brand-primary/40 hover:bg-canvas-inset/50'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? 'border-brand-primary' : 'border-border-subtle'}`}
                  >
                    {isSelected && (
                      <div className='bg-brand-primary h-2.5 w-2.5 rounded-full' />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium sm:text-base ${isSelected ? 'text-brand-dark' : 'text-brand-muted'}`}
                  >
                    {option}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Navigation Footer */}
          <div className='border-border-subtle mt-10 flex items-center justify-between border-t pt-6'>
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                currentIndex === 0
                  ? 'text-brand-muted cursor-not-allowed opacity-40'
                  : 'text-brand-dark hover:bg-canvas-inset border-border-subtle cursor-pointer border'
              }`}
            >
              <ArrowLeftIcon size={16} /> Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent || isSubmitting}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs font-bold tracking-wider uppercase shadow-sm transition-colors ${
                hasAnsweredCurrent && !isSubmitting
                  ? 'bg-brand-primary hover:bg-brand-primary/90 cursor-pointer text-white'
                  : 'bg-canvas-inset text-brand-muted border-border-subtle cursor-not-allowed border opacity-40'
              }`}
            >
              {isSubmitting
                ? 'Saving Metrics...'
                : currentIndex === questions.length - 1
                  ? 'Submit Assessment'
                  : 'Next Question'}
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
