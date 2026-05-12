import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Transaction } from "./types";
import { formatAmount, formatDate, formatHash } from "./utils";

type TransactionsMobileListProps = {
  transactions: Transaction[];
};

export function TransactionsMobileList({
  transactions,
}: TransactionsMobileListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}

type TransactionCardProps = {
  transaction: Transaction;
};

function TransactionCard({ transaction }: TransactionCardProps) {
  const details: MobileRowProps[] = [
    {
      label: "Buy",
      value: formatAmount(
        transaction.buyAmount,
        transaction.buyCurrency,
        transaction.buyToken,
      ),
    },
    {
      label: "Sell",
      value: formatAmount(
        transaction.sellAmount,
        transaction.sellCurrency,
        transaction.sellToken,
      ),
    },
    {
      label: "Fee",
      value: formatAmount(
        transaction.feeAmount,
        transaction.feeCurrency,
        transaction.feeToken,
      ),
    },
    {
      label: "Network",
      value: transaction.network ?? "-",
    },
    {
      label: "Tx Hash",
      value: formatHash(transaction.txHash),
      title: transaction.txHash ?? "",
      monospace: true,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Method</p>

            <CardTitle
              className="truncate text-base"
              title={transaction.method}
            >
              {transaction.method}
            </CardTitle>

            <CardDescription className="mt-1">
              <time dateTime={new Date(transaction.date).toISOString()}>
                {formatDate(transaction.date)}
              </time>{" "}
            </CardDescription>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">ID</p>
            <p className="font-mono text-sm font-medium">#{transaction.id}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="divide-y">
          {details.map((item) => (
            <MobileRow key={item.label} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
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
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center text-foreground gap-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>

      <div
        className={cn(
          "min-w-0 truncate text-right text-sm",
          monospace && "font-mono text-xs",
        )}
        title={title ?? value}
      >
        {value}
      </div>
    </div>
  );
}
