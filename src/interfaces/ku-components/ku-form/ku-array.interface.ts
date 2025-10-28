export interface IKuArrayProps<T> {
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