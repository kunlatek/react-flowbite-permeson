// MODIFICATION BASED ON: /Users/opah/Code/personal/kunlatek/rapida/quickstarts/react-flowbite-permeson/src/models/form.ts
export interface IFormCondition {
  type: "form" | "code" | "array";
  elements?: IConditionElement[];
  code?: IConditionCode;
}

export interface IConditionElement {
  key: string;
  value?: string | number | boolean;
  array?: string;
  comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
  logicalOperator?: "&&" | "!" | "nor" | "||";
}

export interface IConditionCode {
  triggerField: string;
  code: string;
}

export interface IFormElement {
  type: string;
  name?: string;
  todo?: string;
  conditions?: IFormCondition[];
}

export interface IFormInput extends IFormElement {
  type: "input";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "wysiwyg"
    | "time";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  validators?: ("cep" | "cpf" | "cnpj" | "onlyNumbers" | "phone" | "email")[];
  maxlength?: number;
  minLength?: number;
  apiRequest?: IApiRequest;
}

export interface IApiRequest {
  endpoint: string;
  paramType: "query" | "path";
  isNotKunlatekResponse?: boolean;
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  hasAuthentication?: boolean;
}

export interface IApiResponseField {
  formFieldName: string;
  propertiesFromApiToFillFormField: string[];
  arrayParents?: string[];
}

export interface IApiResponseFieldFilter {
  formFieldName: string;
  filterPropertyName: string;
}

export interface IFormSelect extends IFormElement {
  type: "select";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  validators?: ("cpf" | "cnpj")[];
  isMultiple?: boolean;
  options: ISelectOption[];
}

export interface ISelectOption {
  label: string;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}

export interface IFormAutocomplete extends IFormElement {
  type: "autocomplete";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  validators?: ("cpf" | "cnpj")[];
  isMultiple?: boolean;
  relatedEntity?: string;
  optionsApi: IOptionsApi;
}

export interface IOptionsApi {
  endpoint: string;
  labelField: string[];
  valueField: string;
  paramsToFilter: string[];
  paramType: "query" | "path";
  populate?: string[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  isNotKunlatekResponse?: boolean;
  rawQuery?: string;
}

export interface IFormArray extends IFormElement {
  type: "array";
  id: string;
  title: string;
  elements: IFormElement[];
}

export interface IFormFieldset extends IFormElement {
  type: "fieldset";
  id: string;
  title: string;
  elements: IFormElement[];
}

export interface IFormTab extends IFormElement {
  type: "tab";
  id: string;
  tabs: {
    id: string;
    title: string;
    elements: IFormElement[];
  }[];
}

export interface IFormFile extends IFormElement {
  type: "file";
  name: string;
  label: string;
  placeholder?: string;
  tooltip?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  validators?: ("onlyImages" | "png" | "jpg" | "pdf")[];
  isMultiple?: boolean;
}

export interface IFormButton extends IFormElement {
  type: "button";
  id: string;
  label: string;
  actionType: "submit" | "reset" | "link" | "apiRequest" | "button";
  icon?: string;
  tooltip?: string;
  isDisabled?: boolean;
  apiRequest?: IApiRequest;
}

export interface IArrayVariant {
  base: string;
  item: string;
}

export interface IArrayVariants {
  default: IArrayVariant;
  [key: string]: IArrayVariant | undefined;
}
