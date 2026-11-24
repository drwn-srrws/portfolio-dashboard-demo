import {
  useCreateEvent,
  useDeleteEvent,
  usePatchEvent,
} from "@/api/endpoints/event/event";
import { useMemo } from "react";

export const useEventMutations = () => {
  const { mutateAsync: patchEvent, isPending: isPatchEventLoading } =
    usePatchEvent();
  const { mutateAsync: createEvent, isPending: isCreateEventLoading } =
    useCreateEvent();
  const { mutateAsync: deleteEvent, isPending: isDeleteEventLoading } =
    useDeleteEvent();

  const isLoading = useMemo(() => {
    return isPatchEventLoading || isCreateEventLoading || isDeleteEventLoading;
  }, [isPatchEventLoading, isCreateEventLoading, isDeleteEventLoading]);

  return {
    patchEvent,
    createEvent,
    deleteEvent,
    isLoading,
  };
};
