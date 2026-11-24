import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { CompanyWorkflowStatus } from "@api/types";
import { KgStatus } from "@/api/types/kgStatus";
import { Icon, IconNameType } from "@components/Icon/Icon";
import { toast } from "@components/ui/use-toast";
import { useOptimisticSetWorkflowStatus } from "../../hooks/useOptimisticSetWorkflowStatus";
import { Flag, FlagColor } from "../../components/Flag";
import { KgStatusIndicator } from "../../components/KgStatusIndicator";
import { Button } from "@/components/ui";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";

export interface WorkflowStatusFlag {
  value: CompanyWorkflowStatus;
  icon: IconNameType;
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

export interface NameCellContentProps {
  companyId: number;
  name: string;
  workflowStatus: CompanyWorkflowStatus | null;
  in_portfolio?: boolean | null;
  kgStatus?: KgStatus | null;
}

export const NameCellContent = memo(
  ({
    companyId,
    name,
    workflowStatus,
    in_portfolio,
    kgStatus,
  }: NameCellContentProps) => {
    const { account } = useAuth();
    const readOnly = isPortfolioManagerReadOnly(account?.roles);
    const { mutateAsync: setWorkflowStatus } = useOptimisticSetWorkflowStatus();

    const handleToggleWorkflowStatus = useCallback(
      (flag: WorkflowStatusFlag) => async () => {
        try {
          const value = flag.value !== workflowStatus ? flag.value : null;

          await setWorkflowStatus({
            companyId,
            data: { workflow_status: value },
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
      [setWorkflowStatus, companyId, workflowStatus]
    );
    return (
      <div className="relative flex items-center gap-2 size-full">
        <Link
          to={`/company/${companyId}`}
          className="line-clamp-1 hover:underline"
        >
          {name}
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent cursor-default"
          >
            <Icon
              name="BadgeDollarSign"
              size="lg"
              className={in_portfolio ? "text-green-500" : "text-neutral-500"}
            />
          </Button>
          {kgStatus && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent cursor-default"
            >
              <KgStatusIndicator status={kgStatus} />
            </Button>
          )}
          {!readOnly &&
            workflowStatusFlags.map((flag) => (
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
      </div>
    );
  }
);
