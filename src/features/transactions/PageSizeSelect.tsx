import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PageSize } from "./types";
type PageSizeSelectProps = {
  pageSize: number;
  onPageSizeChange: (pageSize: PageSize) => void;
};

export function PageSizeSelect({
  pageSize,
  onPageSizeChange,
}: PageSizeSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Rows:</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => onPageSizeChange(Number(value) as PageSize)}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={"10"}>10</SelectItem>
          <SelectItem value={"25"}>25</SelectItem>
          <SelectItem value={"50"}>50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}