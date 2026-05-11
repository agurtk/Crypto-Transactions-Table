import { Skeleton } from "@/components/ui/skeleton";

export function TransactionsTableSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />

            {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="h-12 w-full rounded-lg"
                />
            ))}
        </div>
    );
}