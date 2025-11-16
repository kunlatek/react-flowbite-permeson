import { Label, FileInput, HelperText } from "flowbite-react";
import { IKuFileProps } from "@/interfaces/ku-components";

export const KuFile = (props: IKuFileProps) => {
  const { id, testId, name, label, helperText, error, isRequired, isDisabled } = props;
  const hasError = !!error;
  return (
    <div id={id} data-testid={testId}>
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
};
