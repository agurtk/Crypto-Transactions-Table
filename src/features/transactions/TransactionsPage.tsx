import { useEffect, useRef, useState } from "react";

import { fetchTransactions, getExportUrl } from "./api";
import { EmptyState } from "./EmptyState";
import { PageSizeSelect } from "./PageSizeSelect";
import { PaginationControls } from "./PaginationControls";
import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionsMobileList } from "./TransactionsMobileList";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionsTableSkeleton } from "./TransactionsTableSkeleton";

import type { ExportScope, PageSize, SortDir, Transaction } from "./types";
export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [error, setError] = useState<string | null>(null);
  const tableSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);

      const loadingTimeout = window.setTimeout(() => {
        setShowLoading(true);
      }, 200);

      setError(null);
      try {
        const result = await fetchTransactions({
          page,
          pageSize,
          sortBy,
          sortDir,
        });

        setTransactions(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error(err);

        setError("Failed to load transactions.");
      } finally {
        window.clearTimeout(loadingTimeout);

        setLoading(false);
        setShowLoading(false);
      }
    }

    loadTransactions();
  }, [page, pageSize, sortBy, sortDir]);

  function handlePageSizeChange(nextPageSize: PageSize) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }

    setPage(1);
  }

  function handleExport(scope: ExportScope) {
    window.location.href = getExportUrl({
      scope,
      page,
      pageSize,
      sortBy,
      sortDir,
    });
  }

  function scrollToTable() {
    tableSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <TransactionsHeader onExport={handleExport} />
        <section
          ref={tableSectionRef}
          className="rounded-2xl border bg-white p-4 shadow-sm"
        >
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : showLoading ? (
            <TransactionsTableSkeleton />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="Try changing filters or page size."
            />
          ) : (
            <>
              <div className="mb-4">
                <PageSizeSelect
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
              <div className="hidden md:block">
                <TransactionsTable
                  transactions={transactions}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </div>
              <TransactionsMobileList transactions={transactions} />
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPrevious={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                  scrollToTable();
                }}
                onNext={() => {
                  setPage((prev) => Math.min(prev + 1, totalPages));
                  scrollToTable();
                }}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default TransactionsPage;
