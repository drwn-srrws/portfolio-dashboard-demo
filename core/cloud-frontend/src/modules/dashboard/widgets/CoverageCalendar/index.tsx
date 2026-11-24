import { useCallback } from "react";

import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { Button } from "@/components/ui";
import { Icon } from "@/components/Icon/Icon";
import { Dialogs } from "@/store/slices/dialogsSlice";

import { CoverageCalendar as Calendar } from "./components/CoverageCalendar";
import { useStore } from "@/store";

const CoverageCalendarContent = () => {
  const { updateDialog } = useStore();

  const handleCreateEvent = useCallback(() => {
    updateDialog({ dialog: Dialogs.eventDialog, status: true });
  }, [updateDialog]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle>Events Calendar</WidgetTitle>

        <WidgetActions>
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={handleCreateEvent}
            data-testid="events-calendar-create-button"
          >
            <Icon name="CirclePlus" color="currentColor" size="lg" />
            <span>Create Event</span>
          </Button>
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody data-testid="events-calendar-widget">
        <Calendar />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const CoverageCalendar = withAppInsights(
  CoverageCalendarContent,
  "CoverageCalendar"
);
