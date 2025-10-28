import { ButtonVariant } from "@/components/ku-components/flowbite/form";

export interface IColumn<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    formatValue?: (value: unknown, row: T) => React.ReactNode;
}

export interface IAction<T> {
    label: string;
    color?: ButtonVariant;
    handler: (row: T) => void;
}

export interface IHeaderAction {
    label: string;
    color?: ButtonVariant;
    handler: () => void;
}

export interface IKuDataTableProps<T> {
    title: string;
    columns: IColumn<T>[];
    dataSource: (
        params: URLSearchParams
    ) => Promise<{ data: T[]; total: number }>;
    actions?: IAction<T>[];
    getActions?: (row: T) => IAction<T>[];
    headerActions?: IHeaderAction[];
    pageSize?: number;
}