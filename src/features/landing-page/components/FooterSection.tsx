import { useNavigate } from 'react-router';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';

import { useUser } from '../../authentication/hooks/useUser';

export default function FooterSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-border-subtle bg-canvas-panel border-t transition-colors duration-200'>
      {/* 1. HIGH-CONTRAST CONVERSION PORTAL */}
      <div className='mx-auto max-w-7xl px-6 py-16 md:px-12 lg:py-20'>
        <div className='bg-brand-primary relative overflow-hidden rounded-3xl p-8 text-center text-white shadow-xl sm:p-12 lg:p-16'>
          <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]' />

          <div className='mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6'>
            <h2 className='text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl'>
              Secure Your Graduate Edge Today.
            </h2>
            <p className='max-w-md text-sm font-medium text-white/85 sm:text-base'>
              Join hundreds of finalists, fresh undergraduates, and aspiring
              tech innovators mapping their way to career-readiness without the
              stress.
            </p>

            <div className='w-full pt-2 sm:w-auto'>
              <button
                onClick={() =>
                  navigate(isAuthenticated ? '/dashboard' : '/signup')
                }
                className='text-brand-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold shadow-md transition-transform hover:-translate-y-0.5 hover:bg-gray-100 sm:w-auto'
              >
                <span>
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started For Free'}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEVELOPER CREDITS FOOTER LAYER */}
      <div className='border-border-subtle/50 border-t px-6 py-8 md:px-12'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='text-brand-muted flex items-center gap-2 text-xs select-none'>
            <GraduationCap size={16} className='text-brand-primary' />
            <span>
              &copy; {currentYear} TalentLoop. Engineered for builders.
            </span>
          </div>

          <div className='flex flex-col items-center gap-2 text-xs sm:items-end'>
            <p className='text-brand-muted font-medium'>
              Designed & Developed by{' '}
              <a
                href='https://www.linkedin.com/in/yusuf-oyinlola'
                target='_blank'
                rel='noopener noreferrer'
                className='text-brand-primary hover:text-brand-primary/80 decoration-brand-primary/30 font-bold underline underline-offset-2 transition-colors'
              >
                Yusuf Oyinlola
              </a>
            </p>

            <div className='mt-1 flex items-center gap-3'>
              <a
                href='https://www.linkedin.com/in/yusuf-oyinlola'
                target='_blank'
                rel='noopener noreferrer'
                className='text-brand-muted hover:text-brand-dark transition-colors'
                aria-label='LinkedIn Profile'
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href='https://github.com/YuzStack'
                target='_blank'
                rel='noopener noreferrer'
                className='text-brand-muted hover:text-brand-dark transition-colors'
                aria-label='GitHub Repository Stack'
              >
                <FaGithub size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
