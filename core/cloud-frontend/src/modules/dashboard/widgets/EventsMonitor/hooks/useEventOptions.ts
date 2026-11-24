import {
  useReadEventActualImpacts,
  useReadEventAnticipatedImpacts,
  useReadEventTypes,
} from "@/api/endpoints/event/event";
import { useMemo } from "react";

export const useEventOptions = () => {
  const { data: eventActualImpacts, isLoading: isEventActualImpactsLoading } =
    useReadEventActualImpacts();
  const {
    data: eventAnticipatedImpacts,
    isLoading: isEventAnticipatedImpactsLoading,
  } = useReadEventAnticipatedImpacts();
  const { data: eventTypes, isLoading: isEventTypesLoading } =
    useReadEventTypes();

  const eventActualImpactsOptions = useMemo(() => {
    return (
      eventActualImpacts?.map((impact) => ({
        label: impact.name,
        value: impact.id,
      })) || []
    );
  }, [eventActualImpacts]);

  const eventAnticipatedImpactsOptions = useMemo(() => {
    return (
      eventAnticipatedImpacts?.map((impact) => ({
        label: impact.name,
        value: impact.id,
      })) || []
    );
  }, [eventAnticipatedImpacts]);

  const eventTypesOptions = useMemo(() => {
    return (
      eventTypes?.map((type) => ({
        label: type.name,
        value: type.id,
      })) || []
    );
  }, [eventTypes]);
  const isEventOptionsLoading = useMemo(() => {
    return (
      isEventActualImpactsLoading ||
      isEventAnticipatedImpactsLoading ||
      isEventTypesLoading
    );
  }, [
    isEventActualImpactsLoading,
    isEventAnticipatedImpactsLoading,
    isEventTypesLoading,
  ]);

  return {
    eventActualImpactsOptions,
    eventAnticipatedImpactsOptions,
    eventTypesOptions,
    isEventOptionsLoading,
  };
};
