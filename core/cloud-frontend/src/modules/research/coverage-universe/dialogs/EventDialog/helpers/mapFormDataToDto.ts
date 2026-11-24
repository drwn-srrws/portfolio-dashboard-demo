import { EventPost } from "@api/types";
import { EventFormData } from "../schema/eventSchema";
import { resolveEventHorizon } from "@/utils/eventHorizon";

export const mapFormDataToDto = (data: EventFormData): EventPost => ({
  name: data.name,
  event_type_id: +data.type,
  anticipated_impact_id: +data.classification,
  company_id: +data.company,
  ...resolveEventHorizon({
    shape: data.dateShape,
    date: data.date,
    rangeWeeks: data.rangeWeeks,
  }),
  actual_impact_id: data.impact ? +data.impact : null,
  description: data.description,
  workstream_description: data.workstreamDescription,
});
