import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";

import { CompanySecurity } from "../Companies";
import { useCompanyAction } from "../../hooks/useCompanyAction";

export interface CompanyActionsProps {
  data: CompanySecurity;
}

export const CompanyActions = ({ data }: CompanyActionsProps) => {
  const { handleEditCompany, handleDeleteCompany, isDeletingCompany } =
    useCompanyAction();
  return (
    <div className="flex items-center gap-3 p-1">
      <Button
        data-testid={`edit-company-button-[${data.id}]`}
        variant="outline"
        className="gap-2"
        onClick={handleEditCompany(data)}
      >
        <Icon name="Pencil" color="currentColor" size="md" />
        <span>Edit</span>
      </Button>
      <Button
        data-testid={`delete-company-button-[${data.id}]`}
        variant="outline"
        className="gap-2"
        disabled={isDeletingCompany}
        onClick={handleDeleteCompany(data)}
      >
        {isDeletingCompany ? (
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
