import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuButton from '@/components/form/KuButton';
import { Profession } from '../models/Profession';

interface ProfessionsFormProps {
  professions: Profession[];
  onAddProfession: () => void;
  onRemoveProfession: (index: number) => void;
  onProfessionChange: (index: number, field: string, value: string) => void;
}

export const ProfessionsForm = ({
  professions,
  onAddProfession,
  onRemoveProfession,
  onProfessionChange
}: ProfessionsFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.person.professions")}
        </h3>
        <KuButton
          id="add-profession"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.person.add_profession")}
          onClick={onAddProfession}
        />
      </div>

      {professions?.map((profession, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.person.profession")} {index + 1}
            </h4>
            <KuButton
              id={`remove-profession-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.person.remove_profession")}
              onClick={() => onRemoveProfession(index)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KuInput
              name={`jobDescription-${index}`}
              type="input"
              dataType="text"
              label={t("profile.person.job_description")}
              value={profession.description || ''}
              onChange={(e) => onProfessionChange(index, 'description', e.target.value)}
            />
            <KuInput
              name={`jobStartDateMonth-${index}`}
              type="input"
              dataType="number"
              label={t("profile.person.job_start_month")}
              value={profession.startDateMonth || 1}
              onChange={(e) => onProfessionChange(index, 'startDateMonth', e.target.value)}
            />
            <KuInput
              name={`jobStartDateYear-${index}`}
              type="input"
              dataType="number"
              label={t("profile.person.job_start_year")}
              value={profession.startDateYear || new Date().getFullYear()}
              onChange={(e) => onProfessionChange(index, 'startDateYear', e.target.value)}
            />
            <KuInput
              name={`jobFinishDateMonth-${index}`}
              type="input"
              dataType="number"
              label={t("profile.person.job_finish_month")}
              value={profession.finishDateMonth || 1}
              onChange={(e) => onProfessionChange(index, 'finishDateMonth', e.target.value)}
            />
            <KuInput
              name={`jobFinishDateYear-${index}`}
              type="input"
              dataType="number"
              label={t("profile.person.job_finish_year")}
              value={profession.finishDateYear || new Date().getFullYear()}
              onChange={(e) => onProfessionChange(index, 'finishDateYear', e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
