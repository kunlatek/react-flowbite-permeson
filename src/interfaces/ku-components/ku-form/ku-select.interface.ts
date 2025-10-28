export interface ISelectOption {
  label: string;
  value: string | number;
  isDisabled?: boolean;
  isSelected?: boolean;
}

export interface IKuSelectProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (name: string, value: string | number | boolean | (string | number | boolean)[]) => void;
  options: ISelectOption[];
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isMultiple?: boolean;
  error?: string;
  tooltip?: string;
}