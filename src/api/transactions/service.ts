import { asc, count, desc } from "drizzle-orm";
import { db } from "../database";
import { transactions } from "../database/schema";
import { getTransactionsWhere } from "./filters";
import type { SortColumn } from "@/features/transactions/types";

type GetTransactionsInput = {
  page: number;
  pageSize: number;
  offset: number;
  sortDir: "asc" | "desc";
  sortColumn: SortColumn;
  search: string;
};

export async function getTransactions({
  page,
  pageSize,
  offset,
  sortDir,
  sortColumn,
  search,
}: GetTransactionsInput) {
  const whereClause = getTransactionsWhere(search);

  const data = await db
    .select()
    .from(transactions)
    .where(whereClause)
    .orderBy(sortDir === "asc" ? asc(sortColumn) : desc(sortColumn))
    .limit(pageSize)
    .offset(offset);

  const countResult = await db
    .select({ total: count() })
    .from(transactions)
    .where(whereClause);

  const total = countResult[0]?.total ?? 0;

  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

type GetTransactionsForExportInput = {
  scope: "current" | "all";
  pageSize: number;
  offset: number;
  sortDir: "asc" | "desc";
  sortColumn: SortColumn;
  search: string;
};

export async function getTransactionsForExport({
  scope,
  pageSize,
  offset,
  sortDir,
  sortColumn,
  search,
}: GetTransactionsForExportInput) {
  const whereClause = getTransactionsWhere(search);

  const query = db
    .select()
    .from(transactions)
    .where(whereClause)
    .orderBy(sortDir === "asc" ? asc(sortColumn) : desc(sortColumn));

  if (scope === "current") {
    return query.limit(pageSize).offset(offset);
  }

  return query;
}
