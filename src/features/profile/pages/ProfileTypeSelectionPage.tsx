
import { Card } from 'flowbite-react';
import { HiUser, HiOfficeBuilding } from 'react-icons/hi';
import KuButton from '@/components/form/KuButton';
import { useProfileTypeSelection } from '../hooks/useProfileTypeSelection';
import { useTranslation } from 'react-i18next';

export default function ProfileTypeSelectionPage() {
  const profileTypeSelection = useProfileTypeSelection();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <img
            src="/src/assets/images/logo.png"
            alt="Logo"
            className="h-16 mx-auto mb-6 dark:invert dark:brightness-0 dark:contrast-100"
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("profile.type_selection.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t("profile.type_selection.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              profileTypeSelection.selectedType === 'person' 
                ? 'ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
                : 'hover:shadow-md'
            }`}
            onClick={() => profileTypeSelection.handleTypeSelection('person')}
          >
            <div className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                profileTypeSelection.selectedType === 'person' 
                  ? 'bg-cyan-100 dark:bg-cyan-800' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <HiUser className={`w-8 h-8 ${
                  profileTypeSelection.selectedType === 'person' 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("profile.type_selection.person.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("profile.type_selection.person.description")}
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• {t("profile.type_selection.person.feature1")}</li>
                <li>• {t("profile.type_selection.person.feature2")}</li>
                <li>• {t("profile.type_selection.person.feature3")}</li>
              </ul>
            </div>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              profileTypeSelection.selectedType === 'company' 
                ? 'ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
                : 'hover:shadow-md'
            }`}
            onClick={() => profileTypeSelection.handleTypeSelection('company')}
          >
            <div className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                profileTypeSelection.selectedType === 'company' 
                  ? 'bg-cyan-100 dark:bg-cyan-800' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <HiOfficeBuilding className={`w-8 h-8 ${
                  profileTypeSelection.selectedType === 'company' 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("profile.type_selection.company.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("profile.type_selection.company.description")}
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• {t("profile.type_selection.company.feature1")}</li>
                <li>• {t("profile.type_selection.company.feature2")}</li>
                <li>• {t("profile.type_selection.company.feature3")}</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="flex justify-center">
          <KuButton
            id="continue-profile-setup"
            type="button"
            actionType="button"
            label={t("profile.type_selection.continue")}
            onClick={profileTypeSelection.handleContinue}
            isDisabled={!profileTypeSelection.selectedType}
            customClass="px-8 py-3"
          />
        </div>
      </div>
    </div>
  );
}
