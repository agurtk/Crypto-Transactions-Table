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
