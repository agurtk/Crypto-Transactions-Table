import type { ExportScope } from "./types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type ExportDropdownProps = {
  onExport: (scope: ExportScope) => void;
};

export function ExportDropdown({ onExport }: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-36 justify-between">
          Export
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => onExport("current")}>
          Export current page
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onExport("all")}>
          Export all data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}