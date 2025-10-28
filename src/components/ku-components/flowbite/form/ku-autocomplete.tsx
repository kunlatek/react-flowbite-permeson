import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Label, TextInput, HelperText, Spinner, Badge } from "flowbite-react";
import { HiX, HiChevronDown } from "react-icons/hi";
import type { ISelectOption } from "@/models/form";
import api from "@/services/api";

import { IKuAutocompleteProps, ApiItem } from "@/interfaces/ku-components";

export const KuAutocomplete = (props: IKuAutocompleteProps) => {
  const { name, label, value, onChange, optionsApi, placeholder = "Pesquisar e selecionar", isRequired = false, isDisabled = false, isMultiple = false, error = "", tooltip = "", conditions, formState } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<ISelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ISelectOption[]>([]);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const mainElementRef = useRef<HTMLDivElement>(null);
  const hasError = !!error;

  const resolveNestedValue = (obj: ApiItem, path: string): unknown => {
    return path.split(".").reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === "object" && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  const fetchOptions = useCallback(
    async (query = "") => {
      if (!optionsApi.endpoint || query.length < 3) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query && optionsApi.paramsToFilter.length > 0) {
          const filters = optionsApi.paramsToFilter?.map((param) => ({[param]: query}));
          if (filters && filters.length > 0) {
            params.append("filters", JSON.stringify(filters));
          }
        }

        const endpoint = optionsApi.endpoint.startsWith("/api")
          ? optionsApi.endpoint.slice(4)
          : optionsApi.endpoint;

        const response = await api.get(endpoint, { params });
        const items = response.data.data || response.data;

        if (Array.isArray(items)) {
          const formattedOptions: ISelectOption[] = items.map(
            (item: ApiItem) => {
              const label = optionsApi.labelField
                .map((field) => String(resolveNestedValue(item, field) || ""))
                .join(" ");
              const value = resolveNestedValue(item, optionsApi.valueField) as
                | string
                | number
                | boolean;

              return { label, value };
            }
          );

          // Filter out already selected options
          const selectedValues = isMultiple && Array.isArray(value) 
            ? value.map(item => {
                if (typeof item === "object" && item && "value" in item) {
                  return item.value;
                }
                return item;
              })
            : [];

          const filteredOptions = formattedOptions.filter(option => 
            !selectedValues.includes(option.value)
          );

          setOptions(filteredOptions);
        }
      } catch (err) {
        console.error("Erro ao buscar opções:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [optionsApi, isMultiple, value]
  );

  const evaluateConditions = useCallback(
    (state: Record<string, unknown>): boolean => {
      if (!conditions || conditions.length === 0) return true;

      for (const condition of conditions) {
        if (condition.type === "form" && condition.elements) {
          let overallResult = true;
          let firstElement = true;

          for (const element of condition.elements) {
            const formValue = state[element.key];
            const elementValue = element.value;
            let currentResult = false;

            if (Array.isArray(formValue)) {
              const check = (item: unknown) => {
                if (
                  typeof item === "object" &&
                  item !== null &&
                  "value" in item
                ) {
                  return (item as { value: unknown }).value === elementValue;
                }
                return item === elementValue;
              };
              switch (element.comparisonOperator) {
                case "===":
                case "in":
                  currentResult = formValue.some(check);
                  break;
                case "!==":
                case "nin":
                  currentResult = !formValue.some(check);
                  break;
              }
            } else {
              if (
                elementValue === undefined &&
                !["in", "nin"].includes(element.comparisonOperator)
              ) {
                currentResult = false;
              } else {
                switch (element.comparisonOperator) {
                  case "===":
                    currentResult = formValue === elementValue;
                    break;
                  case "!==":
                    currentResult = formValue !== elementValue;
                    break;
                  case ">":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue > elementValue;
                    }
                    break;
                  case ">=":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue >= elementValue;
                    }
                    break;
                  case "<":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue < elementValue;
                    }
                    break;
                  case "<=":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue <= elementValue;
                    }
                    break;
                  case "in":
                    if (Array.isArray(elementValue)) {
                      currentResult = elementValue.includes(formValue);
                    }
                    break;
                  case "nin":
                    if (Array.isArray(elementValue)) {
                      currentResult = !elementValue.includes(formValue);
                    }
                    break;
                }
              }
            }

            if (firstElement) {
              overallResult = currentResult;
              firstElement = false;
            } else {
              if (element.logicalOperator === "||") {
                overallResult = overallResult || currentResult;
              } else {
                overallResult = overallResult && currentResult;
              }
            }
          }
          if (!overallResult) return false;
        }
      }
      return true;
    },
    [conditions]
  );

  const showComponent = useMemo(
    () => evaluateConditions(formState),
    [formState, evaluateConditions]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (showDropdown) {
        fetchOptions(searchTerm);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchOptions, showDropdown]);

  // Load selected items data for multiple mode
  useEffect(() => {
    const loadSelectedItemsData = async () => {
      if (isMultiple && value && Array.isArray(value) && value.length > 0) {
        setLoadingSelected(true);
        try {
          const itemsData = await Promise.all(
            value.map(async (item) => {
              // If item already has label, use it
              if (typeof item === "object" && item && "label" in item && item.label) {
                return item;
              }
              
              // Otherwise, fetch the full data from API
              try {
                const itemId = typeof item === "object" && item && "value" in item 
                  ? item.value 
                  : item;
                
                const endpoint = optionsApi.endpoint.startsWith("/api")
                  ? optionsApi.endpoint.slice(4)
                  : optionsApi.endpoint;
                
                const response = await api.get(`${endpoint}/${itemId}`);
                const apiItem = response.data.data || response.data;
                
                return {
                  label: optionsApi.labelField
                    .map((field) => String(resolveNestedValue(apiItem, field) || ""))
                    .join(" "),
                  value: resolveNestedValue(apiItem, optionsApi.valueField) as
                    | string
                    | number
                    | boolean,
                };
              } catch (error) {
                console.error(`Error loading item ${item}:`, error);
                // Return a fallback item with the ID as label
                return {
                  label: String(item),
                  value: item,
                };
              }
            })
          );
          setSelectedItems(itemsData.filter((item): item is ISelectOption => item !== null));
        } catch (error) {
          console.error("Error loading selected items:", error);
          // Fallback: create basic options from the value array
          setSelectedItems(value.map(item => ({
            label: typeof item === "object" && item && "label" in item 
              ? String(item.label) 
              : String(item),
            value: typeof item === "object" && item && "value" in item 
              ? item.value 
              : item,
          })));
        } finally {
          setLoadingSelected(false);
        }
      } else if (isMultiple) {
        setSelectedItems([]);
      }
    };
    
    loadSelectedItemsData();
  }, [value, isMultiple, optionsApi]);

  useEffect(() => {
    if (!isMultiple && value && typeof value === "object" && "label" in value) {
      setSearchTerm(value.label);
    } else if (!isMultiple && !value) {
      setSearchTerm("");
    }
  }, [value, isMultiple]);

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

  const handleSelectOption = (option: ISelectOption) => {
    if (isDisabled) return;

    if (isMultiple) {
      const currentValue = (value as ISelectOption[]) || [];
      const isSelected = currentValue.some(
        (item) => item.value === option.value
      );
      const newValue = isSelected
        ? currentValue.filter((item) => item.value !== option.value)
        : [...currentValue, option];
      onChange(name, newValue);
    } else {
      onChange(name, option);
      setSearchTerm(option.label);
    }
    
    // Clear the options list after selection to prevent showing already selected items
    setOptions([]);
    setShowDropdown(false);
    if (isMultiple) setSearchTerm("");
  };

  const removeItem = (itemValue: string | number | boolean) => {
    if (isDisabled || !isMultiple || !Array.isArray(value)) return;
    const newValue = value.filter((v) => {
      const vValue = typeof v === "object" && v && "value" in v ? v.value : v;
      return vValue !== itemValue;
    });
    onChange(name, newValue);
  };

  if (!showComponent) {
    return null;
  }

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

      <div className="relative">
        <div
          role="button"
          tabIndex={0}
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
          <div className="flex flex-wrap gap-1 items-center flex-grow">
            {isMultiple && loadingSelected && (
              <div className="flex items-center text-sm text-gray-500">
                <Spinner size="sm" className="mr-2" />
                Carregando itens selecionados...
              </div>
            )}
            {isMultiple &&
              !loadingSelected &&
              selectedItems.length > 0 &&
              selectedItems.map((item) => (
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
            <TextInput
              id={name}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder={
                (!isMultiple && value) ||
                (isMultiple && (selectedItems.length > 0 || loadingSelected))
                  ? ""
                  : placeholder
              }
              className="flex-grow border-none bg-transparent focus:ring-0 p-0 text-sm"
              disabled={isDisabled}
            />
          </div>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <HiChevronDown
              onClick={() => !isDisabled && setShowDropdown(!showDropdown)}
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-700 border dark:border-gray-600">
            <ul className="max-h-60 py-1 overflow-auto text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {loading && options.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Carregando...
                </li>
              ) : options.length > 0 ? (
                options.map((option: ISelectOption) => (
                  <li
                    key={String(option.value)}
                    className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.label}
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

      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
};
