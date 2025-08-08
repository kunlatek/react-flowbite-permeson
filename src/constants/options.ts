import type { ISelectOption } from "@/models/form";

export const maritalStatusOptions: ISelectOption[] = [
  { value: "single", label: "Solteiro(a)" },
  { value: "married", label: "Casado(a)" },
  { value: "divorced", label: "Divorciado(a)" },
  { value: "widowed", label: "Viúvo(a)" },
];

export const educationLevelOptions: ISelectOption[] = [
  {
    value: "incomplete_elementary_school",
    label: "Ensino Fundamental Incompleto",
  },
  { value: "complete_elementary_school", label: "Ensino Fundamental Completo" },
  { value: "incomplete_high_school", label: "Ensino Médio Incompleto" },
  { value: "complete_high_school", label: "Ensino Médio Completo" },
  { value: "incomplete_higher_education", label: "Ensino Superior Incompleto" },
  { value: "complete_higher_education", label: "Ensino Superior Completo" },
];

export const languageOptions: ISelectOption[] = [
  { value: "portuguese", label: "Português" },
  { value: "english", label: "Inglês" },
  { value: "spanish", label: "Espanhol" },
];

export const addressTypeOptions: ISelectOption[] = [
  { value: "residential", label: "Residencial" },
  { value: "commercial", label: "Comercial" },
];

export const bankAccountTypeOptions: ISelectOption[] = [
  { value: "current_account", label: "Conta Corrente" },
  { value: "savings_account", label: "Conta Poupança" },
];

export const contactTypeOptions: ISelectOption[] = [
  { value: "phone", label: "Telefone" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
];
