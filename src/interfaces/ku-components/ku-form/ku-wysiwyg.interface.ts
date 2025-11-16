export interface IKuWysiwygProps {
  id?: string;
  testId?: string;
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  tooltip?: string;
  height?: number;
}
