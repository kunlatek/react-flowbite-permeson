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

export const applyMask = (value: string, maskRegex: string): string => {
    if (!maskRegex || !value) return value;

    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) return value;

    let cleanRegex = maskRegex.replace(/^\^|\$$/g, '');

    if (cleanRegex.includes('|')) {
        const alternatives = cleanRegex.split('|');
        cleanRegex = alternatives[0].replace(/^\^|\$$/g, '');
    }

    const parts: Array<{ type: 'digit' | 'separator'; value: string; minLength?: number; maxLength?: number }> = [];
    const digitPattern = /\\d\{(\d+)(?:,(\d+))?\}/g;
    let lastIndex = 0;
    let match;

    while ((match = digitPattern.exec(cleanRegex)) !== null) {
        if (match.index > lastIndex) {
            const separatorText = cleanRegex.substring(lastIndex, match.index);
            const unescapedSeparator = separatorText
                .replace(/\\([()\.\/\-\s])/g, '$1');
            if (unescapedSeparator) {
                parts.push({ type: 'separator', value: unescapedSeparator });
            }
        }

        const minLength = parseInt(match[1], 10);
        const maxLength = match[2] ? parseInt(match[2], 10) : minLength;
        parts.push({ type: 'digit', value: '', minLength, maxLength });
        lastIndex = digitPattern.lastIndex;
    }

    if (parts.length === 0) return value;

    let result = '';
    let digitIndex = 0;

    for (const part of parts) {
        if (part.type === 'separator') {
            if (digitIndex < digitsOnly.length) {
                result += part.value;
            }
        } else if (part.type === 'digit' && part.minLength) {
            const maxDigits = part.maxLength || part.minLength;
            const availableDigits = digitsOnly.length - digitIndex;
            const digitsToTake = Math.min(maxDigits, availableDigits);

            if (digitsToTake >= part.minLength) {
                const partDigits = digitsOnly.slice(digitIndex, digitIndex + digitsToTake);
                if (partDigits) {
                    result += partDigits;
                    digitIndex += partDigits.length;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    return result || digitsOnly;
};