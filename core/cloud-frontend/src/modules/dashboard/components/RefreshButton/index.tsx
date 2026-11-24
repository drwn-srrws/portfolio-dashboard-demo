import { RefreshCw } from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { cn } from "@/utils/utils";

interface RefreshButtonProps {
  changeCount: number;
  onClick: () => void;
  isRefreshing?: boolean;
}

export const RefreshButton = ({
  changeCount,
  onClick,
  isRefreshing = false,
}: RefreshButtonProps) => {
  return (
    <div className="relative inline-block">
      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
        disabled={isRefreshing}
        className="gap-2"
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        Refresh Data
      </Button>
      {changeCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs font-semibold rounded-full aspect-square leading-none"
          style={{ lineHeight: "1" }}
        >
          {changeCount}
        </Badge>
      )}
    </div>
  );
};
