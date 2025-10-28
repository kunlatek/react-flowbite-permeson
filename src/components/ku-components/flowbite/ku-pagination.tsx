import { Pagination } from "flowbite-react";
import { IKuPaginationProps } from "@/interfaces/ku-components";

export const KuPagination = (props: IKuPaginationProps) => {
  const { currentPage, totalPages, onPageChange } = props;
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
