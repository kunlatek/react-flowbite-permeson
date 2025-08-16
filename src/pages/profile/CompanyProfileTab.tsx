import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Spinner } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import KuButton from '@/components/form/KuButton';
import type { ICompanyProfile } from '@/models/profile';

interface CompanyProfileTabProps {
  profile: ICompanyProfile | null;
  loading: boolean;
  onUpdate: (data: Partial<ICompanyProfile>) => Promise<boolean>;
}

export default function CompanyProfileTab({ profile, loading, onUpdate }: CompanyProfileTabProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<ICompanyProfile>>({
    companyName: '',
    businessName: '',
    cnpj: '',
    birthday: '',
    legalNature: '',
    companyDescription: '',
    logoImage: '',
    companyImages: [],
    tagId: [],
    partners: [],
    contacts: [],
    addressOneCepBrasilApi: '',
    addressOneType: '',
    addressOneStreet: '',
    addressOneNumber: '',
    addressOneComplement: '',
    addressOneCity: '',
    addressOneState: '',
    addressTwoCepBrasilApi: '',
    addressTwoType: '',
    addressTwoStreet: '',
    addressTwoNumber: '',
    addressTwoComplement: '',
    addressTwoCity: '',
    addressTwoState: '',
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
    },
    relatedFiles: []
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
        ...(prev[`bankData${bankNumber}` as keyof ICompanyProfile] as any),
        [field]: value
      }
    }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts?.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      ) || []
    }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...(prev.contacts || []), {
        contactType: '',
        contactValue: '',
        contactComplement: ''
      }]
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts?.filter((_, i) => i !== index) || []
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
          {t("profile.company_not_found")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.company.company_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="companyName"
            type="input"
            dataType="text"
            label={t("profile.company.name")}
            value={formData.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="businessName"
            type="input"
            dataType="text"
            label={t("profile.company.business_name")}
            value={formData.businessName || ''}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
          />
          <KuInput
            name="cnpj"
            type="input"
            dataType="text"
            label="CNPJ"
            value={formData.cnpj || ''}
            onChange={(e) => handleInputChange('cnpj', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="birthday"
            type="input"
            dataType="date"
            label={t("profile.company.foundation_date")}
            value={formData.birthday || ''}
            onChange={(e) => handleInputChange('birthday', e.target.value)}
          />
          <KuSelect
            name="legalNature"
            type="select"
            dataType="text"
            label={t("profile.company.legal_nature")}
            value={formData.legalNature || ''}
            onChange={(value) => handleInputChange('legalNature', value)}
            options={[
              { value: 'Sociedade Limitada', label: t("profile.company.legal_ltda") },
              { value: 'Sociedade Anônima', label: t("profile.company.legal_sa") },
              { value: 'Empresário Individual', label: t("profile.company.legal_individual") },
              { value: 'MEI', label: t("profile.company.legal_mei") }
            ]}
          />
          <div className="md:col-span-2">
            <KuInput
              name="companyDescription"
              type="input"
              dataType="text"
              label={t("profile.company.description")}
              value={formData.companyDescription || ''}
              onChange={(e) => handleInputChange('companyDescription', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("profile.company.contact_info")}
          </h3>
          <KuButton
            id="add-contact"
            type="button"
            actionType="button"
            variant="secondary"
            size="sm"
            label={t("profile.company.add_contact")}
            onClick={addContact}
          />
        </div>
        
        {formData.contacts?.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                {t("profile.company.contact")} {index + 1}
              </h4>
              <KuButton
                id={`remove-contact-${index}`}
                type="button"
                actionType="button"
                variant="danger"
                size="sm"
                label={t("profile.company.remove_contact")}
                onClick={() => removeContact(index)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KuSelect
                name={`contactType-${index}`}
                type="select"
                dataType="text"
                label={t("profile.company.contact_type")}
                value={contact.contactType}
                onChange={(value) => handleContactChange(index, 'contactType', value)}
                options={[
                  { value: 'PHONE', label: t("profile.company.contact_phone") },
                  { value: 'EMAIL', label: t("profile.company.contact_email") },
                  { value: 'WHATSAPP', label: t("profile.company.contact_whatsapp") }
                ]}
              />
              <KuInput
                name={`contactValue-${index}`}
                type="input"
                dataType="text"
                label={t("profile.company.contact_value")}
                value={contact.contactValue}
                onChange={(e) => handleContactChange(index, 'contactValue', e.target.value)}
              />
              <KuInput
                name={`contactComplement-${index}`}
                type="input"
                dataType="text"
                label={t("profile.company.contact_complement")}
                value={contact.contactComplement}
                onChange={(e) => handleContactChange(index, 'contactComplement', e.target.value)}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Primary Address */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.company.primary_address")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="addressOneCepBrasilApi"
            type="input"
            dataType="text"
            label={t("profile.company.cep")}
            value={formData.addressOneCepBrasilApi || ''}
            onChange={(e) => handleInputChange('addressOneCepBrasilApi', e.target.value)}
          />
          <KuSelect
            name="addressOneType"
            type="select"
            dataType="text"
            label={t("profile.company.address_type")}
            value={formData.addressOneType || ''}
            onChange={(value) => handleInputChange('addressOneType', value)}
            options={[
              { value: 'commercial', label: t("profile.company.address_commercial") },
              { value: 'residential', label: t("profile.company.address_residential") }
            ]}
          />
          <KuInput
            name="addressOneStreet"
            type="input"
            dataType="text"
            label={t("profile.company.street")}
            value={formData.addressOneStreet || ''}
            onChange={(e) => handleInputChange('addressOneStreet', e.target.value)}
          />
          <KuInput
            name="addressOneNumber"
            type="input"
            dataType="text"
            label={t("profile.company.number")}
            value={formData.addressOneNumber || ''}
            onChange={(e) => handleInputChange('addressOneNumber', e.target.value)}
          />
          <KuInput
            name="addressOneComplement"
            type="input"
            dataType="text"
            label={t("profile.company.complement")}
            value={formData.addressOneComplement || ''}
            onChange={(e) => handleInputChange('addressOneComplement', e.target.value)}
          />
          <KuInput
            name="addressOneCity"
            type="input"
            dataType="text"
            label={t("profile.company.city")}
            value={formData.addressOneCity || ''}
            onChange={(e) => handleInputChange('addressOneCity', e.target.value)}
          />
          <KuInput
            name="addressOneState"
            type="input"
            dataType="text"
            label={t("profile.company.state")}
            value={formData.addressOneState || ''}
            onChange={(e) => handleInputChange('addressOneState', e.target.value)}
          />
        </div>
      </Card>

      {/* Bank Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.company.bank_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Bank */}
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("profile.company.primary_bank")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <KuInput
                name="bankDataOne.bankName"
                type="input"
                dataType="text"
                label={t("profile.company.bank_name")}
                value={formData.bankDataOne?.bankName || ''}
                onChange={(e) => handleBankDataChange('One', 'bankName', e.target.value)}
              />
              <KuInput
                name="bankDataOne.bankBranch"
                type="input"
                dataType="text"
                label={t("profile.company.bank_branch")}
                value={formData.bankDataOne?.bankBranch || ''}
                onChange={(e) => handleBankDataChange('One', 'bankBranch', e.target.value)}
              />
              <KuInput
                name="bankDataOne.bankAccount"
                type="input"
                dataType="text"
                label={t("profile.company.bank_account")}
                value={formData.bankDataOne?.bankAccount || ''}
                onChange={(e) => handleBankDataChange('One', 'bankAccount', e.target.value)}
              />
              <KuSelect
                name="bankDataOne.bankAccountType"
                type="select"
                dataType="text"
                label={t("profile.company.bank_account_type")}
                value={formData.bankDataOne?.bankAccountType || ''}
                onChange={(value) => handleBankDataChange('One', 'bankAccountType', value)}
                options={[
                  { value: 'currentAccount', label: t("profile.company.bank_current") },
                  { value: 'savingsAccount', label: t("profile.company.bank_savings") }
                ]}
              />
            </div>
          </div>

          {/* Secondary Bank */}
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("profile.company.secondary_bank")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <KuInput
                name="bankDataTwo.bankName"
                type="input"
                dataType="text"
                label={t("profile.company.bank_name")}
                value={formData.bankDataTwo?.bankName || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankName', e.target.value)}
              />
              <KuInput
                name="bankDataTwo.bankBranch"
                type="input"
                dataType="text"
                label={t("profile.company.bank_branch")}
                value={formData.bankDataTwo?.bankBranch || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankBranch', e.target.value)}
              />
              <KuInput
                name="bankDataTwo.bankAccount"
                type="input"
                dataType="text"
                label={t("profile.company.bank_account")}
                value={formData.bankDataTwo?.bankAccount || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankAccount', e.target.value)}
              />
              <KuSelect
                name="bankDataTwo.bankAccountType"
                type="select"
                dataType="text"
                label={t("profile.company.bank_account_type")}
                value={formData.bankDataTwo?.bankAccountType || ''}
                onChange={(value) => handleBankDataChange('Two', 'bankAccountType', value)}
                options={[
                  { value: 'currentAccount', label: t("profile.company.bank_current") },
                  { value: 'savingsAccount', label: t("profile.company.bank_savings") }
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <KuButton
          id="update-company-profile"
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
