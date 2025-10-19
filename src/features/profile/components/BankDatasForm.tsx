import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import { BankData } from '../models/BankData';

interface BankDatasFormProps {
  bankDatas: BankData[];
  onBankDataChange: (index: number, field: string, value: string) => void;
}

export const BankDatasForm = ({
  bankDatas,
  onBankDataChange
}: BankDatasFormProps) => {
  const { t } = useTranslation();

  // Handle primary and secondary bank data (indices 0 and 1)
  const primaryBank = bankDatas?.[0];
  const secondaryBank = bankDatas?.[1];

  return (
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
              value={primaryBank?.name || ''}
              onChange={(e) => onBankDataChange(0, 'name', e.target.value)}
            />
            <KuInput
              name="bankDataOne.bankBranch"
              type="input"
              dataType="text"
              label={t("profile.company.bank_branch")}
              value={primaryBank?.branch || ''}
              onChange={(e) => onBankDataChange(0, 'branch', e.target.value)}
            />
            <KuInput
              name="bankDataOne.bankAccount"
              type="input"
              dataType="text"
              label={t("profile.company.bank_account")}
              value={primaryBank?.account || ''}
              onChange={(e) => onBankDataChange(0, 'account', e.target.value)}
            />
            <KuSelect
              name="bankDataOne.bankAccountType"
              type="select"
              dataType="text"
              label={t("profile.company.bank_account_type")}
              value={primaryBank?.accountType || ''}
              onChange={(name, value) => onBankDataChange(0, 'accountType', String(value))}
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
              value={secondaryBank?.name || ''}
              onChange={(e) => onBankDataChange(1, 'name', e.target.value)}
            />
            <KuInput
              name="bankDataTwo.bankBranch"
              type="input"
              dataType="text"
              label={t("profile.company.bank_branch")}
              value={secondaryBank?.branch || ''}
              onChange={(e) => onBankDataChange(1, 'branch', e.target.value)}
            />
            <KuInput
              name="bankDataTwo.bankAccount"
              type="input"
              dataType="text"
              label={t("profile.company.bank_account")}
              value={secondaryBank?.account || ''}
              onChange={(e) => onBankDataChange(1, 'account', e.target.value)}
            />
            <KuSelect
              name="bankDataTwo.bankAccountType"
              type="select"
              dataType="text"
              label={t("profile.company.bank_account_type")}
              value={secondaryBank?.accountType || ''}
              onChange={(name, value) => onBankDataChange(1, 'accountType', String(value))}
              options={[
                { value: 'currentAccount', label: t("profile.company.bank_current") },
                { value: 'savingsAccount', label: t("profile.company.bank_savings") }
              ]}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
