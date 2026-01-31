import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { IKuArrayProps } from "@/interfaces/ku-components";
import { useTranslation } from "react-i18next";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
  
export const KuArray = <T extends { _id: string }>(props: IKuArrayProps<T>) => {
  const { id, testId, title, items, onItemsChange, defaultNewItem, renderItem, addItem, removeItem } = props;
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const newExpandedItems: { [key: number]: boolean } = {};
    items.forEach((_, index) => {
      if (expandedItems[index] !== undefined) {
        newExpandedItems[index] = expandedItems[index];
      } else {
        newExpandedItems[index] = false;
      }
    });
    setExpandedItems(newExpandedItems);
  }, [items.length]);

  const handleAddItem = () => {
    const newItems = [...items, defaultNewItem];
    const newIndex = newItems.length - 1;
    onItemsChange(newItems);
    addItem(defaultNewItem);
    setExpandedItems({ ...expandedItems, [newIndex]: false });
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, index) => index !== indexToRemove));
    removeItem(indexToRemove);
    const newExpandedItems = { ...expandedItems };
    delete newExpandedItems[indexToRemove];
    const updatedExpandedItems: { [key: number]: boolean } = {};
    Object.keys(newExpandedItems).forEach(key => {
      const numKey = parseInt(key);
      if (numKey > indexToRemove) {
        updatedExpandedItems[numKey - 1] = newExpandedItems[numKey];
      } else if (numKey < indexToRemove) {
        updatedExpandedItems[numKey] = newExpandedItems[numKey];
      }
    });
    setExpandedItems(updatedExpandedItems);
  };

  const handleItemChange = (indexToUpdate: number, updatedItem: T) => {
    const newItems = items.map((item, index) =>
      index === indexToUpdate ? updatedItem : item
    );
    onItemsChange(newItems);
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems({ ...expandedItems, [index]: expandedItems[index] === undefined ? true : !expandedItems[index] });
  };

  return (
    <fieldset className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700" id={id} data-testid={testId}>
      <div className="flex justify-between items-center mb-3">
        <legend className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </legend>
        <Button size="xs" onClick={handleAddItem} className="text-gray-900 dark:text-white">
          {t("kuArray.add_item")}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t("kuArray.no_items_added")}
        </p>
      ) : (
        <div className="space-y-4">
          {/* Me ajude a implementar abaixo um drag para mudar a posição dos itens */}
          {items.map((item, index) => {
            const isExpanded = expandedItems[index] === undefined ? false : expandedItems[index];
            const elementNumber = index + 1;
            const label = `${t("kuArray.item")} ${elementNumber}`;
            
            return (
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", index.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
                  if (draggedIndex !== index) {
                    const newItems = [...items];
                    const draggedItem = newItems[draggedIndex];
                    newItems.splice(draggedIndex, 1);
                    newItems.splice(index, 0, draggedItem);
                    onItemsChange(newItems);
                  }
                }}
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-grab"
              >
                <div
                  onClick={() => toggleExpanded(index)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {label}
                  </span>
                  {isExpanded ? (
                    <HiChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <HiChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                {isExpanded && (
                  <div className="p-4">
                    {renderItem(item, index, handleItemChange, handleRemoveItem)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
};
