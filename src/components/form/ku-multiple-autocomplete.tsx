import { useState, useEffect, useRef, useCallback } from "react";
import { Label, HelperText, Spinner, Badge } from "flowbite-react";
import { HiX, HiChevronDown } from "react-icons/hi";
import api from "@/services/api";

interface Option {
  label: string;
  value: string;
}

interface ApiConfig {
  endpoint: string;
  searchParam: string;
  labelField: string;
  valueField: string;
  limit?: number;
}

interface KUMultipleAutocompleteProps {
  name: string;
  label: string;
  value: string[];
  onChange: (name: string, value: string[]) => void;
  apiConfig: ApiConfig;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  error?: string;
  tooltip?: string;
  excludeIds?: string[]; // IDs to exclude from search results
  loadSelectedItems?: boolean; // Whether to load full data for selected items
}

export const KUMultipleAutocomplete = ({
  name,
  label,
  value = [],
  onChange,
  apiConfig,
  placeholder = "Pesquisar e selecionar",
  isRequired = false,
  isDisabled = false,
  error = "",
  tooltip = "",
  excludeIds = [],
  loadSelectedItems = true,
}: KUMultipleAutocompleteProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const mainElementRef = useRef<HTMLDivElement>(null);
  const hasError = !!error;

  const resolveNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc: any, key: string) => {
      if (acc && typeof acc === "object" && key in acc) {
        return acc[key];
      }
      return undefined;
    }, obj);
  };

  const fetchOptions = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) {
          params.append(apiConfig.searchParam, query);
        }
        if (apiConfig.limit) {
          params.append("limit", apiConfig.limit.toString());
        }

        const endpoint = apiConfig.endpoint.startsWith("/api")
          ? apiConfig.endpoint.slice(4)
          : apiConfig.endpoint;

        const response = await api.get(endpoint, { params });
        const items = response.data.data || response.data;

        if (Array.isArray(items)) {
          // Filter out excluded items
          const filteredItems = items.filter((item: any) => {
            const itemId = resolveNestedValue(item, apiConfig.valueField);
            return !excludeIds.includes(itemId) && !value.includes(itemId);
          });

          const formattedOptions: Option[] = filteredItems.map((item: any) => ({
            label: resolveNestedValue(item, apiConfig.labelField),
            value: resolveNestedValue(item, apiConfig.valueField),
          }));

          setOptions(formattedOptions);
        }
      } catch (err) {
        console.error("Erro ao buscar opções:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [apiConfig, excludeIds, value]
  );

  // Load selected items data
  useEffect(() => {
    const loadSelectedItemsData = async () => {
      if (loadSelectedItems && value && value.length > 0) {
        try {
          const itemsData = await Promise.all(
            value.map(async (itemId) => {
              try {
                const endpoint = apiConfig.endpoint.startsWith("/api")
                  ? apiConfig.endpoint.slice(4)
                  : apiConfig.endpoint;
                
                const response = await api.get(`${endpoint}/${itemId}`);
                const item = response.data.data || response.data;
                
                return {
                  label: resolveNestedValue(item, apiConfig.labelField),
                  value: resolveNestedValue(item, apiConfig.valueField),
                };
              } catch (error) {
                console.error(`Error loading item ${itemId}:`, error);
                return null;
              }
            })
          );
          setSelectedItems(itemsData.filter((item): item is Option => item !== null));
        } catch (error) {
          console.error("Error loading selected items:", error);
        }
      } else {
        // If not loading full data, just create basic options from IDs
        setSelectedItems(value.map(id => ({ label: id, value: id })));
      }
    };
    loadSelectedItemsData();
  }, [value, apiConfig, loadSelectedItems]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (showDropdown && searchTerm.trim().length > 0) {
        fetchOptions(searchTerm);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchOptions, showDropdown]);

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

  const handleSelectOption = (option: Option) => {
    if (isDisabled) return;

    const newValue = [...value, option.value];
    onChange(name, newValue);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const removeItem = (itemId: string) => {
    if (isDisabled) return;
    const newValue = value.filter((id) => id !== itemId);
    onChange(name, newValue);
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
          <div className="flex flex-wrap gap-1 items-center flex-grow">
            {selectedItems.length > 0 &&
              selectedItems.map((item) => (
                <Badge
                  key={item.value}
                  color="blue"
                  className="inline-flex items-center"
                >
                  <span className="max-w-xs truncate">{item.label}</span>
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
            <input
              id={name}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder={selectedItems.length > 0 ? "" : placeholder}
              className="flex-grow border-none bg-transparent focus:ring-0 p-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              disabled={isDisabled}
            />
          </div>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <HiChevronDown
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
                options.map((option: Option) => (
                  <li
                    key={option.value}
                    className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.label}
                  </li>
                ))
              ) : searchTerm.trim().length > 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Nenhum item encontrado.
                </li>
              ) : (
                <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Digite para pesquisar.
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
