import { useNavigate } from 'react-router';
import { motion, Variants } from 'motion/react';
import { ArrowRight, GraduationCap } from 'lucide-react';

import { useUser } from '../../authentication/hooks/useUser';

const cubicBezierEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: cubicBezierEase },
  },
};

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HeroSection() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  return (
    <section className='relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-6 py-12 md:px-12 lg:py-20'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--color-brand-primary)_0%,transparent_60%)] opacity-5' />

      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center'>
        <motion.div
          variants={staggerContainer}
          initial='initial'
          animate='animate'
          className='space-y-6 text-left lg:col-span-7'
        >
          <motion.div
            variants={fadeInUp}
            className='bg-brand-primary/10 border-brand-primary/20 text-brand-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold'
          >
            <GraduationCap size={14} />
            <span>
              Built for Undergraduates, Finalists & Aspiring Innovators
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className='text-brand-dark text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'
          >
            Bridge the Gap Between <br />
            <span className='text-brand-primary'>Classroom & Career.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className='text-brand-muted max-w-2xl text-base leading-relaxed font-medium sm:text-lg md:text-xl'
          >
            Stop guessing what skills you need to land your first tech role. Map
            your active competencies, diagnose technical gaps through adaptive
            quizzes, and deploy a custom 6-month growth curriculum built around
            your true potential.
          </motion.p>

          <motion.div variants={fadeInUp} className='pt-4'>
            <button
              onClick={() =>
                navigate(isAuthenticated ? '/dashboard' : '/signup')
              }
              className='bg-brand-primary hover:bg-brand-primary/90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 sm:w-auto'
            >
              <span>Get Started For Free</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, ease: cubicBezierEase, delay: 0.2 }}
          className='flex w-full items-center justify-center lg:col-span-5'
        >
          <div className='bg-canvas-panel border-border-subtle relative w-full space-y-6 overflow-hidden rounded-3xl border p-6 shadow-xl'>
            <div className='border-border-subtle flex items-center justify-between border-b pb-4 select-none'>
              <div className='flex gap-1.5'>
                <span className='bg-feedback-danger h-3 w-3 rounded-full opacity-60' />
                <span className='bg-feedback-warning h-3 w-3 rounded-full opacity-60' />
                <span className='bg-brand-secondary h-3 w-3 rounded-full opacity-60' />
              </div>
              <span className='text-brand-muted font-mono text-xs font-semibold'>
                talentloop_core: v1.0
              </span>
            </div>

            <div className='space-y-4'>
              <div className='bg-canvas-inset border-border-subtle flex items-center justify-between rounded-xl border p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='bg-brand-primary/10 text-brand-primary rounded-lg p-2.5 text-sm font-bold'>
                    01
                  </div>
                  <div className='text-left'>
                    <p className='text-brand-dark text-sm font-bold'>
                      Interactive Skill Triage
                    </p>
                    <p className='text-brand-muted text-xs'>
                      Map current credentials
                    </p>
                  </div>
                </div>
                <span className='bg-brand-secondary/10 text-brand-secondary rounded-full px-2.5 py-0.5 text-xs font-bold'>
                  Active
                </span>
              </div>

              <div className='bg-canvas-inset border-border-subtle flex items-center justify-between rounded-xl border p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='bg-brand-primary/10 text-brand-primary rounded-lg p-2.5 text-sm font-bold'>
                    02
                  </div>
                  <div className='text-left'>
                    <p className='text-brand-dark text-sm font-bold'>
                      Adaptive AI Evaluation
                    </p>
                    <p className='text-brand-muted text-xs'>
                      Identify diagnostic weaknesses
                    </p>
                  </div>
                </div>
                <span className='bg-brand-secondary/10 text-brand-secondary rounded-full px-2.5 py-0.5 text-xs font-bold'>
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
