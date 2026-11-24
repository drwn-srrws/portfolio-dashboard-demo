import { useMemo } from "react";
import { Selectable } from "@typings/Selectable";
import { useReadCompanies } from "@api/endpoints/company/company";
import {
  useReadEventActualImpacts,
  useReadEventAnticipatedImpacts,
  useReadEventTypes,
} from "@api/endpoints/event/event";
import { FormEventHorizon } from "@components/Form/FormEventHorizon";
import { FormTextArea } from "@components/Form/FormTextArea";
import { FormTextField } from "@components/Form/FormTextField";
import { FormTextSelect } from "@components/Form/FormTextSelect";
import { useEventFormContext } from "../../hooks/useEventFormContext";

export const EventFormFields = () => {
  const { control } = useEventFormContext();

  const { data: eventTypes } = useReadEventTypes();
  const { data: companies } = useReadCompanies();
  const { data: actualImpacts } = useReadEventActualImpacts();
  const { data: anticipatedImpacts } = useReadEventAnticipatedImpacts();

  const classificationOptions = useMemo(() => {
    return (anticipatedImpacts?.map((impact) => ({
      label: impact.name,
      value: `${impact.id}`,
    })) ?? []) as Selectable[];
  }, [anticipatedImpacts]);

  const impactOptions = useMemo(() => {
    return (actualImpacts?.map((impact) => ({
      label: impact.name,
      value: `${impact.id}`,
    })) ?? []) as Selectable[];
  }, [actualImpacts]);

  const eventTypeOptions = useMemo(() => {
    return (eventTypes?.map((type) => ({
      label: type.name,
      value: `${type.id}`,
    })) ?? []) as Selectable[];
  }, [eventTypes]);

  const companyOptions = useMemo(() => {
    return (companies?.map((company) => ({
      label: company.display_name,
      value: `${company.id}`,
    })) ?? []) as Selectable[];
  }, [companies]);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <FormTextField
        required
        name="name"
        control={control}
        label="Name"
        placeholder="Name"
        testId="event-name-input"
      />

      <div className="flex gap-4">
        <div className="w-full">
          <FormTextSelect
            required
            virtual
            name="type"
            control={control}
            label="Type"
            placeholder="Select type"
            options={eventTypeOptions}
            testId="event-type-select"
          />
        </div>
        <div className="w-full">
          <FormTextSelect
            required
            virtual
            name="classification"
            control={control}
            label="Classification"
            placeholder="Select type"
            options={classificationOptions}
            testId="event-classification-select"
          />
        </div>
      </div>

      <FormTextSelect
        required
        virtual
        name="company"
        control={control}
        label="Company"
        placeholder="Select company"
        options={companyOptions}
        testId="event-company-select"
      />

      <FormEventHorizon
        required
        control={control}
        shapeName="dateShape"
        dateName="date"
        rangeWeeksName="rangeWeeks"
      />

      <FormTextSelect
        name="impact"
        control={control}
        label="Impact"
        placeholder="Select impact"
        options={impactOptions}
        testId="event-impact-select"
      />

      <FormTextArea
        name="description"
        control={control}
        label="Description (Optional)"
        placeholder="Type here..."
        rows={3}
        testId="event-description-textarea"
      />

      <FormTextArea
        name="workstreamDescription"
        control={control}
        label="Workstream Description (Optional)"
        placeholder="Type here..."
        rows={3}
        testId="event-workstream-description-textarea"
      />
    </div>
  );
};
