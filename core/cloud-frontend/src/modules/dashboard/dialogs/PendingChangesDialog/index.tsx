import { AlertCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { HistoryEntry } from "@/modules/dashboard/providers/ChangeHistoryProvider";

interface PendingChangesDialogProps {
  history: HistoryEntry[];
  onReload: () => void;
  isReloading: boolean;
  dialogKey?: Dialogs;
}

export const PendingChangesDialog = ({
  history,
  onReload,
  isReloading,
  dialogKey = Dialogs.openPendingChangesDialog,
}: PendingChangesDialogProps) => {
  const { dialogs, updateDialog } = useStore();
  const isOpen = dialogs[dialogKey];

  const handleClose = () => {
    updateDialog({
      dialog: dialogKey,
      status: false,
    });
  };

  const handleReload = () => {
    handleClose();
    onReload();
  };

  const changesCount = history.length > 0 ? `(${history.length})` : "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Pending Changes {changesCount}</DialogTitle>
          <DialogDescription>
            Review changes made since loading this page
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full rounded-lg border border-border bg-background p-4 my-4">
          <div className="flex gap-3">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              If the page isn’t reflecting your most recent changes. Click
              reload to refresh the page to capture those changes now.
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="border border-neutral-700 rounded-lg p-4 bg-neutral-900/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-semibold text-sm">
                        {entry.title}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-300">
                      {entry.description}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 whitespace-nowrap">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isReloading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReload}
            disabled={isReloading}
            className="gap-2"
          >
            {isReloading && <RefreshCw className="h-4 w-4 animate-spin" />}
            Reload Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
