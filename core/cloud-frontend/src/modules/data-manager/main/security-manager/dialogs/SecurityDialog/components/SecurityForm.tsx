import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useWatch } from "react-hook-form";

import { FormSection } from "@/api/types";

import { Button } from "@components/ui";
import { DialogClose } from "@/components/ui/dialog";
import { FormField } from "../../../components/FormField/FormField";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";

import { SettingsAccordion } from "@/components/SettingsAccordion";
import {
  defaultEditSecurityValues,
  EditSecurityFormData,
} from "../editSecuritySchema";
import { useEditSecurity } from "../hooks/useEditSecurity";
import { useSecurityOptions } from "../hooks/useSecurityOptions";
import { FormTextField } from "@/components/Form/FormTextField";
import { Selectable } from "@/typings/Selectable";
import { FormInfiniteTextSelect } from "@/modules/data-manager/coverage/form/InfiniteTextSelect";

export interface SecurityFormProps {
  instrumentId: number;
  data: EditSecurityFormData & {
    [key: string]: string | Selectable | Selectable[] | null;
  };
  config?: FormSection[];
  schema: z.ZodType<
    EditSecurityFormData & {
      [key: string]: string | Selectable | Selectable[] | null;
    }
  >;
  onClose: () => void;
  onForward: () => void;
  onBackward: () => void;
}

export const SecurityForm = ({
  instrumentId,
  data,
  config,
  schema,
  onClose,
  onForward,
  onBackward,
}: SecurityFormProps) => {
  const form = useForm({
    defaultValues: {
      ...defaultEditSecurityValues,
      ...data,
    },
    values: {
      ...defaultEditSecurityValues,
      ...data,
    },
    resolver: zodResolver(schema),
  });

  const { securityTypeOptions } = useSecurityOptions();
  const { handleSubmit, control } = form;

  const conditionalTriggerNames = useMemo(() => {
    const names = new Set<string>();
    config?.forEach((section) =>
      section.fields.forEach((field) =>
        Object.keys(field.required_when ?? {}).forEach((name) =>
          names.add(name)
        )
      )
    );
    return Array.from(names);
  }, [config]);

  const triggerValues = useWatch({
    control,
    name: conditionalTriggerNames as (keyof EditSecurityFormData)[],
  });

  const triggerValueByName = useMemo(() => {
    const map: Record<string, string | null> = {};
    conditionalTriggerNames.forEach((name, index) => {
      const raw = triggerValues?.[index];
      if (raw && typeof raw === "object" && "value" in raw) {
        const v = (raw as { value?: unknown }).value;
        map[name] = typeof v === "string" ? v : null;
      } else if (typeof raw === "string") {
        map[name] = raw;
      } else {
        map[name] = null;
      }
    });
    return map;
  }, [conditionalTriggerNames, triggerValues]);

  const isFieldConditionallyRequired = (
    requiredWhen: Record<string, string[]> | null | undefined
  ): boolean => {
    if (!requiredWhen) return false;
    return Object.entries(requiredWhen).some(([triggerName, allowed]) => {
      const value = triggerValueByName[triggerName];
      return !!value && allowed.includes(value);
    });
  };

  const { handleUpdate, isUpdating } = useEditSecurity({
    instrumentId,
    callback: [onForward, onClose],
  });

  return (
    <FormProvider {...form}>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
            <div className="w-full">
              <FormTextField
                required
                name="name"
                control={control}
                label="Name"
                placeholder="Name"
                testId="edit-security-name-input"
              />
            </div>
            <div className="w-full">
              <FormInfiniteTextSelect
                required
                name="asset_class"
                control={control}
                options={securityTypeOptions}
                label="Asset Class"
                placeholder="Select"
                testId="edit-security-asset-class-input"
              />
            </div>
          </div>
          <div>
            {!!config?.length &&
              config.map(({ name: configName, label, fields }) => (
                <SettingsAccordion
                  key={configName}
                  title={label}
                  testId={`edit-security-accordion-[name-${configName}]`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    {fields.map(
                      ({
                        name,
                        label,
                        type,
                        required,
                        required_when,
                        resource,
                        options,
                        linked_to_issuer,
                      }) => (
                        <div key={name} className="w-full">
                          <FormField
                            name={name as keyof EditSecurityFormData}
                            label={label}
                            type={type}
                            options={options}
                            required={
                              required ||
                              isFieldConditionallyRequired(required_when)
                            }
                            resource={resource}
                            control={control}
                            disabled={!!linked_to_issuer}
                          />
                        </div>
                      )
                    )}
                  </div>
                </SettingsAccordion>
              ))}
          </div>
        </div>

        <AlertDialogFooter className="mt-auto flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-between">
          <DialogClose asChild>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="secondary"
              onClick={onBackward}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              variant="secondary"
              disabled={isUpdating}
              onClick={handleSubmit(handleUpdate)}
              data-testid="edit-security-save-button"
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </div>
        </AlertDialogFooter>
      </div>
    </FormProvider>
  );
};
