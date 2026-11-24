import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Icon } from "../Icon/Icon";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isAdmin } from "@/utils/roleUtils";

export interface WidgetRefetchButtonProps {
  onRefetch: () => Promise<unknown>;
  id?: string;
  ariaLabel?: string;
  className?: string;
  isRefreshing?: boolean;
  showInlineLoader?: boolean;
}

const WidgetRefetchButton = ({
  onRefetch,
  id,
  ariaLabel = "Refetch",
  className,
  isRefreshing,
}: WidgetRefetchButtonProps) => {
  const { account } = useAuth();

  const handleClick = useCallback(async () => {
    if (isRefreshing) return;
    await onRefetch();
  }, [isRefreshing, onRefetch]);

  if (!isAdmin(account?.roles)) return null;

  return (
    <div className="flex items-center gap-2">
      {!isRefreshing ? (
        <Button
          id={id}
          size="sm"
          variant="outline"
          onClick={handleClick}
          aria-label={ariaLabel}
          className={className}
        >
          <RefreshCw className="size-4" />
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Invalidating cache…</span>
          <Icon name="Loader" size="md" className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default WidgetRefetchButton;
