import { CompanyEventResponse } from "@/api/types";
import { EventOverviewGrid } from "../EventOverviewGrid";
import { Section, SectionTitle } from "../Section";
import { EventUpsideGrid } from "../EventUpsideGrid";
import { EventDownsideGrid } from "../EventDownsideGrid";
import { Separator } from "@/components/ui";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { EventImpact } from "../EventImpact";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/useMobile";
import { classifyEventHorizon } from "@/utils/eventHorizon";

export interface EventDetailsProps {
  data: CompanyEventResponse;
}

export const EventDetails = ({ data }: EventDetailsProps) => {
  const hasImpacts = !!data.anticipated_impact || !!data.actual_impact;
  const eventDate = new Date(data.date);
  const isMobile = useIsMobile();
  const horizon = classifyEventHorizon(data);
  const formattedDate = format(eventDate, "yyyy-MM-dd");

  return (
    <div
      className={
        isMobile ? "flex flex-col gap-2 text-xs" : "flex flex-col gap-4"
      }
    >
      <EventOverviewGrid
        name={data.name}
        type={data.event_type.name}
        date={
          horizon.isSoft ? (
            <span className="inline-flex items-center">
              {formattedDate}
              <Tooltip
                asChild
                trigger={<span className="cursor-help">*</span>}
                content={horizon.tooltip}
                contentClasses="max-w-xs"
              />
            </span>
          ) : (
            formattedDate
          )
        }
        timeUntil={eventDate}
      />

      {data.description && (
        <div
          className={isMobile ? "break-words text-neutral-300" : "break-words"}
        >
          {data.description}
        </div>
      )}

      {hasImpacts && (
        <EventImpact
          anticipatedImpact={data.anticipated_impact?.name}
          actualImpact={data.actual_impact?.name}
        />
      )}

      {data.estimate && (
        <>
          {isMobile ? (
            <div className="space-y-2">
              <div className="font-semibold text-sm">Estimate</div>
              <EventUpsideGrid data={data.estimate} />
              <EventDownsideGrid data={data.estimate} />
            </div>
          ) : (
            <>
              <h6 className="text-xl font-bold">Estimate</h6>
              <Section>
                <SectionTitle>Upside</SectionTitle>
                <Separator className="bg-neutral-700" />
                <EventUpsideGrid data={data.estimate} />
              </Section>
              <Section>
                <SectionTitle>Downside</SectionTitle>
                <Separator className="bg-neutral-700" />
                <EventDownsideGrid data={data.estimate} />
              </Section>
            </>
          )}
        </>
      )}
    </div>
  );
};
