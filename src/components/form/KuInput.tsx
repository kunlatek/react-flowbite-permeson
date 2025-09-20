import { useState } from "react";
import { Label, TextInput, HelperText } from "flowbite-react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import type { IFormInput } from "@/models/form";

interface KuInputProps extends IFormInput {
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function KuInput({
  name,
  label,
  value,
  onChange,
  dataType = "text",
  placeholder = "",
  isRequired = false,
  isDisabled = false,
  error = "",
  tooltip = "",
}: KuInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = dataType === "password";
  const inputType = isPassword && showPassword ? "text" : dataType;
  const hasError = !!error;

  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label
          htmlFor={name}
          color={hasError ? "failure" : "gray"}
          title={tooltip}
          className="text-gray-900 dark:text-white"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      <div className="relative">
        <TextInput
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={isRequired}
          disabled={isDisabled}
          color={hasError ? "failure" : "gray"}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </button>
        )}
      </div>
      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
}
