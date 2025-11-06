export interface IFormCondition {
    key: string;
    value: any;
    comparisonOperator: '===' | '!===' | '>' | '<' | '>=' | '<=' | 'contains' | 'does not contain';
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
            case 'contains':
                result = form[condition.key].includes(condition.value);
                break;
            case 'does not contain':
                result = !form[condition.key].includes(condition.value);
                break;
        }
    }

    return result;
};