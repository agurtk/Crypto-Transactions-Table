import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationControls({
  page,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <Button
        variant={"outline"}
        onClick={onPrevious}
        disabled={page === 1}
        className="w-28 justify-center gap-2 cursor-pointer"
        size={"lg"}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <Button
        variant={"outline"}
        onClick={onNext}
        disabled={page === totalPages}
        className="w-28 justify-center gap-2 cursor-pointer"
        size={"lg"}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}