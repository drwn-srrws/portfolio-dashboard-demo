import { useMemo } from "react";
import { Close } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/Icon/Icon";
import { numToDollar } from "@/utils";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useReadCompanyPrice } from "@/api/endpoints/market-data/market-data";
import { EstimateModalForm } from "../../components/estimates/forms/EstimateModalForm";
import { EstimateModalPrefilledData } from "../../types/EstimateModalTypes";

export const EstimateDialog = () => {
  const { dialogs, updateDialog, prefilled } = useStore();
  const { account } = useAuth();
  const isOpen = dialogs[Dialogs.createEstimateDialog];

  const prefilledData = useMemo(() => {
    if (typeof prefilled === "object" && prefilled !== null) {
      return prefilled as EstimateModalPrefilledData;
    }

    return null;
  }, [prefilled]);
  const eventId = prefilledData?.eventId;
  const companyId = prefilledData?.companyId || 0;

  const { data: fetchedMarketData, isLoading: isLoadingFetchedMarketData } =
    useReadCompanyPrice(companyId, {
      query: {
        refetchInterval: 60 * 10 * 1000,
        enabled: isOpen && !!companyId,
      },
    });

  const currentPrice = useMemo(() => {
    return fetchedMarketData;
  }, [fetchedMarketData]);

  const isLoadingMarketData = isLoadingFetchedMarketData;

  const currentUserEstimate = useMemo(() => {
    const estimates = prefilledData?.estimates || [];
    return estimates.find((estimate) => estimate.created_by.id === account?.id);
  }, [prefilledData?.estimates, account?.id]);

  const isPrimaryAnalyst = useMemo(
    () => prefilledData?.primaryAnalyst?.id === account?.id,
    [prefilledData?.primaryAnalyst?.id, account?.id]
  );

  const companyName = prefilledData?.companyName ?? "Unknown Company";
  const isEditMode = !!currentUserEstimate;

  const handleClose = () => {
    updateDialog({
      dialog: Dialogs.createEstimateDialog,
      status: false,
    });
  };

  if (!isOpen || !eventId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        isClose={false}
        className="flex flex-col gap-0 border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 w-full max-w-[calc(100vw-2rem)] sm:w-[400px] sm:max-w-[90%] max-h-[90vh]"
      >
        <div className="border-b border-neutral-700">
          <div className="p-4">
            <DialogHeader>
              <div className="flex items-center justify-between pb-3">
                <DialogTitle className="text-xl font-semibold text-white break-words">
                  {isEditMode || currentUserEstimate
                    ? "Edit Estimate"
                    : "Create Estimate"}{" "}
                  - {companyName}
                </DialogTitle>
                <Close className="w-fit" onClick={handleClose}>
                  <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-700 transition-colors hover:bg-neutral-800">
                    <Icon name="X" color="currentColor" size="lg" />
                  </div>
                </Close>
              </div>
            </DialogHeader>

            <div className="bg-neutral-800 p-4 rounded-lg mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">
                Current Price
              </h4>
              <div className="text-lg text-white">
                {currentPrice ? numToDollar(currentPrice.price) : "N/A"}
              </div>
              {currentPrice && (
                <div className="text-xs text-neutral-400 mt-1">
                  Last updated:{" "}
                  {new Date(currentPrice.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          {isLoadingMarketData ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <EstimateModalForm
              eventId={eventId}
              onClose={handleClose}
              marketData={currentPrice}
              currentUserEstimate={currentUserEstimate}
              isPrimaryAnalyst={isPrimaryAnalyst}
              companyName={companyName}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
