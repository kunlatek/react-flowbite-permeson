export interface ISortableItemProps {
    id: string;
    index: number;
    item: any;
    itemType: "string" | "object";
    placeholder: string;
    fields: Array<{
        name: string;
        label: string;
        type: "text" | "email" | "tel" | "url";
        required?: boolean;
    }>;
    isDisabled: boolean;
    hasError: boolean;
    onItemChange: (index: number, fieldName: string, fieldValue: string) => void;
    onRemoveItem: (index: number) => void;
}

type OnChangeFunction = (name: string, value: any) => void;

export interface IKuArrayFormProps {
    name: string;
    label: string;
    value: any[];
    onChange: OnChangeFunction;
    itemType: "string" | "object";
    placeholder?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    error?: string;
    tooltip?: string;
    fields?: Array<{
        name: string;
        label: string;
        type: "text" | "email" | "tel" | "url";
        required?: boolean;
    }>;
}