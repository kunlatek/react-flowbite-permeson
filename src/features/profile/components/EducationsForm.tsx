import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuButton from '@/components/form/KuButton';
import { Education } from '../models/Education';

interface EducationsFormProps {
  educations: Education[];
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  onEducationChange: (index: number, field: string, value: string) => void;
}

export const EducationsForm = ({
  educations,
  onAddEducation,
  onRemoveEducation,
  onEducationChange
}: EducationsFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.person.education")}
        </h3>
        <KuButton
          id="add-education"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.person.add_education")}
          onClick={onAddEducation}
        />
      </div>

      {educations?.map((education, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.person.education_item")} {index + 1}
            </h4>
            <KuButton
              id={`remove-education-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.person.remove_education")}
              onClick={() => onRemoveEducation(index)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KuInput
              name={`personEducationCourse-${index}`}
              type="input"
              dataType="text"
              label={t("profile.person.education_course")}
              value={education.course || ''}
              onChange={(e) => onEducationChange(index, 'course', e.target.value)}
            />
            <KuInput
              name={`personEducationInstitution-${index}`}
              type="input"
              dataType="text"
              label={t("profile.person.education_institution")}
              value={education.institution || ''}
              onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
            />
            <KuInput
              name={`personEducationStartDate-${index}`}
              type="input"
              dataType="date"
              label={t("profile.person.education_start_date")}
              value={education.startDate || ''}
              onChange={(e) => onEducationChange(index, 'startDate', e.target.value)}
            />
            <KuInput
              name={`personEducationFinishDate-${index}`}
              type="input"
              dataType="date"
              label={t("profile.person.education_finish_date")}
              value={education.finishDate || ''}
              onChange={(e) => onEducationChange(index, 'finishDate', e.target.value)}
            />
            <div className="md:col-span-2">
              <KuInput
                name={`personEducationDescription-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.education_description")}
                value={education.description || ''}
                onChange={(e) => onEducationChange(index, 'description', e.target.value)}
              />
            </div>
            <KuInput
              name={`personEducationCertificateFile-${index}`}
              type="input"
              dataType="text"
              label={t("profile.person.education_certificate")}
              value={education.certificateFile || ''}
              onChange={(e) => onEducationChange(index, 'certificateFile', e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
