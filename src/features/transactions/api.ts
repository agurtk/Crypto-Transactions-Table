import type {
  ExportScope,
  SortDir,
  TransactionsResponse,
  FetchTransactionsParams,
} from "./types";

export async function fetchTransactions({
  page,
  pageSize,
  sortBy,
  sortDir,
  search,
}: FetchTransactionsParams): Promise<TransactionsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    sortDir,
  });
  if (search) params.set("search", search);

  const response = await fetch(`/api/transactions?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

type ExportUrlParams = {
  scope: ExportScope;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: SortDir;
};

export function getExportUrl({
  scope,
  page,
  pageSize,
  sortBy,
  sortDir,
}: ExportUrlParams) {
  const params = new URLSearchParams({
    scope,
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    sortDir,
  });

  return `/api/transactions/export?${params.toString()}`;
}
