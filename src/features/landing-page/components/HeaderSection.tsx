import { Link } from 'react-router';
import { Sun, Moon } from 'lucide-react';

import { useTheme } from '../../../context/ThemeContext';
import { useUser } from '../../authentication/hooks/useUser';

export default function HeaderSection() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useUser();

  return (
    <header className='bg-canvas-panel border-border-subtle sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 transition-colors duration-200 md:px-12'>
      <div className='flex items-center gap-2 select-none'>
        <div className='bg-brand-primary flex h-8 w-8 items-center justify-center rounded text-xl font-bold text-white shadow-sm'>
          T
        </div>
        <span className='text-brand-dark text-xl font-black tracking-tight'>
          Talent<span className='text-brand-primary'>Loop</span>
        </span>
      </div>

      <div className='flex items-center gap-4'>
        <button
          onClick={toggleTheme}
          className='text-brand-muted hover:text-brand-dark hover:bg-canvas-inset border-border-subtle cursor-pointer rounded-lg border p-2 shadow-sm transition-all'
          aria-label='Toggle Theme'
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <Link
          to={isAuthenticated ? '/dashboard' : '/login'}
          className='bg-brand-primary hover:bg-brand-primary/95 hidden rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors md:block'
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
        </Link>
      </div>
    </header>
  );
}
