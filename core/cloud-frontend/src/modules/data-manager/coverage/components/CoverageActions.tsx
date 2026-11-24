import { Button } from "@components/ui/button";
import { Icon } from "@/components/Icon/Icon";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { CoverageRow } from "../hooks/useGetCoverages";
import { useConfirm } from "@/providers/ConfirmProvider";
import { toast } from "@/components/ui/use-toast";
import useDeleteCoverage from "../hooks/useDeleteCoverage";

interface CoverageActionsProps {
  row: CoverageRow;
}

export const CoverageActions = ({ row }: CoverageActionsProps) => {
  const { deleteCoverage, isLoading: isDeleting } = useDeleteCoverage();
  const { confirm } = useConfirm();
  const { updateDialog } = useStore();

  const handleEditCoverage = () => {
    updateDialog({
      dialog: Dialogs.coverageDialog,
      status: true,
      prefilled: row,
    });
  };

  const handleDeleteCoverage = async () => {
    try {
      const isConfirmed = await confirm({
        title: "Delete Coverage",
        description:
          "Are you sure you want to delete this coverage? This action cannot be undone.",
        confirmButtonText: "Delete",
      });

      if (!isConfirmed) return;

      await deleteCoverage(row.id);
    } catch {
      toast({ title: "Failed to delete coverage", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center gap-3 p-1">
      <Button
        variant="outline"
        className="gap-2"
        onClick={handleEditCoverage}
        disabled={isDeleting}
        data-testid={`edit-company-button-[id=${row.id}]`}
      >
        <Icon name="Pencil" color="currentColor" size="md" />
        <span>Edit</span>
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={handleDeleteCoverage}
        disabled={isDeleting}
        data-testid={`delete-company-button-[id=${row.id}]`}
      >
        {isDeleting ? (
          <Icon
            name="Loader"
            color="currentColor"
            size="md"
            className="animate-spin"
          />
        ) : (
          <Icon name="Trash" color="currentColor" size="md" />
        )}
        <span>Delete</span>
      </Button>
    </div>
  );
};
