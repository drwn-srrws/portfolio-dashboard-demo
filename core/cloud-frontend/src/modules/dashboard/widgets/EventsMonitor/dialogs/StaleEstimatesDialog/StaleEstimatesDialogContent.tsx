import { useState, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { DataGrid } from "@components/Datagrid/index";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  Button,
} from "@/components/ui";
import { useStore } from "@store/index";
import { Dialogs } from "@store/slices/dialogsSlice";
import { useSaveStaleEstimates } from "./hooks/useSaveStaleEstimates";
import {
  createStaleEstimatesColumnDefs,
  defaultColDef,
} from "./constants/columnDefs";
import { StaleEstimate } from "./types/StaleEstimatesData";

const getRowId = (data: StaleEstimate) => String(data.id);

export const StaleEstimatesDialogContent = ({
  staleEstimates,
  isLoading,
}: {
  staleEstimates: StaleEstimate[];
  isLoading: boolean;
}) => {
  const { updateDialog } = useStore();
  const { saveEstimates, isSaving } = useSaveStaleEstimates();
  const [localEstimates, setLocalEstimates] =
    useState<StaleEstimate[]>(staleEstimates);

  const handleClose = useCallback(() => {
    updateDialog({
      dialog: Dialogs.openStaleEstimatesDialog,
      status: false,
    });
  }, [updateDialog]);

  const updateEstimate = useCallback(
    (id: string, updates: Partial<StaleEstimate>) => {
      setLocalEstimates((prev) =>
        prev.map((estimate) => {
          return estimate.id === id ? { ...estimate, ...updates } : estimate;
        })
      );
    },
    []
  );

  const handleReaffirmChange = useCallback(
    (id: string, reaffirm: boolean) => {
      updateEstimate(id, { reaffirm });
    },
    [updateEstimate]
  );

  const handleSave = () => {
    saveEstimates(localEstimates, staleEstimates, handleClose);
  };

  const handleRemindLater = () => {
    handleClose();
  };

  const columnDefs = useMemo(
    () => createStaleEstimatesColumnDefs(handleReaffirmChange),
    [handleReaffirmChange]
  );

  return (
    <DialogContent
      isClose={false}
      className="flex flex-col h-full gap-0 border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 max-w-[calc(100%-1*1.5rem)] sm:max-w-[90%] w-full"
    >
      <div className="border-b border-neutral-700">
        <div className="p-4">
          <DialogHeader>
            <div className="flex items-center justify-between pb-3">
              <DialogTitle className="w-fit text-xl font-semibold text-white">
                Update Event Estimates
              </DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Some of your event estimates haven't been updated in over two weeks.
            Use the table below to update your estimates. If you want to keep
            the estimate the same, click Save below to reaffirm your estimate as
            of today.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ minHeight: "400px" }}
          >
            <Loader2 className="animate-spin" size="48" color="white" />
          </div>
        ) : localEstimates.length === 0 ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ minHeight: "400px" }}
          >
            <p className="text-neutral-400 text-lg">No stale estimates found</p>
          </div>
        ) : (
          <DataGrid
            rowData={localEstimates}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            loading={isLoading}
            pending={false}
            suppressCellFocus={true}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 px-4 py-4 border-t border-neutral-700">
        <Button
          variant="ghost"
          onClick={handleRemindLater}
          className="text-neutral-300 hover:text-white hover:bg-neutral-700"
        >
          Remind me next time
        </Button>
        <Button
          onClick={handleSave}
          variant="default"
          disabled={isLoading || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </DialogContent>
  );
};
