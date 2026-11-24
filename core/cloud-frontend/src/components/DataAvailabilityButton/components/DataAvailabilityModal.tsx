import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Icon } from "@components/Icon/Icon";
import { Loader } from "@components/Loader";
import type { DataFreshnessResponse } from "@/api/types";
import { DataAvailabilityTable } from "./DataAvailabilityTable";
import { formatDate } from "../utils";
import { useCallback } from "react";

interface DataAvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: DataFreshnessResponse;
  isLoading: boolean;
  error?: Error | null;
}

export const DataAvailabilityModal = ({
  open,
  onOpenChange,
  data,
  isLoading,
  error,
}: DataAvailabilityModalProps) => {
  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader message="Loading data availability..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-8 text-red-500">
          <p>Error loading data availability: {error.message}</p>
        </div>
      );
    }

    if (!data || typeof data !== "object") {
      return (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <p>No data availability information found</p>
        </div>
      );
    }

    const items = data.items || [];
    const lastUpdated = data.last_updated;

    if (!Array.isArray(items) || items.length === 0) {
      return (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <p>No data sources found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {lastUpdated && (
          <div className="text-sm text-muted-foreground border-b pb-2">
            <strong>Last Report Generated:</strong> {formatDate(lastUpdated)}
          </div>
        )}

        <DataAvailabilityTable data={items} isLoading={false} />

        {data.notes && (
          <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
            <strong>Notes:</strong>
            <p className="mt-2">{data.notes}</p>
          </div>
        )}
      </div>
    );
  }, [isLoading, error, data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Info" size="lg" />
            Data Availability
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};
