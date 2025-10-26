import { Alert, Spinner } from 'flowbite-react';
import { useCreateProfile } from '../hooks';
import { PersonProfileForm, CompanyProfileForm } from '../components';
import { useTranslation } from 'react-i18next';
import { PersonProfile, CompanyProfile } from '../models';

export default function CreateProfilePage() {
  const createProfile = useCreateProfile();
  const { t } = useTranslation();

  if (!createProfile.profileType || !['person', 'company'].includes(createProfile.profileType)) {
    return null;
  }

  if (createProfile.isLoading) {
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
                {createProfile.profileType === 'person'
                  ? t("profile.setup.person.title")
                  : t("profile.setup.company.title")
                }
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {createProfile.profileType === 'person'
                  ? t("profile.setup.person.description")
                  : t("profile.setup.company.description")
                }
              </p>
            </div>
          </div>
        </div>

        {createProfile.hasError && (
          <Alert color="failure" className="mb-6">
            <span className="font-medium">{t("profile.error_title")}</span>
            <p>{createProfile.hasError}</p>
          </Alert>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {createProfile.profileType === 'person' ? (
            <div className="p-6">
              <PersonProfileForm
                profile={createProfile.activeProfile.profile}
                loading={createProfile.activeProfile.loading}
                onUpdate={async (data) => await createProfile.handleSaveAndContinue(data as Partial<PersonProfile>)}
              />
            </div>
          ) : (
            <div className="p-6">
              <CompanyProfileForm
                profile={createProfile.activeProfile.profile}
                loading={createProfile.activeProfile.loading}
                onUpdate={async (data) => await createProfile.handleSaveAndContinue(data as Partial<CompanyProfile>)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
