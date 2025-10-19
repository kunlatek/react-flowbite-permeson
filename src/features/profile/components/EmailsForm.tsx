import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuButton from '@/components/form/KuButton';

interface EmailsFormProps {
  emails: string[];
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onEmailChange: (index: number, value: string) => void;
}

export const EmailsForm = ({
  emails,
  onAddEmail,
  onRemoveEmail,
  onEmailChange
}: EmailsFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.person.emails")}
        </h3>
        <KuButton
          id="add-email"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.person.add_email")}
          onClick={onAddEmail}
        />
      </div>

      {emails?.map((email, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.person.email")} {index + 1}
            </h4>
            <KuButton
              id={`remove-email-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.person.remove_email")}
              onClick={() => onRemoveEmail(index)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <KuInput
              name={`email-${index}`}
              type="input"
              dataType="email"
              label={t("profile.person.email_address")}
              value={email || ''}
              onChange={(e) => onEmailChange(index, e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
