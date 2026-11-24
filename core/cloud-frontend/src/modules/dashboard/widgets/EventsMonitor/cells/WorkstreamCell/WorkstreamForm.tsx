import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui";
import { FormTextField } from "@/components/Form/FormTextField";
import { useAuth } from "@/modules/auth/providers/AuthProvider";

const workstreamSchema = z.object({
  workstream: z.string().optional(),
});

type WorkstreamFormData = z.infer<typeof workstreamSchema>;

export interface WorkstreamFormProps {
  defaultValue: string;
  isSaving: boolean;
  onClose: () => void;
  onSave: (workstream: string) => void;
}

export const WorkstreamForm = ({
  defaultValue,
  isSaving,
  onClose,
  onSave,
}: WorkstreamFormProps) => {
  const { account } = useAuth();
  const { control, handleSubmit } = useForm<WorkstreamFormData>({
    defaultValues: { workstream: defaultValue },
    resolver: zodResolver(workstreamSchema),
  });

  const onSubmit = (data: WorkstreamFormData) => {
    onSave(data.workstream || "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm">Set Workstream</div>
          <div className="text-xs text-neutral-400">
            By {account?.first_name} {account?.last_name}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Workstream</div>
          <FormTextField
            data-testid="workstream-input"
            name="workstream"
            control={control}
            placeholder="Enter workstream"
          />
        </div>

        <div className="flex justify-between gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            data-testid="workstream-save-button"
            className="bg-neutral-600 text-foreground hover:bg-neutral-600/80"
            disabled={isSaving}
          >
            {isSaving ? "Updating..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};
