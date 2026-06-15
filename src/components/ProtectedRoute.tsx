import { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { useUser } from '../features/authentication/hooks/useUser';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className='bg-canvas-default flex min-h-screen items-center justify-center font-sans'>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}
