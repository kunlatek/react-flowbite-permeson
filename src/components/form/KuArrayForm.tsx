import React, { useState } from "react";
import { Button, TextInput, Label, HelperText } from "flowbite-react";
import { HiPlus, HiX } from "react-icons/hi";

type OnChangeFunction = (name: string, value: any) => void;

interface KuArrayFormProps {
  name: string;
  label: string;
  value: any[];
  onChange: OnChangeFunction;
  itemType: "string" | "object";
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  error?: string;
  tooltip?: string;
  fields?: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "url";
    required?: boolean;
  }>;
}

export default function KuArrayForm({
  name,
  label,
  value = [],
  onChange,
  itemType,
  placeholder = "Digite um item",
  isRequired = false,
  isDisabled = false,
  error = "",
  tooltip = "",
  fields = [],
}: KuArrayFormProps) {
  const hasError = !!error;

  const handleAddItem = () => {
    if (isDisabled) return;
    
    const newItem = itemType === "string" ? "" : fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as any);
    
    onChange(name, [...value, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (isDisabled) return;
    const newValue = value.filter((_, i) => i !== index);
    onChange(name, newValue);
  };

  const handleItemChange = (index: number, fieldName: string, fieldValue: string) => {
    if (isDisabled) return;
    
    const newValue = value.map((item, i) => {
      if (i === index) {
        if (itemType === "string") {
          return fieldValue;
        } else {
          return { ...item, [fieldName]: fieldValue };
        }
      }
      return item;
    });
    
    onChange(name, newValue);
  };

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

      <div className="space-y-3">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex-1 space-y-2">
              {itemType === "string" ? (
                <TextInput
                  value={item}
                  onChange={(e) => handleItemChange(index, "", e.target.value)}
                  placeholder={placeholder}
                  disabled={isDisabled}
                  color={hasError ? "failure" : "gray"}
                />
              ) : (
                <div className="space-y-2">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <Label
                        htmlFor={`${name}-${index}-${field.name}`}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <TextInput
                        id={`${name}-${index}-${field.name}`}
                        type={field.type}
                        value={item[field.name] || ""}
                        onChange={(e) => handleItemChange(index, field.name, e.target.value)}
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                        disabled={isDisabled}
                        color={hasError ? "failure" : "gray"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              size="xs"
              color="failure"
              onClick={() => handleRemoveItem(index)}
              disabled={isDisabled}
              className="mt-1"
            >
              <HiX className="h-3 w-3" />
            </Button>
          </div>
        ))}

        <Button
          size="md"
          color="gray"
          onClick={handleAddItem}
          disabled={isDisabled}
          className="w-full"
        >
          <HiPlus className="mr-2 h-4 w-4" />
          Adicionar {itemType === "string" ? "Item" : "Coautor"}
        </Button>
      </div>

      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
}
