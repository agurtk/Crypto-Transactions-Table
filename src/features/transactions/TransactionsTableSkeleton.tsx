import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TransactionsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={8} className="p-4">
            <Skeleton className="h-6 flex w-full rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function MobileSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
