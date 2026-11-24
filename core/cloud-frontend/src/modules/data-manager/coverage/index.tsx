import { useMemo, useState } from "react";
import { z } from "zod";

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import { Filters } from "@/components/Filters/Filters";
import { Button } from "@components/ui/button";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";

import {
  filterCoverages,
  filteringConfig,
  filteringSchema,
} from "./utils/filtering";

import { useGetCoverages } from "./hooks/useGetCoverages";
import { CoverageDialog } from "./dialogs/CoverageDialog";
import { Icon } from "@/components/Icon/Icon";
import { Skeleton } from "@/components/ui/skeleton";
import { CoverageGrid } from "./components/CoverageGrid";
import { AppToolbar } from "@/components/Toolbar/components/AppToolbar";
import { MainWrapper } from "@/components/MainWrapper";

export const DataManagerCoveragePage = () => {
  const { rows, isLoading } = useGetCoverages();
  const [filters, setFilters] = useState<
    Partial<z.infer<typeof filteringSchema>>
  >({});

  const { updateDialog, dialogs } = useStore();
  const isDialogOpen = useMemo(
    () => dialogs[Dialogs.coverageDialog],
    [dialogs]
  );

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    return filterCoverages(filters)(rows);
  }, [filters, rows]);

  const handleCreateCoverage = useMemo(
    () => () => {
      updateDialog({
        dialog: Dialogs.coverageDialog,
        status: true,
        prefilled: {},
      });
    },
    [updateDialog]
  );

  return (
    <div className="flex size-full flex-col">
      <AppToolbar
        disableDateRange
        filtersSlot={
          isLoading ? (
            <div className="flex w-[300px] justify-center gap-3 max-md:flex-col max-md:w-full">
              <Skeleton className="h-9 w-[full] flex-1" />
              <Skeleton className="h-9 w-[full] flex-1" />
              <Skeleton className="h-9 w-[full] flex-1" />
              <Skeleton className="h-9 w-[full] flex-1" />
            </div>
          ) : (
            <Filters
              onFiltersChange={setFilters}
              schema={filteringSchema}
              filters={filters}
              fieldConfig={filteringConfig}
              formClassName="flex gap-4 items-start max-md:flex-col"
              className="flex items-start gap-x-4 max-md:flex-col max-md:gap-4"
            />
          )
        }
        secondaryActionSlot={
          <Button
            variant="outline"
            onClick={handleCreateCoverage}
            data-testid="create-coverage-button"
          >
            <span className="flex gap-2 items-center text-[0.875rem]">
              <Icon name="CirclePlus" color="currentColor" size="md" />
              <span>Create New Coverage</span>
            </span>
          </Button>
        }
      />
      <MainWrapper>
        <CoverageGrid
          data={filteredRows}
          pending={isLoading}
          loading={isLoading}
        />
      </MainWrapper>
      {isDialogOpen && <CoverageDialog />}
    </div>
  );
};
