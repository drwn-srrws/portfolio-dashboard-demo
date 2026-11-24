import { useCallback, useMemo } from "react";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { IEventDetailDialogValues } from "../../dialogs/EventDetailDialog/eventDetailDialogSchema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { EventDetails } from "../../components/EventDetails";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { CompanyResponse } from "@/api/types";
import { EventClassificationIconsMap } from "@/utils/event-classifications";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { deriveEventHorizonPickerValue } from "@/utils/eventHorizon";

export interface PrefilledEventData extends IEventDetailDialogValues {
  id?: number | null;
  companyId?: number | null;
}

export const AdvancedEventCell = (
  props: CustomCellRendererProps<CompanyResponse>,
  type: "next_event" | "next_biggest_event"
) => {
  const { updateDialog } = useStore();
  const isMobile = useIsMobile();
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);
  const data = useMemo(() => {
    return type === "next_event"
      ? props.data?.next_event
      : props.data?.next_biggest_event;
  }, [props.data, type]);

  const prefilled: PrefilledEventData = useMemo(() => {
    const horizon = data
      ? deriveEventHorizonPickerValue(data)
      : { shape: "date" as const, date: new Date(), rangeWeeks: 0 as const };
    return {
      id: data?.id,
      companyName: props.data?.name || "",
      name: data?.name || "",
      eventType: data?.event_type?.id ? data.event_type.id : null,
      eventClassification: data?.anticipated_impact?.id
        ? data.anticipated_impact.id
        : null,
      eventImpact: data?.actual_impact?.id ? data.actual_impact.id : null,
      dateShape: horizon.shape,
      date: horizon.date,
      rangeWeeks: horizon.rangeWeeks,
      description: String(data?.description || ""),
      workstreamDescription: String(data?.workstream_description || ""),
      hasPassed: data?.is_passed || false,
    };
  }, [data, props.data]);

  const handleClick = useCallback(() => {
    updateDialog({
      dialog: Dialogs.openEventDetailDialog,
      status: true,
      prefilled: prefilled,
    });
  }, [prefilled, updateDialog]);

  const upsideProbability = useMemo(() => {
    return data?.estimate?.upside_probability;
  }, [data?.estimate?.upside_probability]);

  const eventClassification = data?.anticipated_impact?.name || "";
  const Icon = EventClassificationIconsMap[eventClassification];
  const hasIcon = !!Icon;
  const hasPassed = data?.is_passed || false;

  const borderColorClass = useMemo(() => {
    const map: Record<string, string> = {
      BAND_0_25: "border-2 border-red-700",
      BAND_25_50: "border-2 border-red-300",
      BAND_50_75: "border-2 border-green-200",
      BAND_75_100: "border-2 border-green-500",
    };
    return upsideProbability && map[String(upsideProbability)]
      ? map[String(upsideProbability)]
      : "border-2 border-neutral-600";
  }, [upsideProbability]);

  const content = () => (
    <Badge
      variant="outline"
      className={`${borderColorClass} flex items-center h-8 gap-2 py-0 pl-2 pr-1`}
      onClick={handleClick}
    >
      {hasIcon && (
        <div className="size-4 flex-shrink-0">
          <Icon hasPassed={hasPassed} />
        </div>
      )}
      <span className="truncate">{String(data?.name || "")}</span>
    </Badge>
  );

  if (!data) return <></>;

  return (
    <Tooltip>
      <TooltipTrigger asChild onClick={readOnly ? undefined : handleClick}>
        {content()}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side={isMobile ? "bottom" : "right"}
          className="z-50 shadow-2xl rounded-xl w-fit p-4 bg-neutral-800 text-md text-white max-w-[277px] min-w-[150px]"
        >
          <EventDetails data={data} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
