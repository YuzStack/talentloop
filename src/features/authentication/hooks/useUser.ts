import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AuthResponse } from '@supabase/supabase-js';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signUpUser,
  FullyPopulatedUser,
} from '../../../services/apiAuth';

// Contract describing the custom fields inside a User's PostgreSQL row mapping
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  university: string;
  avatar_url: string | null;
  updated_at?: string;
}

/**
 * Hook to retrieve and track the current logged-in user state safely
 */
export function useUser() {
  const {
    isLoading,
    data: user,
    error,
  }: UseQueryResult<FullyPopulatedUser | null, Error> = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false, // Don't continuously retry auth checks if unauthenticated
  });

  return {
    isLoading,
    user,
    profile: user?.profile || null,
    isAuthenticated: user?.role === 'authenticated',
    error,
  };
}

/**
 * Hook to run the sign-up operation via asynchronous mutations
 */
export function useSignup() {
  const queryClient = useQueryClient();

  const {
    mutate: signup,
    isPending: isSigningUp,
  }: UseMutationResult<AuthResponse, Error, any> = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data: AuthResponse) => {
      // Set the user query data cache directly to log them in instantly
      queryClient.setQueryData(['user'], data.data.user);
    },
  });

  return { signup, isSigningUp };
}

/**
 * Hook to run the login operation via asynchronous mutations
 */
export function useLogin() {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending: isLoggingIn,
  }: UseMutationResult<AuthResponse, Error, any> = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['user'], data.data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { login, isLoggingIn };
}

/**
 * Hook to terminate the session context wrapper completely
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logout,
    isPending: isLoggingOut,
  }: UseMutationResult<void, Error, void> = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear(); // Clear all cached query states on sign out
      navigate('/login', { replace: true });
    },
  });

  return { logout, isLoggingOut };
}
