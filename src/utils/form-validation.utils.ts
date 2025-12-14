export interface IRequiredFieldConfig {
  fieldName: string;
  fieldLabel: string;
  condition?: (formData: Record<string, any>) => boolean;
  tabId?: string;
}

export interface IValidationResult {
  fieldsWithErrors: Array<{ fieldName: string; fieldLabel: string; tabId?: string }>;
  errorsByTab: Record<string, Array<{ fieldName: string; fieldLabel: string }>>;
}

export const validateRequiredFields = (
  formData: Record<string, any>,
  requiredFields: IRequiredFieldConfig[]
): IValidationResult => {
  const fieldsWithErrors: Array<{ fieldName: string; fieldLabel: string; tabId?: string }> = [];
  const errorsByTab: Record<string, Array<{ fieldName: string; fieldLabel: string }>> = {};

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
      const error = {
        fieldName: fieldConfig.fieldName,
        fieldLabel: fieldConfig.fieldLabel,
      };

      fieldsWithErrors.push({
        ...error,
        tabId: fieldConfig.tabId,
      });

      if (fieldConfig.tabId) {
        if (!errorsByTab[fieldConfig.tabId]) {
          errorsByTab[fieldConfig.tabId] = [];
        }
        errorsByTab[fieldConfig.tabId].push(error);
      } else {
        if (!errorsByTab['_noTab']) {
          errorsByTab['_noTab'] = [];
        }
        errorsByTab['_noTab'].push(error);
      }
    }
  });

  return {
    fieldsWithErrors,
    errorsByTab,
  };
};

