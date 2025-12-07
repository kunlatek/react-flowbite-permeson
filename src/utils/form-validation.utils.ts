export interface IRequiredFieldConfig {
  fieldName: string;
  fieldLabel: string;
  condition?: (formData: Record<string, any>) => boolean;
}

export interface IValidationResult {
  fieldsWithErrors: Array<{ fieldName: string; fieldLabel: string }>;
}

export const validateRequiredFields = (
  formData: Record<string, any>,
  requiredFields: IRequiredFieldConfig[]
): IValidationResult => {
  const fieldsWithErrors: Array<{ fieldName: string; fieldLabel: string }> = [];

  requiredFields.forEach((fieldConfig) => {
    if (fieldConfig.condition && !fieldConfig.condition(formData)) {
      return;
    }

    const fieldValue = formData[fieldConfig.fieldName];
    const isEmpty = 
      fieldValue === '' || 
      fieldValue === null || 
      fieldValue === undefined ||
      (Array.isArray(fieldValue) && fieldValue.length === 0);

    if (isEmpty) {
      fieldsWithErrors.push({
        fieldName: fieldConfig.fieldName,
        fieldLabel: fieldConfig.fieldLabel,
      });
    }
  });

  return {
    fieldsWithErrors,
  };
};

