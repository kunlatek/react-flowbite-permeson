export interface IConditionCode {
    triggerField: string;
    code: string;
}

export interface IConditionElement {
    key: string;
    value?: string | number | boolean;
    array?: string;
    comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
    logicalOperator?: "&&" | "!" | "nor" | "||";
}

export interface IFormCondition {
    type: "form" | "code" | "array";
    elements?: IConditionElement[];
    code?: IConditionCode;
}

export interface IConditions {
    form?: {
        elements?: IConditionElement[];
    };
}

export interface ITab {
    id: string;
    title: string;
    conditions?: IConditions;
}

export interface IKuTabProps {
    id?: string;
    testId?: string;
    tabs: ITab[];
    activeTabId: string;
    onTabChange: (tabId: string) => void;
    formState: Record<string, unknown>;
    conditions?: IConditions;
}