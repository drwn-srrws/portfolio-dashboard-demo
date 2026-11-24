import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { FormFieldType } from "@/api/types";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Resource } from "../types";
import { EditIssuerFormDataType } from "../editIssuerSchema";
import { useEditIssuer } from "../hooks/useEditIssuer";
import { FormField } from "../../../components/FormField/FormField";

export interface IssuerFormProps {
  data: EditIssuerFormDataType;
  instrumentId: number;
  schema: z.ZodType<EditIssuerFormDataType>;
  onClose: () => void;
  onForward: () => void;
}

export const IssuerForm = ({
  data,
  schema,
  onClose,
  onForward,
  instrumentId,
}: IssuerFormProps) => {
  const form = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control } = form;

  const { handleUpdate, isUpdating } = useEditIssuer({
    instrumentId,
    data,
    callback: [onForward],
  });

  return (
    <FormProvider {...form}>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2 pt-4">
          <FormField
            name="company"
            label="Issuer"
            type={FormFieldType.select}
            required={true}
            resource={Resource.company}
            control={control}
          />
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
              disabled={isUpdating}
              onClick={handleSubmit(handleUpdate)}
              data-testid="security-dialog-issuer-form-next-button"
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Updating..." : "Next"}
            </Button>
          </div>
        </AlertDialogFooter>
      </div>
    </FormProvider>
  );
};
