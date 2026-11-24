import { useFormContext } from "react-hook-form";
import { EventFormData } from "../schema/eventSchema";

export const useEventFormContext = () => useFormContext<EventFormData>();
