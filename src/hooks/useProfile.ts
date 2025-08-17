import { useState, useEffect } from 'react';
import { useToast } from './useToast';
import { profileService } from '@/services/profileService';
import type { IPersonProfile, ICompanyProfile } from '@/models/profile';

export const usePersonProfile = () => {
  const [profile, setProfile] = useState<IPersonProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getPersonProfile();
      setProfile(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar perfil';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<IPersonProfile>) => {
    try {
      setLoading(true);
      setError(null);
      delete profileData._id;
      const response = await profileService.updatePersonProfile(profileData);
      toast.success(response.message || 'Perfil atualizado com sucesso!');
      await fetchProfile(); // Refresh the profile data
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<ICompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getCompanyProfile();
      setProfile(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar perfil';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<ICompanyProfile>) => {
    try {
      setLoading(true);
      setError(null);
      delete profileData._id;
      const response = await profileService.updateCompanyProfile(profileData);
      toast.success(response.message || 'Perfil atualizado com sucesso!');
      await fetchProfile(); // Refresh the profile data
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
