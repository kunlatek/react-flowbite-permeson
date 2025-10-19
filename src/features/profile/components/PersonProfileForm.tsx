import { useTranslation } from 'react-i18next';
import { Card, Spinner } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import KuButton from '@/components/form/KuButton';
import type { PersonProfile } from '@/features/profile/models/PersonProfile';
import { usePersonProfileForm } from '../hooks';
import { ProfessionsForm, EducationsForm, CoursesForm, RelatedFilesForm, AddressesForm, BankDatasForm, EmailsForm, PhonesForm } from '.';

interface PersonProfileTabProps {
  profile: PersonProfile | null;
  loading: boolean;
  onUpdate: (data: Partial<PersonProfile>) => Promise<boolean>;
}

export const PersonProfileForm = ({ profile, loading, onUpdate }: PersonProfileTabProps) => {
  const { t } = useTranslation();
  const personProfileForm = usePersonProfileForm({ profile: profile || undefined, onUpdate });

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t("profile.person_not_found")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={personProfileForm.handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.personal_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="personName"
            type="input"
            dataType="text"
            label={t("profile.person.name")}
            value={personProfileForm.formData.personName || ''}
            onChange={(e) => personProfileForm.handleInputChange('personName', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="personNickname"
            type="input"
            dataType="text"
            label={t("profile.person.nickname")}
            value={personProfileForm.formData.personNickname || ''}
            onChange={(e) => personProfileForm.handleInputChange('personNickname', e.target.value)}
          />
          <KuSelect
            name="gender"
            type="select"
            dataType="text"
            label={t("profile.person.gender")}
            value={personProfileForm.formData.gender || ''}
            onChange={(name, value) => personProfileForm.handleInputChange(name, value)}
            options={[
              { value: 'Male', label: t("profile.person.gender_male") },
              { value: 'Female', label: t("profile.person.gender_female") },
              { value: 'Other', label: t("profile.person.gender_other") }
            ]}
          />
          <KuInput
            name="birthday"
            type="input"
            dataType="date"
            label={t("profile.person.birthday")}
            value={personProfileForm.formData.birthday || ''}
            onChange={(e) => personProfileForm.handleInputChange('birthday', e.target.value)}
          />
          <KuSelect
            name="maritalStatus"
            type="select"
            dataType="text"
            label={t("profile.person.marital_status")}
            value={personProfileForm.formData.maritalStatus || ''}
            onChange={(name, value) => personProfileForm.handleInputChange(name, value)}
            options={[
              { value: 'Single', label: t("profile.person.marital_single") },
              { value: 'Married', label: t("profile.person.marital_married") },
              { value: 'Divorced', label: t("profile.person.marital_divorced") },
              { value: 'Widowed', label: t("profile.person.marital_widowed") }
            ]}
          />
          <KuInput
            name="motherName"
            type="input"
            dataType="text"
            label={t("profile.person.mother_name")}
            value={personProfileForm.formData.motherName || ''}
            onChange={(e) => personProfileForm.handleInputChange('motherName', e.target.value)}
          />
        </div>
      </Card>

      <PhonesForm
        phones={personProfileForm.formData.phoneNumbers || []}
        onAddPhone={personProfileForm.addPhone}
        onRemovePhone={personProfileForm.removePhone}
        onPhoneChange={personProfileForm.handlePhoneChange}
      />

      <EmailsForm
        emails={personProfileForm.formData.emails || []}
        onAddEmail={personProfileForm.addEmail}
        onRemoveEmail={personProfileForm.removeEmail}
        onEmailChange={personProfileForm.handleEmailChange}
      />

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.social_media")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KuInput
            name="linkedin"
            type="input"
            dataType="text"
            label="LinkedIn"
            value={personProfileForm.formData.linkedin || ''}
            onChange={(e) => personProfileForm.handleInputChange('linkedin', e.target.value)}
          />
          <KuInput
            name="instagram"
            type="input"
            dataType="text"
            label="Instagram"
            value={personProfileForm.formData.instagram || ''}
            onChange={(e) => personProfileForm.handleInputChange('instagram', e.target.value)}
          />
          <KuInput
            name="facebook"
            type="input"
            dataType="text"
            label="Facebook"
            value={personProfileForm.formData.facebook || ''}
            onChange={(e) => personProfileForm.handleInputChange('facebook', e.target.value)}
          />
        </div>
      </Card>

        <AddressesForm
          addresses={personProfileForm.formData.addresses || []}
          onAddressChange={(field, value) => personProfileForm.handleAddressChange(0, field, value)}
        />

      <BankDatasForm
        bankDatas={personProfileForm.formData.bankDatas || []}
        onBankDataChange={personProfileForm.handleBankDataChange}
      />

      <ProfessionsForm
        professions={personProfileForm.formData.professions || []}
        onAddProfession={personProfileForm.addProfession}
        onRemoveProfession={personProfileForm.removeProfession}
        onProfessionChange={personProfileForm.handleProfessionChange}
      />

      <EducationsForm
        educations={personProfileForm.formData.educations || []}
        onAddEducation={personProfileForm.addEducation}
        onRemoveEducation={personProfileForm.removeEducation}
        onEducationChange={personProfileForm.handleEducationChange}
      />

      <CoursesForm
        courses={personProfileForm.formData.courses || []}
        onAddCourse={personProfileForm.addCourse}
        onRemoveCourse={personProfileForm.removeCourse}
        onCourseChange={personProfileForm.handleCourseChange}
      />

      <RelatedFilesForm
        relatedFiles={personProfileForm.formData.relatedFiles || []}
        onAddRelatedFile={personProfileForm.addRelatedFile}
        onRemoveRelatedFile={personProfileForm.removeRelatedFile}
        onRelatedFileChange={personProfileForm.handleRelatedFileChange}
      />

      <div className="flex justify-end gap-4">
        <KuButton
          id="update-person-profile"
          type="button"
          actionType="submit"
          isDisabled={loading}
          label={loading ? t("profile.updating") : t("profile.update")}
          customClass="flex items-center"
        >
          {loading ? (
            <Spinner size="sm" className="mr-2" />
          ) : null}
        </KuButton>
      </div>
    </form>
  );
}
