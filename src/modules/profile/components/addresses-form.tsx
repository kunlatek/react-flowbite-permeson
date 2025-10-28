import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import { KuInput, KuSelect, KuButton } from '@/components/ku-components';
import { Address } from '../models/address';

interface AddressesFormProps {
  addresses: Address[];
  onAddressChange: (field: string, value: string) => void;
}

export const AddressesForm = ({
  addresses,
  onAddressChange
}: AddressesFormProps) => {
  const { t } = useTranslation();

  const primaryAddress = addresses?.[0];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("profile.company.primary_address")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KuInput
          name="addressOneCepBrasilApi"
          dataType="text"
          label={t("profile.company.cep")}
          value={primaryAddress?.cep || ''}
          onChange={(e) => onAddressChange('cep', e.target.value)}
        />
        <KuSelect
          name="addressOneType"
          type="select"
          dataType="text"
          label={t("profile.company.address_type")}
          value={primaryAddress?.type || ''}
          onChange={(name, value) => onAddressChange('type', String(value))}
          options={[
            { value: 'commercial', label: t("profile.company.address_commercial") },
            { value: 'residential', label: t("profile.company.address_residential") }
          ]}
        />
        <KuInput
          name="addressOneStreet"
          dataType="text"
          label={t("profile.company.street")}
          value={primaryAddress?.street || ''}
          onChange={(e) => onAddressChange('street', e.target.value)}
        />
        <KuInput
          name="addressOneNumber"
          dataType="text"
          label={t("profile.company.number")}
          value={primaryAddress?.number || ''}
          onChange={(e) => onAddressChange('number', e.target.value)}
        />
        <KuInput
          name="addressOneComplement"
          dataType="text"
          label={t("profile.company.complement")}
          value={primaryAddress?.complement || ''}
          onChange={(e) => onAddressChange('complement', e.target.value)}
        />
        <KuInput
          name="addressOneCity"
          dataType="text"
          label={t("profile.company.city")}
          value={primaryAddress?.city || ''}
          onChange={(e) => onAddressChange('city', e.target.value)}
        />
        <KuInput
          name="addressOneState"
          dataType="text"
          label={t("profile.company.state")}
          value={primaryAddress?.state || ''}
          onChange={(e) => onAddressChange('state', e.target.value)}
        />
      </div>
    </Card>
  );
}
