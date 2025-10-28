import { useTranslation } from 'react-i18next';
import { Card } from 'flowbite-react';
import { KuInput, KuButton } from '@/components/ku-components';

interface CompanyImagesFormProps {
  companyImages: string[];
  onAddCompanyImage: () => void;
  onRemoveCompanyImage: (index: number) => void;
  onCompanyImageChange: (index: number, value: string) => void;
}

export const CompanyImageForm = ({
  companyImages,
  onAddCompanyImage,
  onRemoveCompanyImage,
  onCompanyImageChange
}: CompanyImagesFormProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("profile.company.images")}
        </h3>
        <KuButton
          id="add-company-image"
          type="button"
          actionType="button"
          variant="secondary"
          size="sm"
          label={t("profile.company.add_image")}
          onClick={onAddCompanyImage}
        />
      </div>

      {companyImages?.map((image, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              {t("profile.company.image")} {index + 1}
            </h4>
            <KuButton
              id={`remove-company-image-${index}`}
              type="button"
              actionType="button"
              variant="danger"
              size="sm"
              label={t("profile.company.remove_image")}
              onClick={() => onRemoveCompanyImage(index)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <KuInput
              name={`companyImage-${index}`}
              dataType="text"
              label={t("profile.company.image_path")}
              value={image || ''}
              onChange={(e) => onCompanyImageChange(index, e.target.value)}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
