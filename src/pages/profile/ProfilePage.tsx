import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'flowbite-react';
import { HiUser, HiOfficeBuilding } from 'react-icons/hi';
import { Alert, Spinner } from 'flowbite-react';
import { usePersonProfile } from '@/hooks/useProfile';
import { useCompanyProfile } from '@/hooks/useProfile';
import PersonProfileTab from './PersonProfileTab';
import CompanyProfileTab from './CompanyProfileTab';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  
  const personProfile = usePersonProfile();
  const companyProfile = useCompanyProfile();

  const isLoading = personProfile.loading || companyProfile.loading;
  const hasError = personProfile.error || companyProfile.error;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

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

        {hasError && (
          <Alert color="failure" className="mb-6">
            <span className="font-medium">{t("profile.error_title")}</span>
            <p>{personProfile.error || companyProfile.error}</p>
          </Alert>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Tabs 
            aria-label="Profile tabs" 
            onActiveTabChange={(tab: number) => setActiveTab(tab)}
          >
            <Tabs.Item 
              active={activeTab === 0} 
              title={
                <div className="flex items-center gap-2">
                  <HiUser className="h-5 w-5" />
                  <span>{t("profile.person_tab")}</span>
                </div>
              }
            >
              <div className="p-6">
                <PersonProfileTab 
                  profile={personProfile.profile}
                  loading={personProfile.loading}
                  onUpdate={personProfile.updateProfile}
                />
              </div>
            </Tabs.Item>

            <Tabs.Item 
              active={activeTab === 1} 
              title={
                <div className="flex items-center gap-2">
                  <HiOfficeBuilding className="h-5 w-5" />
                  <span>{t("profile.company_tab")}</span>
                </div>
              }
            >
              <div className="p-6">
                <CompanyProfileTab 
                  profile={companyProfile.profile}
                  loading={companyProfile.loading}
                  onUpdate={companyProfile.updateProfile}
                />
              </div>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
