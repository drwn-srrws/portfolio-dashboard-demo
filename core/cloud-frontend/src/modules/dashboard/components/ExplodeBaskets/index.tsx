import { useCallback, useId } from "react";
import { Label } from "@components/ui";
import { Switch } from "@components/ui/switch";
import { useMetricFlags } from "@providers/MetricFlagsProvider";

export const ExplodeBaskets = () => {
  const explodeBasketsId = useId();
  const { metricFlags, setMetricFlags } = useMetricFlags();

  const handleExplodeBaskets = useCallback(
    (value: boolean) => {
      setMetricFlags({ ...metricFlags, explode_composites: value });
    },
    [metricFlags, setMetricFlags]
  );

  return (
    <div className="flex items-center gap-2">
      <Label
        htmlFor={explodeBasketsId}
        className="ml-4 block text-nowrap text-sm font-normal"
      >
        Explode Baskets
      </Label>
      <Switch
        data-testid="explode-baskets-switch"
        id={explodeBasketsId}
        className="scale-75"
        checked={metricFlags.explode_composites}
        onCheckedChange={handleExplodeBaskets}
      />
    </div>
  );
};
