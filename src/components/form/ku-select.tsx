import { useState, useEffect, useRef } from "react";
import {
  Label,
  Select,
  HelperText,
  TextInput,
  Checkbox,
  Badge,
} from "flowbite-react";
import { HiX, HiChevronDown } from "react-icons/hi";
import type { IFormSelect, ISelectOption } from "@/models/form";

type OnChangeValue = string | number | boolean | (string | number | boolean)[];
type OnChangeFunction = (name: string, value: OnChangeValue) => void;

interface KuSelectProps extends IFormSelect {
  value: OnChangeValue;
  onChange: OnChangeFunction;
  error?: string;
}

export const KuSelect = ({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione uma ou mais opções",
  isRequired = false,
  isDisabled = false,
  isMultiple = false,
  error = "",
  tooltip = "",
}: KuSelectProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const mainElementRef = useRef<HTMLDivElement>(null);
  const hasError = !!error;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        mainElementRef.current &&
        !mainElementRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const filteredOptions = searchTerm
    ? options.filter((opt) =>
        String(opt.label).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedItems = Array.isArray(value)
    ? options.filter((opt) => value.includes(opt.value))
    : [];

  const handleCheckboxChange = (
    isChecked: boolean,
    itemValue: string | number | boolean
  ) => {
    if (isDisabled) return;
    const currentValue = Array.isArray(value) ? [...value] : [];

    let newValue: (string | number | boolean)[];
    if (isChecked) {
      if (!currentValue.includes(itemValue)) {
        newValue = [...currentValue, itemValue];
      } else {
        newValue = currentValue;
      }
    } else {
      newValue = currentValue.filter((v) => v !== itemValue);
    }
    onChange(name, newValue);
  };

  const removeItem = (itemValue: string | number | boolean) => {
    if (isDisabled || !Array.isArray(value)) return;
    const newValue = value.filter((v) => v !== itemValue);
    onChange(name, newValue);
  };

  const handleSingleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const stringValue = event.target.value;
    
    if (stringValue === "") {
      onChange(name, "");
      return;
    }
    
    // Find the option that matches the selected value
    const selectedOption = options.find(
      (opt) => String(opt.value) === stringValue
    );
    
    // Use the original value from the option, not the string value
    const originalValue = selectedOption ? selectedOption.value : stringValue;
    

    
    // Ensure we're passing the correct value type
    onChange(name, originalValue);
  };

  return (
    <div className="w-full" ref={mainElementRef}>
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

      {isMultiple ? (
        <div className="relative">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !isDisabled && setShowDropdown(!showDropdown)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!isDisabled) setShowDropdown(!showDropdown);
              }
            }}
            className={`flex min-h-[42px] items-center justify-between w-full p-2.5 text-left bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 ${
              isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            <div className="flex flex-wrap gap-1">
              {selectedItems.length === 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                  {placeholder}
                </span>
              )}
              {selectedItems.map((item) => (
                <Badge
                  key={String(item.value)}
                  color="blue"
                  className="inline-flex items-center"
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.value);
                    }}
                    className="ml-2"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <HiChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-700 border dark:border-gray-600">
              <div className="p-2">
                <TextInput
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full text-sm"
                />
              </div>
              <ul className="max-h-60 py-1 overflow-auto text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option: ISelectOption) => (
                    <li
                      key={String(option.value)}
                      className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Label className="flex items-center w-full cursor-pointer text-gray-900 dark:text-white">
                        <Checkbox
                          className="mr-2"
                          checked={
                            Array.isArray(value) && value.includes(option.value)
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              e.currentTarget.checked,
                              option.value
                            )
                          }
                          disabled={option.isDisabled || isDisabled}
                        />
                        <span className="text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </Label>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma opção encontrada.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Select
          id={name}
          name={name}
          value={value !== null && value !== undefined ? String(value) : ""}
          onChange={handleSingleSelectChange}
          required={isRequired}
          disabled={isDisabled}
          multiple={isMultiple}
          color={hasError ? "failure" : "gray"}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.isDisabled}
            >
              {option.label}
            </option>
          ))}
        </Select>
      )}

      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
};
