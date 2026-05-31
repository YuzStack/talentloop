import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { UserResponse } from '@supabase/supabase-js';

import { UserProfile } from './useUser';
import {
  updateProfileDetails,
  uploadAvatarImage,
  updateUserPassword,
  deleteUserAccountComplete,
  sendPasswordResetEmail,
} from '../../../services/apiAuth';

interface UpdateProfileMutationParams {
  userId: string;
  fullName: string;
  university: string;
  imageFile: File | null;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
  }: UseMutationResult<UserProfile, Error, UpdateProfileMutationParams> =
    useMutation({
      mutationFn: async ({ userId, fullName, university, imageFile }) => {
        let avatarUrl: string | null = null;
        if (imageFile) {
          avatarUrl = await uploadAvatarImage(imageFile, userId);
        }
        return updateProfileDetails({
          userId,
          fullName,
          university,
          avatarUrl,
        });
      },
      onSuccess: () => {
        toast.success('Personal profile details updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (err: Error) => toast.error(err.message),
    });

  const {
    mutate: updatePassword,
    isPending: isUpdatingPassword,
  }: UseMutationResult<UserResponse, Error, string> = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => toast.success('Security password altered successfully!'),
    onError: (err: Error) => toast.error(err.message),
  });

  const {
    mutate: deleteAccount,
    isPending: isDeleting,
  }: UseMutationResult<void, Error, void> = useMutation({
    mutationFn: deleteUserAccountComplete,
    onSuccess: () => {
      toast.success('Account profile wiped out.');
      window.location.href = '/login';
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    updateProfile,
    isUpdatingProfile,
    updatePassword,
    isUpdatingPassword,
    deleteAccount,
    isDeleting,
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: sendPasswordResetEmail,
  });
}
