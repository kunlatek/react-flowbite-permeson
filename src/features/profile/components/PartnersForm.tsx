import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuButton from '@/components/form/KuButton';
import { Partner } from '../models/Partner';

interface PartnersFormProps {
  partners: Partner[];
  onAddPartner: () => void;
  onRemovePartner: (index: number) => void;
  onPartnerChange: (index: number, field: string, value: string) => void;
}

export const PartnersForm = ({
  partners,
  onAddPartner,
  onRemovePartner,
  onPartnerChange
}: PartnersFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.company.partners")}
        </h3>
        <KuButton
          id="add-partner"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.company.add_partner")}
          onClick={onAddPartner}
        />
      </div>

      {partners?.map((partner, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.company.partner")} {index + 1}
            </h4>
            <KuButton
              id={`remove-partner-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.company.remove_partner")}
              onClick={() => onRemovePartner(index)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <KuInput
              name={`personId-${index}`}
              type="input"
              dataType="text"
              label={t("profile.company.partner_person_id")}
              value={partner.personId || ''}
              onChange={(e) => onPartnerChange(index, 'personId', e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
