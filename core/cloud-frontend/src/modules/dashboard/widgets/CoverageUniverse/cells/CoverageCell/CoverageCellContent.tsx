import { memo, useCallback, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { debounce } from "@/utils";
import { HTTPError, UserResponse } from "@api/types";
import { AvatarMultiSelect } from "@components/AvatarMultiSelect";
import { toast } from "@components/ui/use-toast";
import { Button } from "@components/ui";
import { useOptimisticSetResearchAnalysts } from "../../hooks/useOptimisticSetResearchAnalysts";
import { useInfiniteUsers } from "../../hooks/useInfiniteUsers";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { Avatars } from "@/components/Avatars";

export interface CoverageCellContentProps {
  companyId: number;
  researchAnalysts: UserResponse[];
}

export const CoverageCellContent = memo(
  ({ companyId, researchAnalysts }: CoverageCellContentProps) => {
    const { account } = useAuth();
    const readOnly = isPortfolioManagerReadOnly(account?.roles);
    const [draft, setDraft] = useState<UserResponse[] | null>(null);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const { mutateAsync: setResearchAnalysts, isPending: isSaving } =
      useOptimisticSetResearchAnalysts();

    const {
      data: usersData,
      fetchNextPage,
      isFetchingNextPage,
    } = useInfiniteUsers(
      { search: searchQuery, page_size: 20, include_demo_users: false },
      { enabled: open }
    );

    const value = draft ?? researchAnalysts;

    const users = useMemo(
      () => [
        ...researchAnalysts,
        ...(usersData?.pages
          .flatMap((page) => page.items)
          .filter(
            (item) =>
              !researchAnalysts.some((analyst) => analyst.id === item.id)
          ) ?? []),
      ],
      [researchAnalysts, usersData]
    );

    const saveChanges = useCallback(
      async (data: UserResponse[]) => {
        try {
          await setResearchAnalysts({ companyId, data });
          toast({
            testId: "research-analyst-success-toast",
            title: "Success",
            description: "Research analysts updated successfully",
          });
        } catch (error) {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            testId: "research-analyst-error-toast",
            title: "Error",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        }
      },
      [companyId, setResearchAnalysts]
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
      }));
    }, [users]);

    const bottomAdornment = (
      <div className="flex flex-col p-2">
        <Button
          data-testid={`research-analysts-multiselect-save-button`}
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
            <Avatars data={researchAnalysts} dense={false} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center size-full">
        <AvatarMultiSelect
          testId={`research-analysts-multiselect-[${companyId}]`}
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
