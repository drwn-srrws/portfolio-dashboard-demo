import { Label } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { useEventMetricFilter } from "../../providers/EventMetricFilterContext";

export const ImpactThreshold = () => {
  const { eventMetricFilters, setEventMetricFilters } = useEventMetricFilter();

  return (
    <div
      className="flex items-center gap-2 m-0 md:mr-4"
      key="impact-threshold-field"
    >
      <Label
        htmlFor="filter-low-impact"
        className="text-sm font-normal whitespace-nowrap"
      >
        Remove Passed Events w/ &lt;50bps Impact
      </Label>
      <Switch
        id="filter-low-impact"
        className="scale-75"
        checked={eventMetricFilters.enable_low_impact_filter}
        onCheckedChange={(value) =>
          setEventMetricFilters({
            ...eventMetricFilters,
            enable_low_impact_filter: value,
          })
        }
      />
    </div>
  );
};
