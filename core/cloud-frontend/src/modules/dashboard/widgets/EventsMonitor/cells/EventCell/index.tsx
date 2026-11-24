import { useCallback, useMemo } from "react";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { ExtendedEventResponse } from "../../components/EventsMonitorGrid/EventsMonitorDetailGrid";
import { IEventDetailDialogValues } from "../../dialogs/EventDetailDialog/eventDetailDialogSchema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { EventDetails } from "../../components/EventDetails";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { getEventStyleClasses } from "../../utils/eventColors";
import { EventClassificationIconsMap } from "@/utils/event-classifications";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { deriveEventHorizonPickerValue } from "@/utils/eventHorizon";

export interface PrefilledEventData extends IEventDetailDialogValues {
  id?: number | null;
  companyId?: number | null;
}

export const EventCell = (
  props: CustomCellRendererProps<ExtendedEventResponse>
) => {
  const { updateDialog } = useStore();
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);
  const prefilled: PrefilledEventData = useMemo(() => {
    const horizon = props.data
      ? deriveEventHorizonPickerValue(props.data)
      : { shape: "date" as const, date: new Date(), rangeWeeks: 0 as const };
    return {
      id: props.data?.id,
      companyName: props.data?.company_name || "",
      name: props.data?.name || "",
      eventType: props.data?.event_type?.id ? props.data.event_type.id : null,
      eventClassification: props.data?.anticipated_impact?.id
        ? props.data.anticipated_impact.id
        : null,
      eventImpact: props.data?.actual_impact?.id
        ? props.data.actual_impact.id
        : null,
      dateShape: horizon.shape,
      date: horizon.date,
      rangeWeeks: horizon.rangeWeeks,
      description: String(props.data?.description || ""),
      workstreamDescription: String(props.data?.workstream_description || ""),
      hasPassed: props.data?.is_passed || false,
    };
  }, [props.data]);

  const handleClick = useCallback(() => {
    updateDialog({
      dialog: Dialogs.openEventDetailDialog,
      status: true,
      prefilled: prefilled,
    });
  }, [prefilled, updateDialog]);

  const upsideProbability = useMemo(() => {
    return props.data?.estimate?.upside_probability;
  }, [props.data?.estimate?.upside_probability]);

  const eventStyleClasses = getEventStyleClasses(upsideProbability);

  const eventClassification = props.data?.anticipated_impact?.name || "";
  const Icon = EventClassificationIconsMap[eventClassification];
  const hasIcon = !!Icon;
  const hasPassed = props.data?.is_passed || false;

  const content = (
    <button
      className={`flex w-full items-center gap-2 ${eventStyleClasses}`}
      onClick={readOnly ? undefined : handleClick}
    >
      {hasIcon && (
        <div className="size-4 flex-shrink-0">
          <Icon hasPassed={hasPassed} />
        </div>
      )}
      <span className="truncate">{String(props.value || "")}</span>
    </button>
  );

  if (!props.data) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild onClick={readOnly ? undefined : handleClick}>
        {content}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="right"
          className="z-50 shadow-2xl rounded-xl w-fit p-4 bg-neutral-800 text-md text-white max-w-[277px] min-w-[150px]"
        >
          <EventDetails data={props.data} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
