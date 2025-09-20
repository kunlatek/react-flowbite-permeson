import { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Card } from "flowbite-react";
import KuPagination from "@/components/navigation/KuPagination";
import KuButton, { type ButtonVariant } from "@/components/form/KuButton";
import axios from "axios";

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

interface KuDataTableProps<T> {
  title: string;
  columns: IColumn<T>[];
  dataSource: (
    params: URLSearchParams
  ) => Promise<{ data: T[]; total: number }>;
  actions?: IAction<T>[];
  headerActions?: IHeaderAction[];
  pageSize?: number;
}

export default function KuDataTable<T extends { _id: string }>({
  title,
  columns,
  dataSource,
  actions = [],
  headerActions = [],
  pageSize = 10,
}: KuDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(
    "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
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
  }, [currentPage, pageSize, sortColumn, sortDirection, dataSource]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (columnKey: keyof T | string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const resolveNestedValue = (obj: T, path: string): unknown => {
    return path.split(".").reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === "object" && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  const renderCellContent = (row: T, column: IColumn<T>): React.ReactNode => {
    const value = resolveNestedValue(row, String(column.key));
    if (column.formatValue) {
      return column.formatValue(value, row);
    }
    if (value === null || typeof value === "undefined") {
      return "";
    }
    return String(value);
  };

  return (
    <Card className="!static !relative z-0">
      <div className="flex justify-between items-center mb-4">
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
          <Spinner />
        </div>
      )}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto relative">
          <Table className="!static !relative">
            <Table.Head>
              {columns.map((col) => (
                <Table.HeadCell
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={col.sortable ? "cursor-pointer" : ""}
                >
                  {col.header}
                  {sortColumn === col.key && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </Table.HeadCell>
              ))}
              {actions.length > 0 && <Table.HeadCell>Ações</Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {data.map((row) => (
                <Table.Row key={row._id}>
                  {columns.map((col) => (
                    <Table.Cell key={`${row._id}-${String(col.key)}`}>
                      {renderCellContent(row, col)}
                    </Table.Cell>
                  ))}
                  {actions.length > 0 && (
                    <Table.Cell className="flex gap-2">
                      {actions.map((action, index) => (
                        <KuButton
                          key={action.label}
                          id={`row-${row._id}-action-${index}`}
                          type="button"
                          actionType="apiRequest"
                          size="xs"
                          variant={action.color}
                          onClick={() => action.handler(row)}
                          label={action.label}
                        />
                      ))}
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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
    </Card>
  );
}
