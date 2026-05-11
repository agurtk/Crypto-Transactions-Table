import type { Transaction } from "../../features/transactions/types";

import { fetchTransactions, getExportUrl } from "../../features/transactions/api";

import { useEffect, useState } from "react";

import { TransactionsTable } from "../../features/transactions/TransactionsTable";
import { PaginationControls } from "../../features/transactions/PaginationControls";
import { PageSizeSelect } from "./PageSizeSelect";
import { TransactionsHeader } from "./TransactionsHeader";
import { EmptyState } from "./EmptyState";
import { TransactionsTableSkeleton } from "./TransactionsTableSkeleton";

import type { PageSize } from "../../features/transactions/types";
import { TransactionsMobileList } from "./TransactionsMobileList";
export function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [sortBy, setSortBy] = useState("date");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [pageSize, setPageSize] = useState<PageSize>(10);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTransactions() {
            setLoading(true);
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
                setLoading(false);
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

    function handleExport(scope: "current" | "all") {
        window.location.href = getExportUrl({
            scope,
            page,
            pageSize,
            sortBy,
            sortDir,
        });

    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <TransactionsHeader onExport={handleExport} />
                <section className="rounded-2xl border bg-white p-4 shadow-sm">
                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600" >
                            {error}
                        </div>
                    ) : loading ? (
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
                                onPrevious={() => setPage((prev) => prev - 1)}
                                onNext={() => setPage((prev) => prev + 1)}
                            />
                        </>
                    )}
                </section>
            </div >
        </main >
    );
}

export default TransactionsPage;
