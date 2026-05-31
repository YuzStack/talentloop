import { supabase } from './supabase';
import { AuthResponse, UserResponse } from '@supabase/supabase-js';
import { UserProfile } from '../features/authentication/hooks/useUser';

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

interface UpdateProfileParams {
  userId: string;
  fullName: string;
  university: string;
  avatarUrl: string | null;
}

export interface FullyPopulatedUser {
  id: string;
  email?: string;
  role: string;
  profile: UserProfile;
}

/**
 * Registers a new student profile using Supabase Auth instances
 */
export async function signUpUser({
  email,
  password,
  fullName,
}: SignUpParams): Promise<AuthResponse> {
  const response: AuthResponse = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (response.error) throw new Error(response.error.message);
  return response;
}

/**
 * Authenticates an existing student session using strict email/password credentials
 */
export async function loginUser({
  email,
  password,
}: Omit<SignUpParams, 'fullName'>): Promise<AuthResponse> {
  const response: AuthResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (response.error) throw new Error(response.error.message);
  return response;
}

/**
 * Grabs the active user session and maps their synchronized profile row out of PostgreSQL
 */
export async function getCurrentUser(): Promise<FullyPopulatedUser | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;

  const { data: authUser, error: authError }: UserResponse =
    await supabase.auth.getUser();
  if (authError || !authUser.user)
    throw new Error(authError?.message || 'User context unavailable.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile fetch error:', profileError?.message);
    return null;
  }

  return {
    id: authUser.user.id,
    email: authUser.user.email,
    role: authUser.user.role || 'authenticated',
    profile: profile as UserProfile,
  };
}

/**
 * Signs out the current user session completely
 */
export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * Updates metadata fields inside the profiles table
 */
export async function updateProfileDetails({
  userId,
  fullName,
  university,
  avatarUrl,
}: UpdateProfileParams): Promise<UserProfile> {
  const updateData: {
    full_name: string;
    university: string;
    updated_at: string;
    avatar_url?: string;
  } = {
    full_name: fullName,
    university,
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as UserProfile;
}

/**
 * Uploads an avatar image asset directly into the Supabase 'avatars' bucket storage
 */
export async function uploadAvatarImage(
  file: File,
  userId: string,
): Promise<string> {
  const fileExtension: string | undefined = file.name.split('.').pop();
  const filePath: string = `${userId}-${Math.random()}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Updates the user's active login password credentials
 */
export async function updateUserPassword(
  newPassword: string,
): Promise<UserResponse> {
  // FIXED: Changed type assignment from AuthResponse to UserResponse to resolve session mismatch
  const response: UserResponse = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (response.error) throw new Error(response.error.message);
  return response;
}

/**
 * Deletes the student's entire account along with all cascaded profile logs
 */
export async function deleteUserAccountComplete(): Promise<void> {
  const { error } = await supabase.rpc('delete_user_self');

  if (error) {
    const { error: authDeleteError } = await supabase.auth.signOut();
    if (authDeleteError) throw new Error(authDeleteError.message);
  }
}

/**
 * Triggers a secure password recovery email via Supabase Auth
 */
export async function sendPasswordResetEmail(
  email: string,
): Promise<{ data: {}; error: null }> {
  const redirectToUrl: string = `${window.location.origin}/reset-password`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectToUrl,
  });

  if (error) throw new Error(error.message);
  return { data, error };
}
