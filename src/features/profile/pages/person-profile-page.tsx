import { useTranslation } from 'react-i18next';
import { Alert, Spinner } from 'flowbite-react';
import { usePersonProfile } from '@/features/profile/hooks/use-person-profile';
import { PersonProfileForm } from '../components';

export default function ProfilePage() {
  const { t } = useTranslation();

  const personProfile = usePersonProfile();

  // if (personProfile.loading) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <Spinner size="xl" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("profile.title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("profile.description")}
          </p>
        </div>

        {personProfile.error && (
          <Alert color="failure" className="mb-6">
            <span className="font-medium">{t("profile.error_title")}</span>
            <p>{personProfile.error}</p>
          </Alert>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <PersonProfileForm 
              profile={personProfile.profile}
              loading={personProfile.loading}
              onUpdate={personProfile.updateProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
