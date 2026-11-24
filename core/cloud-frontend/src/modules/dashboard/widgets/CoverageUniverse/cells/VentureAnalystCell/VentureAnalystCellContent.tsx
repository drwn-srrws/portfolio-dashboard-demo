import { memo, useCallback, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";

import { debounce } from "@/utils";
import { hyphenatedDate } from "@/utils/dates";
import {
  CompanyCoverageResponse,
  CoverageType,
  HTTPError,
  UserResponse,
} from "@api/types";
import { useReadCompanyCoverages } from "@api/endpoints/company/company";
import { AvatarSingleSelect } from "@components/BadgeMultiSelect/AvatarSingleSelect";
import { Avatars } from "@/components/Avatars";
import { toast } from "@components/ui/use-toast";
import { Button } from "@components/ui";
import { ConfirmDetails, useConfirm } from "@providers/ConfirmProvider";

import { useInfiniteUsers } from "../../hooks/useInfiniteUsers";
import { useOptimisticSetVentureAnalyst } from "../../hooks/useOptimisticSetVentureAnalyst";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";

const assignmentConfirmDetails: ConfirmDetails = {
  title: "Assignment Confirmation",
  description:
    `Are you sure you want to proceed assigning venture analyst coverage to this name?\n\n` +
    `This analyst will now be the venture analyst on record for this company.`,
  confirmButtonText: "Confirm",
};

const unassignmentConfirmDetails: ConfirmDetails = {
  title: "Unassignment Confirmation",
  description:
    `Are you sure you want to proceed unassigning venture analyst coverage from this name?\n\n` +
    `This analyst will no longer be the venture analyst on record for this company.`,
  confirmButtonText: "Confirm",
};

export interface VentureAnalystCellContentProps {
  companyId: number;
  ventureAnalyst: UserResponse | null;
  avatarOnly?: boolean;
}

interface VentureAnalystDraft {
  user: UserResponse | null;
}

const findActiveVentureAnalystCoverageId = (
  coverages: CompanyCoverageResponse[] | undefined,
  companyId: number
): number | null => {
  if (!coverages) return null;
  const today = hyphenatedDate(new Date());
  const active = coverages.find(
    (coverage) =>
      coverage.company_id === companyId &&
      coverage.coverage_type === CoverageType.venture_analyst &&
      coverage.effective_start_date <= today &&
      (!coverage.effective_end_date || coverage.effective_end_date > today)
  );
  return active?.id ?? null;
};

export const VentureAnalystCellContent = memo(
  ({
    companyId,
    ventureAnalyst,
    avatarOnly,
  }: VentureAnalystCellContentProps) => {
    const { account } = useAuth();
    const readOnly = isPortfolioManagerReadOnly(account?.roles);
    const { confirm } = useConfirm();

    const [draft, setDraft] = useState<VentureAnalystDraft | null>(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const { data: coverages, isLoading: isCoveragesLoading } =
      useReadCompanyCoverages({
        query: { enabled: open && !readOnly },
      });

    const currentCoverageId = useMemo(
      () => findActiveVentureAnalystCoverageId(coverages, companyId),
      [coverages, companyId]
    );

    const { mutateAsync: setVentureAnalyst, isPending: isSaving } =
      useOptimisticSetVentureAnalyst();

    const {
      data: usersData,
      fetchNextPage,
      isFetchingNextPage,
    } = useInfiniteUsers(
      { search: searchQuery, page_size: 20, include_demo_users: false },
      { enabled: open }
    );

    const value = draft ? draft.user : ventureAnalyst;

    const users = useMemo(
      () => [
        ventureAnalyst,
        ...(usersData?.pages
          .flatMap((page) => page.items)
          .filter((item) => item.id !== ventureAnalyst?.id) ?? []),
      ],
      [ventureAnalyst, usersData]
    );

    const saveChanges = useCallback(
      async (data: UserResponse | null) => {
        try {
          await setVentureAnalyst({ companyId, data, currentCoverageId });
          toast({
            testId: "venture-analyst-success-toast",
            title: "Success",
            description: "Venture analyst updated successfully",
          });
        } catch (error) {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            testId: "venture-analyst-error-toast",
            title: "Error",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        }
      },
      [companyId, currentCoverageId, setVentureAnalyst]
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

    const options = useMemo(
      () =>
        users
          .filter((user): user is UserResponse => user !== null)
          .map((user) => ({ ...user })),
      [users]
    );

    const bottomAdornment = (
      <div className="flex flex-col p-2">
        <Button
          data-testid="venture-analyst-single-select-save-button"
          variant="outline"
          size="icon"
          className="w-full"
          onClick={handleSave}
          disabled={isCoveragesLoading || isSaving}
        >
          {(isCoveragesLoading || isSaving) && (
            <Loader className="w-4 h-4 mr-2" />
          )}
          Save
        </Button>
      </div>
    );

    if (readOnly) {
      return (
        <div className="flex flex-col justify-center size-full -mt-0.5">
          <div className="flex items-center justify-start">
            {ventureAnalyst && (
              <Avatars data={[ventureAnalyst]} dense={false} />
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center size-full">
        <AvatarSingleSelect
          testId={`venture-analyst-single-select-[${companyId}]`}
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
