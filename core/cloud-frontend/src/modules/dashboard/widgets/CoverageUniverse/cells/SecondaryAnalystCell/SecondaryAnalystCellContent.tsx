import { memo, useCallback, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { AxiosError } from "axios";
import { debounce } from "@/utils";
import { HTTPError, UserResponse } from "@api/types";
import { AvatarMultiSelect } from "@components/AvatarMultiSelect";
import { toast } from "@components/ui/use-toast";
import { Button } from "@components/ui";
import { useInfiniteUsers } from "../../hooks/useInfiniteUsers";
import { useOptimisticSetSecondaryAnalysts } from "../../hooks/useOptimisticSetSecondaryAnalysts";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { Avatars } from "@/components/Avatars";

export interface SecondaryAnalystCellContentProps {
  companyId: number;
  primaryAnalyst: UserResponse | null;
  secondaryAnalysts: UserResponse[];
}

export const SecondaryAnalystCellContent = memo(
  ({
    companyId,
    primaryAnalyst,
    secondaryAnalysts,
  }: SecondaryAnalystCellContentProps) => {
    const { account } = useAuth();
    const readOnly = isPortfolioManagerReadOnly(account?.roles);
    const [draft, setDraft] = useState<UserResponse[] | null>(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const { mutateAsync: setSecondaryAnalysts, isPending: isSaving } =
      useOptimisticSetSecondaryAnalysts();

    const {
      data: usersData,
      fetchNextPage,
      isFetchingNextPage,
    } = useInfiniteUsers(
      { search: searchQuery, page_size: 20, include_demo_users: false },
      { enabled: open }
    );

    const value = draft ?? secondaryAnalysts;

    const users = useMemo(
      () => [
        ...secondaryAnalysts,
        ...(usersData?.pages
          .flatMap((page) => page.items)
          .filter(
            (item) =>
              !secondaryAnalysts.some((analyst) => analyst.id === item.id)
          ) ?? []),
      ],
      [usersData?.pages, secondaryAnalysts]
    );

    const saveChanges = useCallback(
      async (data: UserResponse[]) => {
        try {
          await setSecondaryAnalysts({ companyId, data });
          toast({
            testId: "secondary-analysts-success-toast",
            title: "Success",
            description: "Secondary analysts updated successfully",
          });
        } catch (error) {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            testId: "secondary-analysts-error-toast",
            title: "Error",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        }
      },
      [companyId, setSecondaryAnalysts]
    );

    const updateSearchQuery = useMemo(() => debounce(setSearchQuery, 500), []);

    const handleChange = useCallback((value: UserResponse[]) => {
      setDraft(value);
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
      await saveChanges(draft);
      setDraft(null);
      setOpen(false);
    }, [saveChanges, draft]);

    const options = useMemo(() => {
      return users.map((user) => ({
        ...user,
        disabled: primaryAnalyst?.id === user.id,
      }));
    }, [users, primaryAnalyst]);

    const bottomAdornment = (
      <div className="flex flex-col p-2">
        <Button
          data-testid="secondary-analysts-multiselect-save-button"
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
            <Avatars data={secondaryAnalysts} dense={false} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center size-full">
        <AvatarMultiSelect
          testId={`secondary-analysts-multiselect-[${companyId}]`}
          disableFiltering
          options={options}
          value={value}
          open={open}
          search={searchInputValue}
          isLoadingMore={isFetchingNextPage}
          bottomAdornment={bottomAdornment}
          onChange={handleChange}
          onLoadMore={fetchNextPage}
          onOpenChange={setOpen}
          onSearchChange={handleSearchChange}
        />
      </div>
    );
  }
);
