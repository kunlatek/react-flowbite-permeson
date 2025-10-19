import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import KuButton from '@/components/form/KuButton';
import { Contact } from '../models/Contact';

interface ContactsFormProps {
  contacts: Contact[];
  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onContactChange: (index: number, field: string, value: string) => void;
}

export const ContactsForm = ({
  contacts,
  onAddContact,
  onRemoveContact,
  onContactChange
}: ContactsFormProps) => {
  const { t } = useTranslation();

  return (
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
          onClick={onAddContact}
        />
      </div>

      {contacts?.map((contact, index) => (
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
              onClick={() => onRemoveContact(index)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KuSelect
              name={`contactType-${index}`}
              type="select"
              dataType="text"
              label={t("profile.company.contact_type")}
              value={contact.type || ''}
              onChange={(name, value) => onContactChange(index, 'type', String(value))}
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
              value={contact.value || ''}
              onChange={(e) => onContactChange(index, 'value', e.target.value)}
            />
            <KuInput
              name={`contactComplement-${index}`}
              type="input"
              dataType="text"
              label={t("profile.company.contact_complement")}
              value={contact.complement || ''}
              onChange={(e) => onContactChange(index, 'complement', e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
