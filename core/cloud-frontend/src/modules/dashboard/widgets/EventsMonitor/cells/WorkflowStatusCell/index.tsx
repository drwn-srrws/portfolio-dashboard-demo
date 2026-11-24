import { CustomCellRendererProps } from "@ag-grid-community/react";
import { CompanyWorkflowStatus, CompanyResponse } from "@/api/types";
import { CompanyName } from "./components/CompanyName";
import {
  Flag,
  FlagColor,
} from "@/modules/dashboard/widgets/CoverageUniverse/components/Flag";
import { useCallback } from "react";
import type React from "react";
import { toast } from "@/components/ui/use-toast";
import { useOptimisticSetWorkflowStatus } from "@/modules/dashboard/widgets/EventsMonitor/hooks/useOptimisticSetWorkflowStatus";
import { useChangeHistory } from "../../../../providers/ChangeHistoryProvider";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";

export interface WorkflowStatusFlag {
  value: CompanyWorkflowStatus;
  icon: "Bookmark" | "Filter";
  color: FlagColor;
}

const workflowStatusFlags: WorkflowStatusFlag[] = [
  {
    value: CompanyWorkflowStatus.Flagged,
    icon: "Bookmark",
    color: "red",
  },
  {
    value: CompanyWorkflowStatus.Bottom_of_Funnel,
    icon: "Filter",
    color: "blue",
  },
];

export interface WorkflowStatusCellValue {
  name: string;
  workflowStatus: CompanyWorkflowStatus | null;
  companyId?: number;
}

export const WorkflowStatusCell = (
  params: CustomCellRendererProps<CompanyResponse, WorkflowStatusCellValue>
) => {
  const { value } = params;
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);
  const { mutateAsync: setWorkflowStatus } = useOptimisticSetWorkflowStatus();
  const { addHistoryEntry } = useChangeHistory();

  const handleToggleWorkflowStatus = useCallback(
    (flag: WorkflowStatusFlag) => async (e?: React.MouseEvent) => {
      e?.stopPropagation?.();
      const companyId = value?.companyId;
      const workflowStatus = value?.workflowStatus ?? null;
      if (!companyId) return;
      try {
        const newValue = flag.value !== workflowStatus ? flag.value : null;
        await setWorkflowStatus({
          companyId,
          data: { workflow_status: newValue },
        });
        addHistoryEntry({
          type: "update",
          entity: "workflow_status",
          title: "Workflow Status Updated",
          description: `${value?.name} - ${newValue || "None"}`,
          data: { companyId, workflowStatus: newValue },
        });
        toast({
          title: "Workflow status updated",
          description: "The workflow status has been updated.",
          testId: "workflow-status-success-toast",
        });
      } catch {
        toast({
          title: "Error updating workflow status",
          description: "Please try again.",
          testId: "workflow-status-error-toast",
        });
      }
    },
    [
      setWorkflowStatus,
      value?.companyId,
      value?.workflowStatus,
      value?.name,
      addHistoryEntry,
    ]
  );

  if (!value) return null;

  const { name, workflowStatus, companyId } = value;

  return (
    <div className="flex h-full items-center gap-2">
      <CompanyName name={name} companyId={companyId} />
      {!readOnly && (
        <div className="flex items-center gap-1">
          {workflowStatusFlags.map((flag) => (
            <Flag
              key={flag.value}
              active={flag.value === workflowStatus}
              icon={flag.icon}
              color={flag.color}
              onClick={handleToggleWorkflowStatus(flag)}
              data-testid={`workflow-status-${flag.value}-${companyId}-${flag.value === workflowStatus ? "active" : "inactive"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
