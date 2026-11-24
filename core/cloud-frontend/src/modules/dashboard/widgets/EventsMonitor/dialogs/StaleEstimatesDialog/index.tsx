import { useMemo } from "react";
import { Dialog } from "@/components/ui";
import { useStore } from "@store/index";
import { Dialogs } from "@store/slices/dialogsSlice";
import { useStaleEstimates } from "./hooks/useStaleEstimates";
import { StaleEstimatesDialogContent } from "./StaleEstimatesDialogContent";

export const StaleEstimatesDialog = () => {
  const { dialogs } = useStore();
  const open = dialogs[Dialogs.openStaleEstimatesDialog];
  const { data: response, isLoading } = useStaleEstimates();

  const staleEstimates = useMemo(
    () => response?.items || [],
    [response?.items]
  );

  if (!staleEstimates.length) return null;

  return (
    <Dialog open={open}>
      <StaleEstimatesDialogContent
        staleEstimates={staleEstimates}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
