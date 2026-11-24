import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { FormSection, CompanyResponse } from "@/api/types";

import { Button } from "@components/ui";
import { DialogClose } from "@/components/ui/dialog";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";

import { SettingsAccordion } from "@/components/SettingsAccordion";

import {
  EditCompanyFormData,
  defaultEditCompanyValues,
} from "../editCompanySchema";
import { FormField } from "../../../components/FormField/FormField";

import { useEditSecurityCompany } from "../hooks/useEditSecurityCompany";
import { useCreateSecurityCompany } from "../hooks/useCreateSecurityCompany";
import { useCallback } from "react";
import { Selectable } from "@/typings/Selectable";
import { Resource } from "../../SecurityDialog/types";
import { FormFieldType } from "@/api/types";

export interface CompanyFormProps {
  companyId?: number;
  data: EditCompanyFormData & {
    [key: string]: string | Selectable | Selectable[] | null;
  };
  config?: FormSection[];
  schema: z.ZodType<
    EditCompanyFormData & {
      [key: string]: string | Selectable | Selectable[] | null;
    }
  >;
  defaultValues?: CompanyResponse;
  onClose: () => void;
}

export const CompanyForm = ({
  companyId,
  data,
  config,
  schema,
  defaultValues,
  onClose,
}: CompanyFormProps) => {
  const isPublicOwnership = defaultValues?.ownership_type === "PUBLIC";
  const countryOfRiskTooltip = isPublicOwnership
    ? "Country of risk for public companies is derived from Bloomberg and cannot be edited."
    : undefined;

  const form = useForm<EditCompanyFormData>({
    values: {
      ...defaultEditCompanyValues,
      ...data,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control } = form;

  const { updateCompany, isUpdatingCompany } = useEditSecurityCompany({
    companyId: companyId!,
    callback: [onClose],
  });

  const { createCompany, isCreatingCompany } = useCreateSecurityCompany({
    callback: [onClose],
  });

  const handleUpdate = useCallback(
    (values: EditCompanyFormData) => {
      if (companyId) {
        updateCompany(values);
      } else {
        createCompany(values);
      }
    },
    [companyId, createCompany, updateCompany]
  );

  const isLoading = isUpdatingCompany || isCreatingCompany;

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4 pt-4">
        {companyId && (
          <FormField
            name="primary_instrument_id"
            label="Primary Instrument"
            type={FormFieldType.select}
            required={false}
            resource={Resource["primary-instrument"]}
            control={control}
            params={{ company_id: companyId }}
          />
        )}
        {companyId && (
          <FormField
            name="country_of_risk"
            label="Country of Risk"
            type={FormFieldType.select}
            required={false}
            resource={Resource.country}
            control={control}
            disabled={isPublicOwnership}
            tooltip={countryOfRiskTooltip}
          />
        )}
        <div>
          {!!config?.length &&
            config.map(({ name: configName, label, fields }) => (
              <SettingsAccordion
                key={configName}
                title={label}
                testId={`edit-security-accordion-[name-${configName}]`}
              >
                <div className="grid grid-cols-3 gap-2">
                  {fields.map(
                    ({
                      name,
                      label,
                      type,
                      required,
                      resource,
                      options,
                      linked_to_issuer,
                    }) => (
                      <FormField
                        key={name}
                        name={name as keyof EditCompanyFormData}
                        label={label}
                        type={type}
                        options={options}
                        required={required}
                        resource={resource}
                        control={control}
                        disabled={!!linked_to_issuer}
                      />
                    )
                  )}
                </div>
              </SettingsAccordion>
            ))}
        </div>
      </div>

      <AlertDialogFooter className="mt-auto sm:justify-between">
        <div className="flex gap-2 justify-between w-full">
          <DialogClose asChild>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={handleSubmit(handleUpdate)}
            data-testid="edit-security-save-button"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </AlertDialogFooter>
    </FormProvider>
  );
};
