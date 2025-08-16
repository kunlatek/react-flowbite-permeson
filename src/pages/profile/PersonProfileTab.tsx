import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Spinner } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import KuButton from '@/components/form/KuButton';
import type { IPersonProfile } from '@/models/profile';

interface PersonProfileTabProps {
  profile: IPersonProfile | null;
  loading: boolean;
  onUpdate: (data: Partial<IPersonProfile>) => Promise<boolean>;
}

export default function PersonProfileTab({ profile, loading, onUpdate }: PersonProfileTabProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<IPersonProfile>>({
    personName: '',
    personNickname: '',
    gender: '',
    birthday: '',
    maritalStatus: '',
    motherName: '',
    personDescription: '',
    cpf: '',
    rg: '',
    rgIssuingAuthority: '',
    rgIssuanceDate: '',
    rgState: '',
    passport: '',
    passportIssuanceDate: '',
    passportExpirationDate: '',
    phoneNumberOne: '',
    phoneNumberTwo: '',
    emailOne: '',
    emailTwo: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    addressOneCepBrasilApi: '',
    addressOneType: '',
    addressOneStreet: '',
    addressOneNumber: '',
    addressOneCity: '',
    addressOneState: '',
    addressTwoCepBrasilApi: '',
    addressTwoType: '',
    addressTwoStreet: '',
    addressTwoNumber: '',
    addressTwoCity: '',
    addressTwoState: '',
    personEducation: '',
    personLanguages: 0,
    bankDataOne: {
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      bankAccountType: ''
    },
    bankDataTwo: {
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      bankAccountType: ''
    }
  });

  // Update formData when profile changes
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankDataChange = (bankNumber: 'One' | 'Two', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`bankData${bankNumber}`]: {
        ...(prev[`bankData${bankNumber}` as keyof IPersonProfile] as any),
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
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
            value={formData.personName || ''}
            onChange={(e) => handleInputChange('personName', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="personNickname"
            type="input"
            dataType="text"
            label={t("profile.person.nickname")}
            value={formData.personNickname || ''}
            onChange={(e) => handleInputChange('personNickname', e.target.value)}
          />
          <KuSelect
            name="gender"
            type="select"
            dataType="text"
            label={t("profile.person.gender")}
            value={formData.gender || ''}
            onChange={(value) => handleInputChange('gender', value)}
            options={[
              { value: 'Masculino', label: t("profile.person.gender_male") },
              { value: 'Feminino', label: t("profile.person.gender_female") },
              { value: 'Outro', label: t("profile.person.gender_other") }
            ]}
          />
          <KuInput
            name="birthday"
            type="input"
            dataType="date"
            label={t("profile.person.birthday")}
            value={formData.birthday || ''}
            onChange={(e) => handleInputChange('birthday', e.target.value)}
          />
          <KuSelect
            name="maritalStatus"
            type="select"
            dataType="text"
            label={t("profile.person.marital_status")}
            value={formData.maritalStatus || ''}
            onChange={(value) => handleInputChange('maritalStatus', value)}
            options={[
              { value: 'Solteiro', label: t("profile.person.marital_single") },
              { value: 'Casado', label: t("profile.person.marital_married") },
              { value: 'Divorciado', label: t("profile.person.marital_divorced") },
              { value: 'Viúvo', label: t("profile.person.marital_widowed") }
            ]}
          />
          <KuInput
            name="motherName"
            type="input"
            dataType="text"
            label={t("profile.person.mother_name")}
            value={formData.motherName || ''}
            onChange={(e) => handleInputChange('motherName', e.target.value)}
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.contact_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="phoneNumberOne"
            type="input"
            dataType="text"
            label={t("profile.person.phone_primary")}
            value={formData.phoneNumberOne || ''}
            onChange={(e) => handleInputChange('phoneNumberOne', e.target.value)}
          />
          <KuInput
            name="phoneNumberTwo"
            type="input"
            dataType="text"
            label={t("profile.person.phone_secondary")}
            value={formData.phoneNumberTwo || ''}
            onChange={(e) => handleInputChange('phoneNumberTwo', e.target.value)}
          />
          <KuInput
            name="emailOne"
            type="input"
            dataType="email"
            label={t("profile.person.email_primary")}
            value={formData.emailOne || ''}
            onChange={(e) => handleInputChange('emailOne', e.target.value)}
          />
          <KuInput
            name="emailTwo"
            type="input"
            dataType="email"
            label={t("profile.person.email_secondary")}
            value={formData.emailTwo || ''}
            onChange={(e) => handleInputChange('emailTwo', e.target.value)}
          />
        </div>
      </Card>

      {/* Social Media */}
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
            value={formData.linkedin || ''}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
          />
          <KuInput
            name="instagram"
            type="input"
            dataType="text"
            label="Instagram"
            value={formData.instagram || ''}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
          />
          <KuInput
            name="facebook"
            type="input"
            dataType="text"
            label="Facebook"
            value={formData.facebook || ''}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
          />
        </div>
      </Card>

      {/* Primary Address */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.primary_address")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="addressOneCepBrasilApi"
            type="input"
            dataType="text"
            label={t("profile.person.cep")}
            value={formData.addressOneCepBrasilApi || ''}
            onChange={(e) => handleInputChange('addressOneCepBrasilApi', e.target.value)}
          />
          <KuSelect
            name="addressOneType"
            type="select"
            dataType="text"
            label={t("profile.person.address_type")}
            value={formData.addressOneType || ''}
            onChange={(value) => handleInputChange('addressOneType', value)}
            options={[
              { value: 'residential', label: t("profile.person.address_residential") },
              { value: 'commercial', label: t("profile.person.address_commercial") }
            ]}
          />
          <KuInput
            name="addressOneStreet"
            type="input"
            dataType="text"
            label={t("profile.person.street")}
            value={formData.addressOneStreet || ''}
            onChange={(e) => handleInputChange('addressOneStreet', e.target.value)}
          />
          <KuInput
            name="addressOneNumber"
            type="input"
            dataType="text"
            label={t("profile.person.number")}
            value={formData.addressOneNumber || ''}
            onChange={(e) => handleInputChange('addressOneNumber', e.target.value)}
          />
          <KuInput
            name="addressOneCity"
            type="input"
            dataType="text"
            label={t("profile.person.city")}
            value={formData.addressOneCity || ''}
            onChange={(e) => handleInputChange('addressOneCity', e.target.value)}
          />
          <KuInput
            name="addressOneState"
            type="input"
            dataType="text"
            label={t("profile.person.state")}
            value={formData.addressOneState || ''}
            onChange={(e) => handleInputChange('addressOneState', e.target.value)}
          />
        </div>
      </Card>

      {/* Bank Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.bank_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Bank */}
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("profile.person.primary_bank")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <KuInput
                name="bankDataOne.bankName"
                type="input"
                dataType="text"
                label={t("profile.person.bank_name")}
                value={formData.bankDataOne?.bankName || ''}
                onChange={(e) => handleBankDataChange('One', 'bankName', e.target.value)}
              />
              <KuInput
                name="bankDataOne.bankBranch"
                type="input"
                dataType="text"
                label={t("profile.person.bank_branch")}
                value={formData.bankDataOne?.bankBranch || ''}
                onChange={(e) => handleBankDataChange('One', 'bankBranch', e.target.value)}
              />
              <KuInput
                name="bankDataOne.bankAccount"
                type="input"
                dataType="text"
                label={t("profile.person.bank_account")}
                value={formData.bankDataOne?.bankAccount || ''}
                onChange={(e) => handleBankDataChange('One', 'bankAccount', e.target.value)}
              />
              <KuSelect
                name="bankDataOne.bankAccountType"
                type="select"
                dataType="text"
                label={t("profile.person.bank_account_type")}
                value={formData.bankDataOne?.bankAccountType || ''}
                onChange={(value) => handleBankDataChange('One', 'bankAccountType', value)}
                options={[
                  { value: 'current', label: t("profile.person.bank_current") },
                  { value: 'savings', label: t("profile.person.bank_savings") }
                ]}
              />
            </div>
          </div>

          {/* Secondary Bank */}
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("profile.person.secondary_bank")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <KuInput
                name="bankDataTwo.bankName"
                type="input"
                dataType="text"
                label={t("profile.person.bank_name")}
                value={formData.bankDataTwo?.bankName || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankName', e.target.value)}
              />
              <KuInput
                name="bankDataTwo.bankBranch"
                type="input"
                dataType="text"
                label={t("profile.person.bank_branch")}
                value={formData.bankDataTwo?.bankBranch || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankBranch', e.target.value)}
              />
              <KuInput
                name="bankDataTwo.bankAccount"
                type="input"
                dataType="text"
                label={t("profile.person.bank_account")}
                value={formData.bankDataTwo?.bankAccount || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankAccount', e.target.value)}
              />
              <KuSelect
                name="bankDataTwo.bankAccountType"
                type="select"
                dataType="text"
                label={t("profile.person.bank_account_type")}
                value={formData.bankDataTwo?.bankAccountType || ''}
                onChange={(value) => handleBankDataChange('Two', 'bankAccountType', value)}
                options={[
                  { value: 'current', label: t("profile.person.bank_current") },
                  { value: 'savings', label: t("profile.person.bank_savings") }
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
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
