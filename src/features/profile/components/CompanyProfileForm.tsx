import { useTranslation } from 'react-i18next';
import { Card, Spinner } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import KuButton from '@/components/form/KuButton';
import { CompanyProfile } from '../models/CompanyProfile';
import { useCompanyProfileForm } from '../hooks';
import {PartnersForm, ContactsForm, AddressesForm, BankDatasForm, CompanyImageForm, RelatedFilesForm} from '.';

interface CompanyProfileTabProps {
  profile: CompanyProfile | null;
  loading: boolean;
  onUpdate: (data: Partial<CompanyProfile>) => Promise<boolean>;
}

export const CompanyProfileForm = ({ profile, loading, onUpdate }: CompanyProfileTabProps) => {
  const { t } = useTranslation();
  const companyProfileForm = useCompanyProfileForm({ profile: profile || undefined, onUpdate });

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
    <form onSubmit={companyProfileForm.handleSubmit} className="space-y-6">
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
            value={companyProfileForm.formData.companyName || ''}
            onChange={(e) => companyProfileForm.handleInputChange('companyName', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="businessName"
            type="input"
            dataType="text"
            label={t("profile.company.business_name")}
            value={companyProfileForm.formData.businessName || ''}
            onChange={(e) => companyProfileForm.handleInputChange('businessName', e.target.value)}
          />
          <KuInput
            name="cnpj"
            type="input"
            dataType="text"
            label="CNPJ"
            value={companyProfileForm.formData.cnpj || ''}
            onChange={(e) => companyProfileForm.handleInputChange('cnpj', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="birthday"
            type="input"
            dataType="date"
            label={t("profile.company.foundation_date")}
            value={companyProfileForm.formData.birthday || ''}
            onChange={(e) => companyProfileForm.handleInputChange('birthday', e.target.value)}
          />
          <KuSelect
            name="legalNature"
            type="select"
            dataType="text"
            label={t("profile.company.legal_nature")}
            value={companyProfileForm.formData.legalNature || ''}
            onChange={(name, value) => companyProfileForm.handleInputChange(name, value)}
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
              value={companyProfileForm.formData.companyDescription || ''}
              onChange={(e) => companyProfileForm.handleInputChange('companyDescription', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <ContactsForm
        contacts={companyProfileForm.formData.contacts || []}
        onAddContact={companyProfileForm.addContact}
        onRemoveContact={companyProfileForm.removeContact}
        onContactChange={companyProfileForm.handleContactChange}
      />

      <AddressesForm
        addresses={companyProfileForm.formData.addresses || []}
        onAddressChange={companyProfileForm.handleAddressChange}
      />

      <BankDatasForm
        bankDatas={companyProfileForm.formData.bankDatas || []}
        onBankDataChange={companyProfileForm.handleBankDataChange}
      />

      <PartnersForm
        partners={companyProfileForm.formData.partners || []}
        onAddPartner={companyProfileForm.addPartner}
        onRemovePartner={companyProfileForm.removePartner}
        onPartnerChange={companyProfileForm.handlePartnerChange}
      />

      <CompanyImageForm
        companyImages={companyProfileForm.formData.companyImages || []}
        onAddCompanyImage={companyProfileForm.addCompanyImage}
        onRemoveCompanyImage={companyProfileForm.removeCompanyImage}
        onCompanyImageChange={companyProfileForm.handleCompanyImageChange}
      />

      <RelatedFilesForm
        relatedFiles={companyProfileForm.formData.relatedFiles || []}
        onAddRelatedFile={companyProfileForm.addRelatedFile}
        onRemoveRelatedFile={companyProfileForm.removeRelatedFile}
        onRelatedFileChange={companyProfileForm.handleRelatedFileChange}
      />

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
