import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import { KuInput, KuButton } from '@/components/ku-components';
import { RelatedFile } from '../models/related-file';

interface RelatedFilesFormProps {
  relatedFiles: RelatedFile[];
  onAddRelatedFile: () => void;
  onRemoveRelatedFile: (index: number) => void;
  onRelatedFileChange: (index: number, field: string, value: string | number) => void;
}

export const RelatedFilesForm = ({
  relatedFiles,
  onAddRelatedFile,
  onRemoveRelatedFile,
  onRelatedFileChange
}: RelatedFilesFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.company.related_files")}
        </h3>
        <KuButton
          id="add-related-file"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.company.add_related_file")}
          onClick={onAddRelatedFile}
        />
      </div>

      {relatedFiles?.map((file, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.company.related_file")} {index + 1}
            </h4>
            <KuButton
              id={`remove-related-file-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.company.remove_related_file")}
              onClick={() => onRemoveRelatedFile(index)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KuInput
              name={`filesDescription-${index}`}
              dataType="text"
              label={t("profile.company.file_description")}
              value={file.description || ''}
              onChange={(e) => onRelatedFileChange(index, 'description', e.target.value)}
            />
            <KuInput
              name={`relatedFilesFiles-${index}`}
              dataType="text"
              label={t("profile.company.file_path")}
              value={file.file || ''}
              onChange={(e) => onRelatedFileChange(index, 'file', e.target.value)}
            />
            <KuInput
              name={`relatedFilesDateDay-${index}`}
              dataType="number"
              label={t("profile.company.file_date_day")}
              value={file.dateDay || 0}
              onChange={(e) => onRelatedFileChange(index, 'dateDay', Number(e.target.value))}
            />
            <KuInput
              name={`relatedFilesDateMonth-${index}`}
              dataType="number"
              label={t("profile.company.file_date_month")}
              value={file.dateMonth || 0}
              onChange={(e) => onRelatedFileChange(index, 'dateMonth', parseInt(e.target.value))}
            />
            <KuInput
              name={`relatedFilesDateYear-${index}`}
              dataType="number"
              label={t("profile.company.file_date_year")}
              value={file.dateYear || 0}
              onChange={(e) => onRelatedFileChange(index, 'dateYear', parseInt(e.target.value))}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
