import { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/use-toast';
import type { PersonProfile } from '@/features/profile/models/person-profile';
import { useTranslation } from 'react-i18next';
import { fetchPersonProfile } from '../api/fetch-person-profile';
import { updatePersonProfile } from '../api/update-person-profile';


export const usePersonProfile = () => {
  const [profile, setProfile] = useState<PersonProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { t } = useTranslation();
  
  const getPersonProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPersonProfile();
      setProfile(data);
    } catch (error: any) {
      setError(error.message || t("profile.error_title"));
      toast.error(error.message || t("profile.error_title"));
    } finally {
      setLoading(false);
    }
    return true;
  };

  const updateProfile = async (profileData: Partial<PersonProfile>) => {
    try {
      setLoading(true);
      setError(null);

      if (!profile || !profile._id) throw new Error(t("profile.person_not_found"));
      delete profileData._id;

      const response = await updatePersonProfile(profileData);
      setProfile(response);
      return true;
    } catch (error: any) {
      setError(error.message || t("profile.error_title"));
      toast.error(error.message || t("profile.error_title"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPersonProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    getPersonProfile,
    updateProfile,
  };
};