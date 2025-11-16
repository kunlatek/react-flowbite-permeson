import { IFormAutocomplete, ISelectOption } from "@/models/form";

export type ApiItem = Record<string, unknown>;

type OnChangeValue = ISelectOption | ISelectOption[] | null;
type OnChangeFunction = (name: string, value: OnChangeValue) => void;

export interface IKuAutocompleteProps extends IFormAutocomplete {
  id?: string;
  testId?: string;
  value: OnChangeValue;
  onChange: OnChangeFunction;
  error?: string;
  formState: Record<string, unknown>;
}