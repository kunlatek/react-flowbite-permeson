import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, Spinner } from 'flowbite-react';
import { usePersonProfile } from '@/hooks/useProfile';
import { useCompanyProfile } from '@/hooks/useProfile';
import PersonProfileTab from './PersonProfileTab';
import CompanyProfileTab from './CompanyProfileTab';
import KuButton from '@/components/form/KuButton';

export default function ProfileSetupPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profileType = searchParams.get('type') as 'person' | 'company';
  
  const personProfile = usePersonProfile();
  const companyProfile = useCompanyProfile();

  const isLoading = personProfile.loading || companyProfile.loading;
  const hasError = personProfile.error || companyProfile.error;

  // Redirect if no profile type is specified
  useEffect(() => {
    if (!profileType || !['person', 'company'].includes(profileType)) {
      navigate('/profile/type-selection');
    }
  }, [profileType, navigate]);

  const handleSaveAndContinue = async () => {
    // Save the profile and navigate to dashboard
    if (profileType === 'person') {
      await personProfile.updateProfile(personProfile.profile || {});
    } else {
      await companyProfile.updateProfile(companyProfile.profile || {});
    }
    navigate('/dashboard');
  };

  if (!profileType || !['person', 'company'].includes(profileType)) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("profile.setup.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profileType === 'person' 
                  ? t("profile.setup.person.title")
                  : t("profile.setup.company.title")
                }
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {profileType === 'person' 
                  ? t("profile.setup.person.description")
                  : t("profile.setup.company.description")
                }
              </p>
            </div>
          </div>
        </div>

        {hasError && (
          <Alert color="failure" className="mb-6">
            <span className="font-medium">{t("profile.error_title")}</span>
            <p>{personProfile.error || companyProfile.error}</p>
          </Alert>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {profileType === 'person' ? (
            <div className="p-6">
              <PersonProfileTab 
                profile={personProfile.profile}
                loading={personProfile.loading}
                onUpdate={personProfile.updateProfile}
                hideSaveButton={true}
              />
            </div>
          ) : (
            <div className="p-6">
              <CompanyProfileTab 
                profile={companyProfile.profile}
                loading={companyProfile.loading}
                onUpdate={companyProfile.updateProfile}
                hideSaveButton={true}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <KuButton
            id="save-profile"
            type="button"
            actionType="button"
            label={t("profile.setup.save")}
            onClick={handleSaveAndContinue}
            customClass="px-8 py-3"
          />
        </div>
      </div>
    </div>
  );
}
