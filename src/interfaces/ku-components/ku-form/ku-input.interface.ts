export interface IKuInputProps {
    id?: string;
    testId?: string;
    name: string;
    label: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    tooltip?: string;   
    dataType?: "text" | "number" | "password" | "email" | "color" | "date" | "wysiwyg" | "time";
}