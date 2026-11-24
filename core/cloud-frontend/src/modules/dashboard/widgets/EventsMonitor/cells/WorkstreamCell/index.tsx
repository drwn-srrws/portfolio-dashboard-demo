import { useState, useCallback, useMemo } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { WorkstreamForm } from "./WorkstreamForm.tsx";
import { useUpdateCompanyV2 } from "@/api/endpoints/company/company";
import { CompanyResponse } from "@/api/types";
import { useChangeHistory } from "../../../../providers/ChangeHistoryProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";

export interface WorkstreamCellValue {
  companyId: number;
  companyName: string;
  workstream: string | null;
}

export const WorkstreamCell = ({
  value,
}: CustomCellRendererProps<CompanyResponse, WorkstreamCellValue>) => {
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);
  const [open, setOpen] = useState(false);
  const { addHistoryEntry } = useChangeHistory();

  const defaultFormValue = useMemo(() => {
    return value?.workstream ?? "";
  }, [value?.workstream]);

  const { mutateAsync: updateCompany, isPending: isSaving } =
    useUpdateCompanyV2();

  const handleSave = useCallback(
    async (workstream: string) => {
      if (!value?.companyId) return;

      const payload = {
        companyId: value.companyId,
        data: { workstream: workstream.trim() || null },
      };

      try {
        await updateCompany(payload);
        addHistoryEntry({
          type: "update",
          entity: "workstream",
          title: "Workstream Updated",
          description: `${value.companyName} - "${workstream || "(empty)"}"`,
          data: { companyId: value.companyId },
        });
        setOpen(false);
      } catch {
        console.error("Failed to update workstream");
      }
    },
    [value, updateCompany, addHistoryEntry]
  );

  if (!value) return null;

  const { workstream } = value;

  if (readOnly) {
    return (
      <span className="text-white">
        {workstream ?? <span className="text-neutral-400">-</span>}
      </span>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => !isSaving && setOpen(newOpen)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full h-full justify-start p-0 hover:bg-transparent text-white"
        >
          {workstream ? (
            <span className="underline">{workstream}</span>
          ) : (
            <span className="text-neutral-400">-</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-[10050] w-[280px] mt-[15px] rounded-[8px] bg-[#171717] p-4 text-white shadow-md border-neutral-700 border">
        <WorkstreamForm
          defaultValue={defaultFormValue}
          isSaving={isSaving}
          onClose={() => !isSaving && setOpen(false)}
          onSave={handleSave}
        />
      </PopoverContent>
    </Popover>
  );
};
