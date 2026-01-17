export interface IKuArrayProps<T> {
    id?: string;
    testId?: string;
    title: string;
    items: T[];
    onItemsChange: (items: T[]) => void;
    addItem: (item: T) => void;
    removeItem: (index: number) => void;
    defaultNewItem: T;
    renderItem: (
        item: T,
        index: number,
        handleItemChange: (index: number, updatedItem: T) => void,
        handleRemoveItem: (index: number) => void
    ) => React.ReactNode;
}