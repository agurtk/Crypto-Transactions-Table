import { ExportDropdown } from "./ExportDropdown";
import type { ExportScope } from "./types";

type TransactionsHeaderProps = {
  onExport: (scope: ExportScope) => void;
};

export function TransactionsHeader({ onExport }: TransactionsHeaderProps) {
  return (
    <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Crypto Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Browse, sort, paginate, and export transactions from the SQLite database.
          </p>
        </div>

        <ExportDropdown onExport={onExport} />
      </div>
    </section>
  );
}