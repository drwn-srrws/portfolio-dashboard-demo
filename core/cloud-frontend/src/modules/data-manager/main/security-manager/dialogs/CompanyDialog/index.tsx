import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { Close } from "@radix-ui/react-dialog";
import { Icon } from "@/components/Icon/Icon";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { useCallback, useMemo } from "react";

import {
  useGetCompanyConfig,
  useGetCompanyV2,
} from "@/api/endpoints/company/company";
import { CompanyForm } from "./components/CompanyForm";
import { editCompanySchema } from "./editCompanySchema";
import {
  addConfigFieldsToDefaultValues,
  addConfigFieldsToSchema,
} from "../../lib/generateSchema";
import { InstrumentGroupSecurity } from "../../pages/InstrumentGroups/components/InstrumentGroups";

export interface PrefilledData {
  data?: InstrumentGroupSecurity;
}

export interface CompanyFormProps {
  onClose?: () => void;
}

export const CompanyDialog = () => {
  const { updateDialog, prefilled, dialogs } = useStore();

  const prefilledData = prefilled as PrefilledData;
  const isEditMode = !!prefilledData?.data;
  const companyId = prefilledData?.data?.id;
  const open = dialogs[Dialogs.companyDialog];

  const { data: defaultValues } = useGetCompanyV2(
    companyId!,
    { includes: ["primary_instrument"] },
    {
      query: {
        enabled: !!companyId,
      },
    }
  );
  const { data: companyConfig } = useGetCompanyConfig();

  const { data, schema } = useMemo(() => {
    if (!companyConfig) return { data: null, schema: editCompanySchema };

    return {
      data: addConfigFieldsToDefaultValues(companyConfig, defaultValues),
      schema: addConfigFieldsToSchema(editCompanySchema, companyConfig),
    };
  }, [companyConfig, defaultValues]);

  const onOpenChange = useCallback(() => {
    updateDialog({ dialog: Dialogs.companyDialog, status: false });
  }, [updateDialog]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isClose={false}
        className="flex flex-col gap-0 overflow-y-auto border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0 w-auto max-w-[unset] h-[unset] min-w-[375px] min-h-[60vh]"
      >
        <div className="h-full flex flex-1 flex-col">
          <div
            className="flex-1 flex h-full flex-col gap-4 overflow-y-auto p-4"
            data-testid="company-dialog"
          >
            <DialogHeader>
              <div className="flex items-center justify-between pb-3">
                <DialogTitle>
                  {isEditMode ? "Edit Company" : "Create Company"}
                </DialogTitle>
                <Close
                  className="w-fit"
                  data-testid="company-dialog-close-button"
                >
                  <div
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-700 transition-colors hover:bg-neutral-800"
                    onClick={onOpenChange}
                  >
                    <Icon name="X" color="currentColor" size="lg" />
                  </div>
                </Close>
              </div>
            </DialogHeader>

            <CompanyForm
              companyId={companyId}
              data={{
                instrument_ids: [],
                primary_instrument_id: defaultValues?.primary_instrument
                  ? {
                      value: String(defaultValues.primary_instrument.id),
                      label: defaultValues.primary_instrument.name,
                    }
                  : null,
                country_of_risk: defaultValues?.country_of_risk
                  ? {
                      value: defaultValues.country_of_risk,
                      label: defaultValues.country_of_risk,
                    }
                  : null,
                ...data,
              }}
              config={companyConfig}
              schema={schema}
              defaultValues={defaultValues}
              onClose={onOpenChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
