export interface IKuPaginationProps {
    id?: string;
    testId?: string;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}