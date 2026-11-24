import { useCallback, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface QueryWithRefetch {
  refetch: () => Promise<unknown>;
}

interface UseReloadCacheOptions {
  coverageUniverseQuery: QueryWithRefetch;
  clearHistory: () => void;
  onClose?: () => void;
}

export const useReloadCache = ({
  coverageUniverseQuery,
  clearHistory,
  onClose,
}: UseReloadCacheOptions) => {
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = useCallback(async () => {
    setIsReloading(true);

    try {
      const refetchPromises = [];

      refetchPromises.push(coverageUniverseQuery.refetch());

      await Promise.all(refetchPromises);

      clearHistory();
      onClose?.();
      toast({ title: "Data reloaded successfully" });
    } catch {
      toast({ title: "Failed to reload data", variant: "destructive" });
    } finally {
      setIsReloading(false);
    }
  }, [coverageUniverseQuery, clearHistory, onClose]);

  return {
    isReloading,
    handleReload,
  };
};
