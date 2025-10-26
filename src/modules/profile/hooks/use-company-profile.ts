import { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/use-toast';
import type { CompanyProfile } from '@/modules/profile/models/company-profile';
import { fetchCompanyProfile } from '../api/fetch-company-profile';
import { useTranslation } from 'react-i18next';
import { updateCompanyProfile } from '../api/update-company-profile';

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { t } = useTranslation();

  const getCompanyProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCompanyProfile();
      setProfile(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfile(null);
        setError(null);
      } else {
        const errorMessage = err.response?.data?.message || err.message || t("profile.error_title");
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<CompanyProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!profile || !profile._id) throw new Error(t("profile.company_not_found"));
      delete profileData._id;

      const response = await updateCompanyProfile(profileData);
      setProfile(response);
      return true;
    } catch (error: any) {
      setError(error.message || t("profile.error_title"));
      toast.error(error.message || t("profile.error_title"));
      return false;
    }
  };

  useEffect(() => {
    getCompanyProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    getCompanyProfile,
    updateProfile,
  };
};
