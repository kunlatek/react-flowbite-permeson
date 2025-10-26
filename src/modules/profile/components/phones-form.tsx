import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import { KuInput, KuButton } from '@/components/form';

interface PhonesFormProps {
  phones: string[];
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
  onPhoneChange: (index: number, value: string) => void;
}

export const PhonesForm = ({
  phones,
  onAddPhone,
  onRemovePhone,
  onPhoneChange
}: PhonesFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.person.phones")}
        </h3>
        <KuButton
          id="add-phone"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.person.add_phone")}
          onClick={onAddPhone}
        />
      </div>

      {phones?.map((phone, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.person.phone")} {index + 1}
            </h4>
            <KuButton
              id={`remove-phone-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.person.remove_phone")}
              onClick={() => onRemovePhone(index)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <KuInput
              name={`phone-${index}`}
              type="input"
              dataType="text"
              label={t("profile.person.phone_number")}
              value={phone || ''}
              onChange={(e) => onPhoneChange(index, e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
