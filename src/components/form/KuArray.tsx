import { Button } from "flowbite-react";

interface KuArrayProps<T> {
  title: string;
  items: T[];
  onItemsChange: (items: T[]) => void;
  defaultNewItem: T;
  renderItem: (
    item: T,
    index: number,
    handleItemChange: (index: number, updatedItem: T) => void,
    handleRemoveItem: (index: number) => void
  ) => React.ReactNode;
}

export default function KuArray<T>({
  title,
  items,
  onItemsChange,
  defaultNewItem,
  renderItem,
}: KuArrayProps<T>) {
  const handleAddItem = () => {
    onItemsChange([...items, defaultNewItem]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, index) => index !== indexToRemove));
  };

  const handleItemChange = (indexToUpdate: number, updatedItem: T) => {
    const newItems = items.map((item, index) =>
      index === indexToUpdate ? updatedItem : item
    );
    onItemsChange(newItems);
  };

  return (
    <fieldset className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <legend className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </legend>
        <Button size="xs" onClick={handleAddItem}>
          Adicionar Item
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Nenhum item adicionado.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {renderItem(item, index, handleItemChange, handleRemoveItem)}
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}
