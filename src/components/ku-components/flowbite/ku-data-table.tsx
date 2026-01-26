import { useState, useEffect } from "react";
import { Table, Dropdown, Button } from "flowbite-react";
import { HiDotsVertical, HiSearch, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { KuCard, KuPagination } from "@/components/ku-components/flowbite";
import { KuButton } from "@/components/ku-components/flowbite/form";
import axios from "axios";
import { IColumn, IKuDataTableProps } from "@/interfaces/ku-components";
import { KuSpinner } from "@/components/ku-components";
import { useIsMobileOrTablet } from "@/hooks/use-is-mobile";

export const KuDataTable = <T extends { _id: string }>(props: IKuDataTableProps<T>) => {
  const { t } = useTranslation();
  const [data, setData] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});
  const isMobile = useIsMobileOrTablet();

  const { id, testId, title, columns, dataSource, actions = [], getActions, headerActions = [], pageSize = 10, refreshTrigger } = props;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", String(currentPage));
        params.append("limit", String(pageSize));
        if (sortColumn) {
          params.append("sortBy", String(sortColumn));
          params.append("sortDir", sortDirection);
        }
        if (searchTerm.trim()) {
          const filters = columns
            .map((col) => {
              const field = String(col.key);
              return { [field]: searchTerm.trim() };
            })
            .filter((filter) => Object.keys(filter)[0] !== "_id");
          if (filters.length > 0) {
            params.append("filters", JSON.stringify(filters));
          }
        }
        const result = await dataSource(params);
        setData(result.data);
        setTotalItems(result.total);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch data");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortColumn, sortDirection, refreshTrigger, searchTerm]);

  const handleSort = (columnKey: keyof T | string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const resolveNestedValue = (obj: T, path: string): unknown => {
    const keys = path.split(".");

    const extractValue = (value: unknown, index: number): unknown => {
      if (value === null || value === undefined) {
        return undefined;
      }

      if (Array.isArray(value)) {
        const items = value
          .map((item) => extractValue(item, index))
          .filter(
            (item) =>
              item !== undefined &&
              item !== null &&
              item !== "" &&
              !(Array.isArray(item) && item.length === 0)
          );

        if (items.length === 0) {
          return undefined;
        }

        const hasObjectItem = items.some((item) => typeof item === "object");

        if (hasObjectItem) {
          return items;
        }

        return items.join(", ");
      }

      if (typeof value !== "object" || index >= keys.length) {
        return value;
      }

      const key = keys[index];
      const nextValue = (value as Record<string, unknown>)[key];
      return extractValue(nextValue, index + 1);
    };

    return extractValue(obj, 0);
  };

  const getImagesFromRow = (row: T): Array<{ url: string; name?: string }> => {
    for (const column of columns) {
      const value = resolveNestedValue(row, String(column.key));
      if (Array.isArray(value) && value.length > 0 && value[0]?.url) {
        return value as Array<{ url: string; name?: string }>;
      }
    }
    return [];
  };

  const handleCarouselNext = (rowId: string, totalImages: number) => {
    setCarouselIndices((prev) => {
      const currentIndex = prev[rowId] || 0;
      return {
        ...prev,
        [rowId]: (currentIndex + 1) % totalImages,
      };
    });
  };

  const handleCarouselPrev = (rowId: string, totalImages: number) => {
    setCarouselIndices((prev) => {
      const currentIndex = prev[rowId] || 0;
      return {
        ...prev,
        [rowId]: currentIndex === 0 ? totalImages - 1 : currentIndex - 1,
      };
    });
  };

  const renderCellContent = (row: T, column: IColumn<T>): React.ReactNode => {
    const value = resolveNestedValue(row, String(column.key));

    if (Array.isArray(value) && value.length > 0 && value[0]?.url) {
      return <img src={value[0].url} alt={value[0].name} width={100} />;
    }

    if (column.formatValue) {
      return column.formatValue(value, row);
    }
    if (value === null || typeof value === "undefined") {
      return "";
    }
    return String(value);
  };

  const renderDropdownActions = (row: T) => {
    return (
      <Dropdown
        arrowIcon={false}
        inline
        placement="right-start"
        label={
          <Button
            size="xs"
            color="gray"
            className="p-1.5"
            id={`row-${row._id}-actions-menu`}
            data-testid={`row-${row._id}-actions-menu`}
          >
            <HiDotsVertical className="h-4 w-4" />
          </Button>
        }
      >
        {(getActions ? getActions(row) : actions).map((action, index) => (
          <Dropdown.Item
            key={action.label}
            id={`row-${row._id}-action-${index}`}
            onClick={() => action.handler(row)}
            className={
              action.color === "danger"
                ? "text-red-600 dark:text-red-400"
                : action.color === "warning"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "dark:text-white"
            }
          >
            {action.label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4" id={id} data-testid={testId}>
        <h2 className="text-xl font-bold dark:text-white">{title}</h2>
        <div className="flex gap-2">
          {headerActions.map((action, index) => (
            <KuButton
              key={action.label}
              id={`header-action-${index}`}
              type="button"
              actionType="apiRequest"
              variant={action.color || "primary"}
              size="sm"
              onClick={action.handler}
              label={action.label}
            />
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center p-4">
          <KuSpinner />
        </div>
      )}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto relative">
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t("common.search")}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-gray-100 focus:border-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-100 dark:focus:border-gray-100"
                />
              </div>
              <Button
                onClick={handleSearch}
                color="gray"
                className="px-4"
              >
                {t("common.search")}
              </Button>
            </div>
          </div>
          {
            isMobile ? (
              <div>
                {data.map((row) => {
                  const images = getImagesFromRow(row);
                  const currentImageIndex = carouselIndices[row._id] || 0;
                  const hasMultipleImages = images.length > 1;

                  return (
                    <div className="w-full" key={row._id}>
                      <KuCard id={`row-${row._id}`} testId={`row-${row._id}`}>
                        {images.length > 0 &&
                          <div className="relative flex justify-center items-center h-[120px] w-full max-w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={images[currentImageIndex]?.url}
                              alt={images[currentImageIndex]?.name || "Image"}
                              className="max-h-full max-w-full object-contain"
                            />
                            {hasMultipleImages && (
                              <>
                                <button
                                  onClick={() => handleCarouselPrev(row._id, images.length)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10"
                                  aria-label="Imagem anterior"
                                >
                                  <HiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleCarouselNext(row._id, images.length)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10"
                                  aria-label="Próxima imagem"
                                >
                                  <HiChevronRight className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                  {images.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCarouselIndices((prev) => ({ ...prev, [row._id]: index }))}
                                      className={`h-2 rounded-full transition-all ${index === currentImageIndex
                                          ? "w-6 bg-white"
                                          : "w-2 bg-white/50 hover:bg-white/75"
                                        }`}
                                      aria-label={`Ir para imagem ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        }
                        <div className="mb-4 flex items-baseline justify-between">
                          <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {columns
                              .filter((col) => col.type === 'title')
                              .map((col) => `${renderCellContent(row, col)}`)
                              .join(' | ')
                            }
                          </div>
                          {renderDropdownActions(row)}
                        </div>
                        <div className="font-normal text-gray-500 dark:text-gray-400">
                          {columns
                            .filter((col) => col.type === 'subtitle')
                            .map((col) => (
                              `${col.header}: ${renderCellContent(row, col)}`
                            ))
                            .join(' | ')
                          }
                        </div>
                        <div className="text-xs dark:white">
                          {columns
                            .filter((col) => col.type === 'description')
                            .map((col) => (
                              <div>{col.header}: {renderCellContent(row, col)}</div>
                            ))
                          }
                        </div>
                      </KuCard>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Table className="!static !relative">
                <Table.Body className="divide-y">
                  {data.map((row) => (
                    <Table.Row key={row._id}>
                      {columns.map((col) => (
                        <Table.Cell key={`${row._id}-${String(col.key)}`}>
                          {renderCellContent(row, col)}
                        </Table.Cell>
                      ))}
                      {(actions.length > 0 || getActions) && (
                        <Table.Cell>
                          {renderDropdownActions(row)}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )
          }
          {totalPages > 1 && (
            <div className="mt-4">
              <KuPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
