import { memo, useCallback, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { debounce } from "@/utils";
import { HTTPError, UserResponse } from "@api/types";
import { AvatarSingleSelect } from "@components/BadgeMultiSelect/AvatarSingleSelect";
import { toast } from "@components/ui/use-toast";
import { Button } from "@components/ui";
import { ConfirmDetails, useConfirm } from "@providers/ConfirmProvider";
import { useInfiniteUsers } from "../../hooks/useInfiniteUsers";
import { useOptimisticSetPrimaryAnalyst } from "../../hooks/useOptimisticSetPrimaryAnalyst";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { Avatars } from "@/components/Avatars";

const assignmentConfirmDetails: ConfirmDetails = {
  title: "Assignment Confirmation",
  description:
    `Are you sure you want to proceed assigning primary coverage to this name?\n\n` +
    `This analyst will now be responsible for updating events, price targets, research, and ratings on this name on a regular cadence.`,
  confirmButtonText: "Confirm",
};

const unassignmentConfirmDetails: ConfirmDetails = {
  title: "Unassignment Confirmation",
  description:
    `Are you sure you want to proceed unassigning primary coverage from this name?\n\n` +
    `This analyst will no longer be responsible for updating events, price targets, research, and ratings on this name.`,
  confirmButtonText: "Confirm",
};

export interface PrimaryAnalystCellContentProps {
  companyId: number;
  primaryAnalyst: UserResponse | null;
  secondaryAnalysts: UserResponse[];
  avatarOnly?: boolean;
}

export interface PrimaryAnalystDraft {
  user: UserResponse | null;
}

export const PrimaryAnalystCellContent = memo(
  ({
    companyId,
    primaryAnalyst,
    secondaryAnalysts,
    avatarOnly,
  }: PrimaryAnalystCellContentProps) => {
    const { account } = useAuth();
    const readOnly = isPortfolioManagerReadOnly(account?.roles);
    const { confirm } = useConfirm();

    const [draft, setDraft] = useState<PrimaryAnalystDraft | null>(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const { mutateAsync: setPrimaryAnalyst, isPending: isSaving } =
      useOptimisticSetPrimaryAnalyst();

    const {
      data: usersData,
      fetchNextPage,
      isFetchingNextPage,
    } = useInfiniteUsers(
      { search: searchQuery, page_size: 20, include_demo_users: false },
      { enabled: open }
    );

    const value = draft ? draft.user : primaryAnalyst;

    const users = useMemo(
      () => [
        primaryAnalyst,
        ...(usersData?.pages
          .flatMap((page) => page.items)
          .filter((item) => item.id !== primaryAnalyst?.id) ?? []),
      ],
      [primaryAnalyst, usersData]
    );

    const saveChanges = useCallback(
      async (data: UserResponse | null) => {
        try {
          await setPrimaryAnalyst({ companyId, data });
          toast({
            testId: "primary-analyst-success-toast",
            title: "Success",
            description: "Research analysts updated successfully",
          });
        } catch (error) {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            testId: "primary-analyst-error-toast",
            title: "Error",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        }
      },
      [companyId, setPrimaryAnalyst]
    );

    const updateSearchQuery = useMemo(() => debounce(setSearchQuery, 500), []);

    const handleChange = useCallback((value: UserResponse | null) => {
      setDraft({ user: value });
    }, []);

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchInputValue(value);
        updateSearchQuery(value);
      },
      [updateSearchQuery]
    );

    const handleSave = useCallback(async () => {
      if (!draft) return;

      const confirmDetails = draft.user
        ? assignmentConfirmDetails
        : unassignmentConfirmDetails;

      const isConfirmed = await confirm(confirmDetails);

      if (!isConfirmed) return;

      await saveChanges(draft.user);

      setDraft(null);
      setOpen(false);
    }, [draft, confirm, saveChanges]);

    const options = useMemo(() => {
      return users
        .filter((user): user is UserResponse => user !== null)
        .map((user) => ({
          ...user,
          disabled: secondaryAnalysts.some((analyst) => analyst.id === user.id),
        }));
    }, [users, secondaryAnalysts]);

    const bottomAdornment = (
      <div className="flex flex-col p-2">
        <Button
          data-testid="primary-analyst-single-select-save-button"
          variant="outline"
          size="icon"
          className="w-full"
          onClick={handleSave}
        >
          {isSaving && <Loader className="w-4 h-4 mr-2" />}
          Save
        </Button>
      </div>
    );

    if (readOnly) {
      return (
        <div className="flex flex-col justify-center size-full -mt-0.5">
          <div className="flex items-center justify-start">
            {primaryAnalyst && (
              <Avatars data={[primaryAnalyst]} dense={false} />
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center size-full">
        <AvatarSingleSelect
          testId={`primary-analyst-single-select-[${companyId}]`}
          disableFiltering
          options={options}
          value={value}
          open={open}
          search={searchInputValue}
          isLoadingMore={isFetchingNextPage}
          bottomAdornment={bottomAdornment}
          avatarOnly={avatarOnly}
          onChange={handleChange}
          onLoadMore={fetchNextPage}
          onOpenChange={setOpen}
          onSearchChange={handleSearchChange}
        />
      </div>
    );
  }
);
