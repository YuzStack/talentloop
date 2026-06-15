import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, HelpCircle, CheckCircle } from 'lucide-react';
import { useUser } from '../../authentication/hooks/useUser';

export default function ClaritySandboxSection() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(0);

  const sampleQuestions = [
    {
      skill: 'React UI Principles',
      q: 'Which hook should you isolate to avoid unnecessary layout root re-renders?',
      options: ['useEffect', 'useMemo', 'useCallback', 'useState'],
      desc: 'Isolating local states cuts out parent updates completely.',
    },
    {
      skill: 'System Architecture',
      q: 'Why does a product-first system prioritize text indexing over raw specs?',
      options: [
        'Database scale',
        'User intent alignment',
        'Browser storage rules',
        'Theme constraints',
      ],
      desc: 'Focusing on user benefits aligns technical architectures perfectly.',
    },
  ];

  useEffect(() => {
    const loop = setInterval(() => {
      setActiveQuestion(prev => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(loop);
  }, []);

  return (
    <section className='border-border-subtle bg-canvas-panel/40 border-t px-6 py-20 transition-colors duration-200 md:px-12 lg:py-28'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center'>
        <div className='w-full lg:order-last lg:col-span-6'>
          <div className='bg-canvas-panel border-border-subtle overflow-hidden rounded-2xl border p-6 text-left shadow-lg'>
            <div className='border-border-subtle mb-4 flex items-center justify-between border-b pb-3 text-xs select-none'>
              <span className='text-brand-primary font-bold tracking-wide uppercase'>
                ⚡ Live Diagnostic Sandbox
              </span>
              <span className='text-brand-muted font-mono font-medium'>
                Testing: {sampleQuestions[activeQuestion].skill}
              </span>
            </div>

            <h3 className='text-brand-dark min-h-12 text-base leading-snug font-bold sm:text-lg'>
              {sampleQuestions[activeQuestion].q}
            </h3>

            <div className='mt-6 space-y-3'>
              {sampleQuestions[activeQuestion].options.map((opt, oIdx) => (
                <div
                  key={oIdx}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-xs transition-all duration-300 sm:text-sm ${
                    oIdx === 1
                      ? 'border-brand-secondary bg-brand-secondary/5 text-brand-dark font-medium shadow-sm'
                      : 'border-border-subtle bg-canvas-default text-brand-muted opacity-70'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${oIdx === 1 ? 'border-brand-secondary' : 'border-border-subtle'}`}
                  >
                    {oIdx === 1 && (
                      <CheckCircle size={12} className='text-brand-secondary' />
                    )}
                  </div>
                  <span>{opt}</span>
                </div>
              ))}
            </div>

            <div className='bg-canvas-inset/50 text-xxs text-brand-muted border-border-subtle/40 mt-4 rounded-lg border p-3 sm:text-xs'>
              💡 <strong>Explanation:</strong>{' '}
              {sampleQuestions[activeQuestion].desc}
            </div>
          </div>
        </div>

        <div className='space-y-6 text-left lg:col-span-6'>
          <div className='bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold'>
            <HelpCircle size={14} />
            <span>01 • Stop The Guesswork</span>
          </div>

          <h2 className='text-brand-dark text-3xl font-black tracking-tight sm:text-4xl md:text-5xl'>
            Know Exactly Where <br />
            You Stand.
          </h2>

          <p className='text-brand-muted text-sm leading-relaxed font-medium sm:text-base'>
            Whether you are a fresh undergraduate looking for your first role,
            or an aspiring tech professional transitioning from another field,
            traditional tech tests are frustrating. They either give zero
            helpful feedback, or blow your confidence away completely.
          </p>

          <p className='text-brand-muted text-sm leading-relaxed font-medium sm:text-base'>
            TalentLoop changes the narrative. Our evaluations adapt seamlessly
            to your experience level—testing your baseline concepts first to
            build confidence before scaling up into advanced professional
            tracks. No stress, just clear mapping of your strengths and skill
            gaps.
          </p>

          <div className='pt-2'>
            <button
              onClick={() =>
                navigate(isAuthenticated ? '/skill-selector' : '/signup')
              }
              className='text-brand-primary hover:text-brand-primary/80 group inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold transition-colors'
            >
              Test your focus skills now{' '}
              <ArrowRight
                size={16}
                className='transition-transform group-hover:translate-x-0.5'
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
