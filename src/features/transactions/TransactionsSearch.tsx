import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TransactionsSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TransactionsSearch({
  value,
  onChange,
}: TransactionsSearchProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search transactions..."
        className="pl-9"
      />
    </div>
  );
}
