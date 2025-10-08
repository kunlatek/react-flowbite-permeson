import React, { useState } from "react";
import { Button, TextInput, Label, HelperText } from "flowbite-react";
import { HiPlus, HiTrash } from "react-icons/hi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type OnChangeFunction = (name: string, value: any) => void;

interface SortableItemProps {
  id: string;
  index: number;
  item: any;
  itemType: "string" | "object";
  placeholder: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "url";
    required?: boolean;
  }>;
  isDisabled: boolean;
  hasError: boolean;
  onItemChange: (index: number, fieldName: string, fieldValue: string) => void;
  onRemoveItem: (index: number) => void;
}

function SortableItem({
  id,
  index,
  item,
  itemType,
  placeholder,
  fields,
  isDisabled,
  hasError,
  onItemChange,
  onRemoveItem,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        title="Arrastar para reordenar"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>
      
      <div className="flex-1 space-y-2">
        {itemType === "string" ? (
          <TextInput
            value={item}
            onChange={(e) => onItemChange(index, "", e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled}
            color={hasError ? "failure" : "gray"}
          />
        ) : (
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.name}>
                <Label
                  htmlFor={`${id}-${field.name}`}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <TextInput
                  id={`${id}-${field.name}`}
                  type={field.type}
                  value={item[field.name] || ""}
                  onChange={(e) => onItemChange(index, field.name, e.target.value)}
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
        onClick={() => onRemoveItem(index)}
        disabled={isDisabled}
        className="mt-1"
        title="Remover item"
      >
        <HiTrash className="h-3 w-3" />
      </Button>
    </div>
  );
}

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
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = value.findIndex((_, index) => `${name}-${index}` === active.id);
      const newIndex = value.findIndex((_, index) => `${name}-${index}` === over?.id);

      onChange(name, arrayMove(value, oldIndex, newIndex));
    }
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={value.map((_, index) => `${name}-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {value.map((item, index) => (
              <SortableItem
                key={`${name}-${index}`}
                id={`${name}-${index}`}
                index={index}
                item={item}
                itemType={itemType}
                placeholder={placeholder}
                fields={fields}
                isDisabled={isDisabled}
                hasError={hasError}
                onItemChange={handleItemChange}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        size="md"
        color="gray"
        onClick={handleAddItem}
        disabled={isDisabled}
        className="w-full mt-3"
      >
        <HiPlus className="mr-2 h-4 w-4" />
        Adicionar {itemType === "string" ? "Item" : "Coautor"}
      </Button>

      {hasError && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
}
