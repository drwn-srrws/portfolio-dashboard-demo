import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultEventValues,
  EventFormData,
  eventSchema,
} from "../schema/eventSchema";

export type UseEventFormProps = UseFormProps<EventFormData>;

export const useEventForm = (props?: UseFormProps<EventFormData>) => {
  const defaultValues = props?.defaultValues;

  return useForm<EventFormData>({
    ...props,
    defaultValues: { ...defaultEventValues, ...defaultValues },
    resolver: zodResolver(eventSchema),
  });
};
