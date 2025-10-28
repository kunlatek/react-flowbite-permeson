export interface IKuPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}