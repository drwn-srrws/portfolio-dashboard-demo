import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useChangeHistory } from "@/modules/dashboard/providers/ChangeHistoryProvider";

interface QueryWithRefetch {
  refetch: () => Promise<unknown>;
  isRefetching: boolean;
}

interface UseReloadCacheOptions {
  eventsMonitorQuery: QueryWithRefetch;
  onClose?: () => void;
}

export const useReloadCache = ({
  eventsMonitorQuery,
  onClose,
}: UseReloadCacheOptions) => {
  const { history, clearHistory } = useChangeHistory();
  const historyLengthOnReloadRef = useRef(0);

  const [isReloading, setIsReloading] = useState(false);

  const handleReload = useCallback(async () => {
    setIsReloading(true);
    historyLengthOnReloadRef.current = history.length;

    try {
      await Promise.all([eventsMonitorQuery.refetch()]);
      onClose?.();
      toast({ title: "Data reloaded successfully" });
    } catch (error) {
      if (error instanceof Error && error.name === "CancelledError") {
        return;
      }
      toast({ title: "Failed to reload data", variant: "destructive" });
    } finally {
      if (history.length === historyLengthOnReloadRef.current) {
        clearHistory();
        setIsReloading(false);
      }
    }
  }, [eventsMonitorQuery, clearHistory, onClose, history.length]);

  useEffect(() => {
    if (
      eventsMonitorQuery.isRefetching &&
      history.length > historyLengthOnReloadRef.current
    ) {
      handleReload();
    }
  }, [history.length, eventsMonitorQuery.isRefetching, handleReload]);

  useEffect(() => {
    if (history.length > 0 && !eventsMonitorQuery.isRefetching) {
      const timer = setTimeout(handleReload, 10000);
      return () => clearTimeout(timer);
    }
  }, [history.length, handleReload, eventsMonitorQuery.isRefetching]);

  return {
    isRefetching: isReloading,
    handleReload,
  };
};
