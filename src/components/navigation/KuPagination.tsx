import { Pagination } from "flowbite-react";

interface KuPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function KuPagination({
  currentPage,
  totalPages,
  onPageChange,
}: KuPaginationProps) {
  return (
    <div className="flex justify-center">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showIcons
      />
    </div>
  );
}
