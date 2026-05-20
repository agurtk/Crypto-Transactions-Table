import { transactions } from "../database/schema";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, sortableColumns } from "./constants";

export function toPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function getPaginationParams(url: URL) {
  const page = toPositiveInteger(url.searchParams.get("page"), 1);

  const pageSize = Math.min(
    toPositiveInteger(url.searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function getSortParams(url: URL) {
  const sortBy = url.searchParams.get("sortBy") ?? "date";

  const sortDir: "asc" | "desc" =
    url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";

  const sortColumn =
    sortableColumns[sortBy as keyof typeof sortableColumns] ??
    transactions.date;

  return {
    sortDir,
    sortColumn,
  };
}

export function getExportScope(url: URL) {
  return url.searchParams.get("scope") === "all" ? "all" : "current";
}

export function getSearchParams(url: URL) {
  return url.searchParams.get("search")?.trim() ?? "";
}
