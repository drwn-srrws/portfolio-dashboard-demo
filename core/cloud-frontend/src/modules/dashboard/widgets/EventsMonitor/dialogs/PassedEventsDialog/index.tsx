import { Dialog } from "@/components/ui";
import { useStore } from "@store/index";
import { Dialogs } from "@store/slices/dialogsSlice";
import { usePassedEvents } from "./hooks/usePassedEvents";

import { PassedEventsDialogContent } from "./PassedEventsDialogContent";

export const PassedEventsDialog = () => {
  const { dialogs } = useStore();
  const open = dialogs[Dialogs.openPassedEventsDialog];
  const { passedEvents, isLoading } = usePassedEvents();

  if (!passedEvents.length) return null;

  return (
    <Dialog open={open}>
      <PassedEventsDialogContent
        passedEvents={passedEvents}
        isLoading={isLoading}
      />
    </Dialog>
  );
};
