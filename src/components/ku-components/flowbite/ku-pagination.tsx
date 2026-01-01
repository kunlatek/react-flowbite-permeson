import { Pagination } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { IKuPaginationProps } from "@/interfaces/ku-components";

export const KuPagination = (props: IKuPaginationProps) => {
  const { id, testId, currentPage, totalPages, onPageChange } = props;
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-center" id={id} data-testid={testId}>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showIcons
        previousLabel={t("common.pagination.previous")}
        nextLabel={t("common.pagination.next")}
      />
    </div>
  );
}
