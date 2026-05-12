import type { Transaction, SortDir } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount, formatDate, formatHash } from "./utils";

type TransactionsTableProps = {
  transactions: Transaction[];
  sortBy: string;
  sortDir: SortDir;
  onSort: (column: string) => void;
};

export function TransactionsTable({
  transactions,
  sortBy,
  sortDir,
  onSort,
}: TransactionsTableProps) {
  function SortIcon({ column }: { column: string }) {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-slate-400" />;
    }

    return sortDir === "asc" ? (
      <ArrowUp className="h-4 w-4 text-[#613bbb]" />
    ) : (
      <ArrowDown className="h-4 w-4 text-[#613bbb]" />
    );
  }
  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white">
      <Table className="table-fixed">
        <TableHeader className="sticky top-0 bg-slate-100">
          <TableRow>
            <TableHead className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("id")}
                className="h-8 px-2 font-semibold cursor-pointer"
              >
                Id
                <SortIcon column="id" />
              </Button>
            </TableHead>

            <TableHead className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("method")}
                className="h-8 px-2 font-semibold cursor-pointer"
              >
                Method
                <SortIcon column="method" />
              </Button>
            </TableHead>

            <TableHead className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort("date")}
                className="h-8 px-2 font-semibold cursor-pointer"
              >
                Date
                <SortIcon column="date" />
              </Button>
            </TableHead>

            <TableHead className="p-3 text-center">Buy</TableHead>
            <TableHead className="p-3 text-center">Sell</TableHead>
            <TableHead className="p-3 text-center">Fee</TableHead>
            <TableHead className="p-3 text-center">Network</TableHead>
            <TableHead className="p-3 text-center">Tx Hash</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((tx) => {
            const buyValue = formatAmount(
              tx.buyAmount,
              tx.buyCurrency,
              tx.buyToken,
            );

            const sellValue = formatAmount(
              tx.sellAmount,
              tx.sellCurrency,
              tx.sellToken,
            );

            const feeValue = formatAmount(
              tx.feeAmount,
              tx.feeCurrency,
              tx.feeToken,
            );

            return (
              <TableRow
                key={tx.id}
                className="border-t transition-colors hover:bg-slate-200"
              >
                <TableCell className="p-3 text-center truncate">
                  {tx.id}
                </TableCell>

                <TableCell className="p-3 text-center truncate">
                  {tx.method}
                </TableCell>

                <TableCell className="p-3 text-center truncate">
                  {formatDate(tx.date)}
                </TableCell>

                <TableCell
                  title={buyValue}
                  className="p-3 text-center tabular-nums truncate"
                >
                  {buyValue}
                </TableCell>

                <TableCell
                  title={sellValue}
                  className="p-3 text-center tabular-nums truncate"
                >
                  {sellValue}
                </TableCell>

                <TableCell
                  title={feeValue}
                  className="p-3 text-center tabular-nums truncate"
                >
                  {feeValue}
                </TableCell>

                <TableCell className="p-3 text-center truncate">
                  {tx.network ?? "-"}
                </TableCell>

                <TableCell
                  className="p-3 font-mono text-xs text-center truncate"
                  title={tx.txHash ?? ""}
                >
                  {formatHash(tx.txHash)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
