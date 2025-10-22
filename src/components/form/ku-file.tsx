import { Label, FileInput, HelperText } from "flowbite-react";
import type { IFormFile } from "@/models/form";

interface KuFileProps extends IFormFile {
  error?: string;
  helperText?: string;
  // onChange e value a serem adicionados para controle de estado
}

export function KuFile({
  name,
  label,
  helperText,
  error,
  isRequired,
  isDisabled,
}: KuFileProps) {
  const hasError = !!error;
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={name} color={hasError ? "failure" : "gray"} className="text-gray-900 dark:text-white">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      <FileInput
        id={name}
        name={name}
        helperText={helperText}
        color={hasError ? "failure" : "gray"}
        disabled={isDisabled}
        required={isRequired}
      />
      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
}
