import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";

import { InstrumentGroupSecurity } from "../InstrumentGroups";
import { useInstrumentGroupSecurityAction } from "../../hooks/useInstrumentGroupSecurityAction";

export interface InstrumentGroupActionsProps {
  data: InstrumentGroupSecurity;
}

export const InstrumentGroupActions = ({
  data,
}: InstrumentGroupActionsProps) => {
  const { handleEditSecurity, handleDeleteSecurity, isDeletingSecurity } =
    useInstrumentGroupSecurityAction(data);

  return (
    <div className="flex items-center gap-3 p-1">
      <Button
        data-testid={`edit-instrument-group-button-[${data.id}]`}
        variant="outline"
        className="gap-2"
        onClick={handleEditSecurity(data)}
      >
        <Icon name="Pencil" color="currentColor" size="md" />
        <span>Edit</span>
      </Button>
      <Button
        data-testid={`delete-instrument-group-button-[${data.id}]`}
        variant="outline"
        className="gap-2"
        disabled={isDeletingSecurity}
        onClick={handleDeleteSecurity(data)}
      >
        {isDeletingSecurity ? (
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
