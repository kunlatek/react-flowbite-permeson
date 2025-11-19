export interface IFormCondition {
    key: string;
    value: any;
    comparisonOperator: '===' | '!===' | '>' | '<' | '>=' | '<=' | 'in' | 'nin';
}

export const showField = (form: any, conditions: IFormCondition[]) => {
    let result = true;

    for (const condition of conditions) {
        switch (condition.comparisonOperator) {
            case '===':
                result = form[condition.key] === condition.value;
                break;
            case '!===':
                result = form[condition.key] !== condition.value;
                break;
            case '>':
                result = form[condition.key] > condition.value;
                break;
            case '<':
                result = form[condition.key] < condition.value;
                break;
            case '>=':
                result = form[condition.key] >= condition.value;
                break;
            case '<=':
                result = form[condition.key] <= condition.value;
                break;
            case 'in':
                result = form[condition.key].includes(condition.value);
                break;
            case 'nin':
                result = !form[condition.key].includes(condition.value);
                break;
        }
    }

    return result;
};

export interface IApiResponseField {
    formFieldName: string;
    propertiesFromApiToFillFormField: string[];
    arrayParents?: string[];
}

export const fillFormByApiResponse = (form: any, apiResponse: any, formFieldsFilledByApiResponse: IApiResponseField[]) => {
    for (const field of formFieldsFilledByApiResponse) {
        form[field.formFieldName] = field.propertiesFromApiToFillFormField[0] ? apiResponse[field.propertiesFromApiToFillFormField[0]] : apiResponse;
        if (field.arrayParents) {
            for (const parent of field.arrayParents) {
                form[parent] = form[parent].map((item: any) => {
                    return { ...item, ...form[field.formFieldName] };
                });
            }
        }
    }
    return form;
};