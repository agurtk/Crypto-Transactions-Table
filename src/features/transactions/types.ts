import type { transactions } from "../../api/database/schema";
export type Transaction = typeof transactions.$inferSelect;

export type SortDir = "asc" | "desc";

export type ExportScope = "current" | "all";

export type PageSize = 10 | 25 | 50

export type FetchTransactionsParams = {
  page: number;
  pageSize: PageSize;
  sortBy: string;
  sortDir: SortDir;
  // search: string;
};

export type TransactionsResponse = {
  data: Transaction[];
  page: number;
  pageSize: PageSize;
  total: number;
  totalPages: number;
};