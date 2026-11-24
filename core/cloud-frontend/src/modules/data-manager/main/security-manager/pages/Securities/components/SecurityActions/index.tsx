import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";
import { InstrumentResponse as Instrument } from "@/api/types";
import { useSecurityActions } from "../../hooks/useSecurityAction";

export interface SecurityActionsProps {
  data: Instrument;
  disablePublish?: boolean;
}

export const SecurityActions = ({
  data,
  disablePublish,
}: SecurityActionsProps) => {
  const { handleEditSecurity, handlePublishSecurity, isPublishingSecurity } =
    useSecurityActions(data);

  return (
    <div className="flex items-center gap-3 p-1">
      <Button
        variant="outline"
        className="gap-2"
        data-testid={`edit-security-button-[${data.id}]`}
        onClick={handleEditSecurity(data)}
      >
        <Icon name="Pencil" color="currentColor" size="md" />
        <span>Edit</span>
      </Button>
      {!disablePublish && (
        <Button
          variant="outline"
          className="gap-2"
          disabled={!data?.can_publish || isPublishingSecurity}
          onClick={handlePublishSecurity(data)}
        >
          {isPublishingSecurity ? (
            <Icon
              name="Loader"
              color="currentColor"
              size="md"
              className="animate-spin"
            />
          ) : (
            <Icon name="Share" color="currentColor" size="md" />
          )}
          <span>Publish</span>
        </Button>
      )}
    </div>
  );
};
