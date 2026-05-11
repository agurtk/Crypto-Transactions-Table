import type { Transaction } from "./types";
import { formatAmount, formatDate, formatHash } from "./utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TransactionsMobileListProps = {
  transactions: Transaction[];
};

export function TransactionsMobileList({
  transactions,
}: TransactionsMobileListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {transactions.map((tx) => {
        const buyValue = formatAmount(tx.buyAmount, tx.buyCurrency, tx.buyToken);
        const sellValue = formatAmount(tx.sellAmount, tx.sellCurrency, tx.sellToken);
        const feeValue = formatAmount(tx.feeAmount, tx.feeCurrency, tx.feeToken);

        return (
          <Card key={tx.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-slate-500">Method</p>
                  <h3 className="font-semibold text-slate-900">{tx.method}</h3>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">ID</p>
                  <p className="font-mono text-sm text-slate-700">#{tx.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-slate-600">
                {formatDate(tx.date)}
              </div>

              <div className="space-y-2">
                <MobileRow label="Buy" value={buyValue} />
                <MobileRow label="Sell" value={sellValue} />
                <MobileRow label="Fee" value={feeValue} />
                <MobileRow label="Network" value={tx.network ?? "-"} />
                <MobileRow
                  label="Tx Hash"
                  value={formatHash(tx.txHash)}
                  title={tx.txHash ?? ""}
                  monospace
                />
              </div>
            </CardContent>
          </Card>);
      })}
    </div>
  );
}

type MobileRowProps = {
  label: string;
  value: string;
  title?: string;
  monospace?: boolean;
};

function MobileRow({ label, value, title, monospace }: MobileRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t pt-2">
      <span className="text-slate-500">{label}</span>

      <span
        className={`truncate text-right text-slate-900 ${monospace ? "font-mono text-xs" : ""
          }`}
        title={title ?? value}
      >
        {value}
      </span>
    </div>
  );
}