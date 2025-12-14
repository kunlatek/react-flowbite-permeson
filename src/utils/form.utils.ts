export interface IFormCondition {
    key: string;
    value: any;
    comparisonOperator: '===' | '!==' | '>' | '<' | '>=' | '<=' | 'in' | 'nin';
    logicalOperator?: '&&' | '||';
}

export const showField = (form: any, conditions: IFormCondition[]) => {
    if (!conditions || conditions.length === 0) {
        return true;
    }

    let conditionResult = false;
    
    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        let currentResult = false;

        switch (condition.comparisonOperator) {
            case '===':
                currentResult = form[condition.key] === condition.value;
                break;
            case '!==':
                currentResult = form[condition.key] !== condition.value;
                break;
            case '>':
                currentResult = form[condition.key] > condition.value;
                break;
            case '<':
                currentResult = form[condition.key] < condition.value;
                break;
            case '>=':
                currentResult = form[condition.key] >= condition.value;
                break;
            case '<=':
                currentResult = form[condition.key] <= condition.value;
                break;
            case 'in':
                currentResult = form[condition.key]?.includes(condition.value) ?? false;
                break;
            case 'nin':
                currentResult = !(form[condition.key]?.includes(condition.value) ?? false);
                break;
        }

        if (i === 0) {
            conditionResult = currentResult;
        } else {
            const previousCondition = conditions[i - 1];
            const logicalOperator = previousCondition.logicalOperator || '&&';
            
            if (logicalOperator === '||') {
                conditionResult = conditionResult || currentResult;
            } else {
                conditionResult = conditionResult && currentResult;
            }
        }
    }

    return conditionResult;
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

    const unescapeSeparator = (text: string): string => {
        let result = '';
        let i = 0;
        while (i < text.length) {
            if (text[i] === '\\' && i + 1 < text.length) {
                const nextChar = text[i + 1];
                if (nextChar === '(' || nextChar === ')' || nextChar === '.' || nextChar === '/' || nextChar === '-' || nextChar === ' ') {
                    result += nextChar;
                    i += 2;
                } else {
                    result += text[i];
                    i++;
                }
            } else {
                result += text[i];
                i++;
            }
        }
        return result;
    };

    const parts: Array<{ type: 'digit' | 'separator'; value: string; minLength?: number; maxLength?: number }> = [];
    const digitPattern = /\\d\{(\d+)(?:,(\d+))?\}/g;
    let lastIndex = 0;
    let match;

    while ((match = digitPattern.exec(cleanRegex)) !== null) {
        if (match.index > lastIndex) {
            const separatorText = cleanRegex.substring(lastIndex, match.index);
            const unescapedSeparator = unescapeSeparator(separatorText);
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
    let partIndex = 0;

    while (partIndex < parts.length && digitIndex < digitsOnly.length) {
        const part = parts[partIndex];
        
        if (part.type === 'separator') {
            if (digitIndex < digitsOnly.length) {
                result += part.value;
            }
            partIndex++;
        } else if (part.type === 'digit' && part.minLength) {
            const maxDigits = part.maxLength || part.minLength;
            const availableDigits = digitsOnly.length - digitIndex;
            const digitsToTake = Math.min(maxDigits, availableDigits);

            if (digitsToTake > 0) {
                const partDigits = digitsOnly.slice(digitIndex, digitIndex + digitsToTake);
                result += partDigits;
                digitIndex += partDigits.length;
                partIndex++;
            } else {
                break;
            }
        } else {
            partIndex++;
        }
    }

    return result || digitsOnly;
};