import { Icon } from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { ExtendedEventResponse } from "../../components/EventsMonitorGrid/EventsMonitorDetailGrid";
import { PrefilledEventData } from "../EventCell";
import { useMemo } from "react";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";

export const CreateEventCell = (
  props: CustomCellRendererProps<ExtendedEventResponse>
) => {
  const { updateDialog } = useStore();
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);

  const prefilled: PrefilledEventData = useMemo(() => {
    return {
      id: null,
      companyName: props.data?.name || "",
      companyId: props.data?.id || null,
      name: null,
      eventType: null,
      eventClassification: null,
      eventImpact: null,
      dateShape: "date",
      date: new Date(),
      rangeWeeks: 0,
      description: "",
      workstreamDescription: "",
      hasPassed: false,
    };
  }, [props.data]);

  if (readOnly) return null;

  return (
    <div className="flex items-center justify-start size-full gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          updateDialog({
            dialog: Dialogs.openEventDetailDialog,
            status: true,
            prefilled: prefilled,
          })
        }
      >
        <Icon name="Plus" size="lg" />
      </Button>
    </div>
  );
};
