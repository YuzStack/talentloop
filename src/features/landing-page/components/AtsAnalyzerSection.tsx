import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Cpu, FileText, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../authentication/hooks/useUser';

export default function AtsAnalyzerSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [stage, setUploadStage] = useState<'idle' | 'processing' | 'extracted'>(
    'idle',
  );

  // Infinite simulation loop for the file analyzer interface
  useEffect(() => {
    const sequence = async () => {
      // Stage 1: File floats down (Idle state length)
      setUploadStage('idle');
      await new Promise(r => setTimeout(r, 2500));

      // Stage 2: Loading bar processing
      setUploadStage('processing');
      await new Promise(r => setTimeout(r, 2000));

      // Stage 3: Tags extract out onto the screen
      setUploadStage('extracted');
      await new Promise(r => setTimeout(r, 3500));

      // Re-trigger loop
      sequence();
    };

    sequence();
    return () => setUploadStage('idle');
  }, []);

  const sampleExtractedTags = [
    'React',
    'TypeScript',
    'Node.js',
    'AWS',
    'Python',
  ];

  return (
    <section className='border-border-subtle bg-canvas-panel/40 border-t px-6 py-20 transition-colors duration-200 md:px-12 lg:py-28'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center'>
        {/* Left Side: Dynamic Interactive Simulator Widget Panel */}
        <div className='w-full lg:col-span-6'>
          <div className='bg-canvas-panel border-border-subtle overflow-hidden rounded-2xl border p-6 text-left shadow-xl'>
            <div className='border-border-subtle mb-6 flex items-center justify-between border-b pb-3 select-none'>
              <span className='text-brand-secondary flex items-center gap-1 text-xs font-bold tracking-wide uppercase'>
                <Cpu size={14} /> ATS Ingestion Matrix
              </span>
              <span className='text-brand-muted text-xxs font-mono'>
                parser_status: active
              </span>
            </div>

            {/* Simulated Drag and Drop Upload Box Zone */}
            <div className='border-border-subtle bg-canvas-default/60 relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-4 text-center'>
              {stage === 'idle' && (
                <>
                  {/* Floating PDF Container File Element */}
                  <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className='bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-2 rounded-xl border p-3 shadow-sm'
                  >
                    <FileText size={28} />
                  </motion.div>
                  <p className='text-brand-dark text-xs font-bold'>
                    Ingesting curriculum_vitae.pdf...
                  </p>
                  <p className='text-brand-muted text-xxs mt-0.5'>
                    Parsing binary profile layouts
                  </p>
                </>
              )}

              {stage === 'processing' && (
                <div className='w-full max-w-xs space-y-3'>
                  <div className='text-xxs flex justify-between font-bold select-none'>
                    <span className='text-brand-dark max-w-40 truncate'>
                      curriculum_vitae.pdf
                    </span>
                    <span className='text-brand-primary animate-pulse'>
                      Extracting tokens...
                    </span>
                  </div>
                  <div className='bg-canvas-inset relative h-1.5 w-full overflow-hidden rounded-full'>
                    <motion.div
                      initial={{ left: '-100%' }}
                      animate={{ left: '100%' }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className='bg-brand-primary absolute top-0 bottom-0 w-1/3 rounded-full'
                    />
                  </div>
                </div>
              )}

              {stage === 'extracted' && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='space-y-2'
                >
                  <div className='bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20 mx-auto flex h-10 w-10 items-center justify-center rounded-full border select-none'>
                    <CheckCircle2 size={20} />
                  </div>
                  <p className='text-brand-dark text-xs font-bold'>
                    Parsing complete!
                  </p>
                  <p className='text-brand-muted text-xxs'>
                    5 structural profiles matched cleanly
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Dashboard Results Node Reveal View */}
            <div className='mt-5 min-h-16 space-y-2.5'>
              <span className='text-brand-muted text-xxs block font-bold tracking-wider uppercase select-none'>
                Identified Competencies Matrix:
              </span>
              <div className='flex flex-wrap gap-2'>
                {sampleExtractedTags.map((tag, tIdx) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: stage === 'extracted' ? 1 : 0.1,
                      y: stage === 'extracted' ? 0 : 5,
                    }}
                    transition={{ delay: tIdx * 0.1, duration: 0.3 }}
                    className={`text-xxs rounded-full border px-2.5 py-1 font-bold transition-colors ${
                      stage === 'extracted'
                        ? 'bg-canvas-inset border-brand-secondary text-brand-dark shadow-xs'
                        : 'bg-canvas-inset/30 border-border-subtle text-brand-muted'
                    }`}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Educational Content Copy text */}
        <div className='space-y-6 text-left lg:col-span-6'>
          <div className='bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold'>
            <Cpu size={14} />
            <span>03 • One-Click Extraction Engine</span>
          </div>

          <h2 className='text-brand-dark text-3xl font-black tracking-tight sm:text-4xl md:text-5xl'>
            No Resumes Left Behind. <br />
            Instant AI Scanning.
          </h2>

          <p className='text-brand-muted text-sm leading-relaxed font-medium sm:text-base'>
            Writing down your past project details, school projects, or courses
            can take forever. If you already have a basic summary or CV built,
            you shouldn't have to re-type everything into another empty form.
          </p>

          <p className='text-brand-muted text-sm leading-relaxed font-medium sm:text-base'>
            With TalentLoop, you can simply upload your existing resume PDF
            directly onto our scanner dashboard. Our integrated parser breaks
            down the raw content, filters your practical educational entries,
            and creates an instant technical skills matrix within single-digit
            execution cycles.
          </p>

          <div className='pt-2'>
            <button
              onClick={() =>
                navigate(isAuthenticated ? '/cv-upload' : '/signup')
              }
              className='text-brand-primary hover:text-brand-primary/80 group inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold transition-colors'
            >
              Analyze your current CV instantly{' '}
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
