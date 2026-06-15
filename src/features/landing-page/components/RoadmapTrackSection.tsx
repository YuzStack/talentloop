import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { useUser } from '../../authentication/hooks/useUser';

export default function RoadmapTrackSection() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [activeMonth, setActiveMonth] = useState(0);

  const mockMilestones = [
    {
      month: 'Month 1',
      title: 'Foundational Layout Mechanics',
      focus:
        'Bridging fundamental architecture gaps and learning precise DOM properties.',
      resources: ['freeCodeCamp Frameworks', 'ALX Software Track'],
    },
    {
      month: 'Month 2',
      title: 'Asynchronous State Control',
      focus:
        'Mastering remote data caching and optimization hooks under production conditions.',
      resources: ['TanStack Documentation', 'Utiva Tech Cohort'],
    },
    {
      month: 'Month 3',
      title: 'Type-Safe Software Shipping',
      focus:
        'Wrapping enterprise interfaces in defensive TypeScript constraints to eliminate crash bugs.',
      resources: ['Hitesh Choudhary Playlist', 'Jobberman Skills Portal'],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMonth(prev => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='border-border-subtle bg-canvas-default border-t px-6 py-20 transition-colors duration-200 md:px-12 lg:py-28'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center'>
        <div className='space-y-6 text-left lg:col-span-6'>
          <div className='bg-brand-primary/10 border-brand-primary/20 text-brand-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold'>
            <Calendar size={14} />
            <span>02 • Persistent Tracking Curriculum</span>
          </div>

          <h2 className='text-brand-dark text-3xl font-black tracking-tight sm:text-4xl md:text-5xl'>
            Your 6-Month Personal <br />
            Learning Path.
          </h2>

          <p className='text-brand-muted text-sm leading-relaxed font-medium sm:text-base'>
            Knowing what you are missing is only half the battle. The real
            challenge is finding quality, affordable structures that actually
            teach you those missing skills without wasting your time on obsolete
            tutorials.
          </p>

          <p className='text-brand-muted text-sm leading-relaxed font-medium sm:text-base'>
            TalentLoop dynamically generates a persistent, month-by-month
            learning curriculum mapped around your specific gaps. We blend
            world-class open-source resources with elite localized accelerators
            like <strong>ALX Africa</strong>, <strong>Jobberman</strong>, and{' '}
            <strong>Utiva</strong> to ensure your education fits into your local
            market and budget constraints seamlessly.
          </p>

          <div className='pt-2'>
            <button
              onClick={() => navigate(isAuthenticated ? '/roadmap' : '/signup')}
              className='text-brand-primary hover:text-brand-primary/80 group inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold transition-colors'
            >
              Explore your personalized track{' '}
              <ArrowRight
                size={16}
                className='transition-transform group-hover:translate-x-0.5'
              />
            </button>
          </div>
        </div>

        <div className='w-full lg:col-span-6'>
          <div className='bg-canvas-panel border-border-subtle relative rounded-2xl border p-6 text-left shadow-xl md:p-8'>
            <div className='bg-border-subtle absolute top-16 bottom-16 left-11 w-0.5 opacity-40 select-none' />

            <div className='relative z-10 space-y-6'>
              {mockMilestones.map((step, idx) => {
                const isCurrent = activeMonth === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveMonth(idx)}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl p-3 transition-all duration-300 ${
                      isCurrent
                        ? 'translate-x-1'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-brand-primary border-brand-primary scale-105 text-white shadow-md'
                          : 'bg-canvas-inset border-border-subtle text-brand-muted'
                      }`}
                    >
                      0{idx + 1}
                    </div>

                    <div
                      className={`bg-canvas-panel flex-1 rounded-xl border p-4 transition-all duration-300 ${
                        isCurrent
                          ? 'border-brand-primary/40 bg-canvas-inset/40 shadow-sm'
                          : 'border-border-subtle'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-brand-primary text-xxs font-black tracking-wider uppercase'>
                          {step.month}
                        </span>
                        {isCurrent && (
                          <span className='bg-brand-secondary/10 text-brand-secondary text-xxs flex items-center gap-1 rounded-full px-2 py-0.5 font-bold select-none'>
                            <MapPin size={10} /> Active Target
                          </span>
                        )}
                      </div>

                      <h4 className='text-brand-dark mt-1 text-sm font-bold sm:text-base'>
                        {step.title}
                      </h4>

                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className='border-border-subtle/40 mt-3 space-y-3 border-t pt-3'
                        >
                          <p className='text-brand-muted text-xs leading-relaxed'>
                            {step.focus}
                          </p>
                          <div className='flex flex-wrap gap-2 pt-1 select-none'>
                            {step.resources.map((res, rIdx) => (
                              <span
                                key={rIdx}
                                className='bg-canvas-default text-brand-dark border-border-subtle text-xxs rounded-md border px-2 py-1 font-medium shadow-2xs'
                              >
                                🔗 {res}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
