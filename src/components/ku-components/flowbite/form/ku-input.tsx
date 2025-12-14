import { useState } from "react";
import { Label, TextInput, HelperText } from "flowbite-react";
import { HiEye, HiEyeOff, HiCalendar } from "react-icons/hi";
import { IKuInputProps } from "@/interfaces/ku-components";

export const KuInput = (props: IKuInputProps) => {

  const { id, testId, name, label, value, onChange, dataType = "text", placeholder = "", isRequired = false, isDisabled = false, error = "", tooltip = "" } = props;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = dataType === "password";
  const dateTypes = ["date", "Date", "datetime", "timestamp", "datetime2"];
  const isDate = typeof dataType === "string" && dateTypes.includes(dataType);
  const inputType = isPassword && showPassword ? "text" : (isDate ? "date" : dataType);
  const hasError = !!error;

  return (
    <div className="w-full" id={id} data-testid={testId}>
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
          className={isDate ? "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10" : ""}
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
        {isDate && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-0">
            <HiCalendar className="text-gray-500 dark:text-gray-300" size={20} />
          </div>
        )}
      </div>
      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
};
