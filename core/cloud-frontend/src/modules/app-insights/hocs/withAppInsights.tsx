import { ComponentType, useCallback, useRef } from "react";

import { useAppInsights } from "@/modules/app-insights/providers/AppInsightsProvider";
import { useTrackEvent } from "@modules/app-insights/hooks/useTrackEvent";

export interface WithAppInsightsRef {
  interactionStartTime: Date;
}

export const withAppInsights = <P extends object>(
  Component: ComponentType<P>,
  name: string
) => {
  return (props: P) => {
    const ref = useRef<WithAppInsightsRef>({
      interactionStartTime: new Date(),
    });

    const { analyticsClient } = useAppInsights();

    const trackComponentInteraction = useTrackEvent(`${name} Interaction`, {
      component: name,
      event: "ComponentInteraction",
    });

    const handleMouseEnter = useCallback(() => {
      ref.current.interactionStartTime = new Date();
    }, []);

    const handleMouseLeave = useCallback(() => {
      const interactionEndTime = new Date();
      const interactionStartTime = ref.current.interactionStartTime;

      const engagementTime =
        interactionEndTime.getTime() - interactionStartTime.getTime();

      analyticsClient.trackMetric(
        "React Component Engaged Time (seconds)",
        engagementTime / 1000,
        { component: name }
      );
    }, [analyticsClient]);

    return (
      <div
        className="contents"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => trackComponentInteraction({ action: "left-click" })}
        onContextMenu={() =>
          trackComponentInteraction({ action: "right-click" })
        }
      >
        <Component {...props} />
      </div>
    );
  };
};
