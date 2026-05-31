import React from 'react';
import { Navigate } from 'react-router';

import { useUser } from '../features/authentication/hooks/useUser';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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
