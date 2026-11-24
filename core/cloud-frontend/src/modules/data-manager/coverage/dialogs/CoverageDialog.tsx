import { toast } from "@components/ui/use-toast";

import { CoverageType, HTTPError } from "@api/types/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { Close } from "@radix-ui/react-dialog";
import { Icon } from "@/components/Icon/Icon";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useStore } from "@/store";

import useEditCoverage from "../hooks/useEditCoverage";
import useCreateCoverage from "../hooks/useCreateCoverage";

import { useInfiniteCompanies } from "../hooks/useInfiniteCompanies";
import { useInfiniteUsers } from "../hooks/useInfiniteUsers";
import { convertCoverageRowToModel } from "../helpers/convertCoverageRowToModel";
import { FormInfiniteTextSelect } from "../form/InfiniteTextSelect";
import { Control, FormProvider, useForm } from "react-hook-form";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  coverageFormSchema,
  ICoverageValues,
  defaultCoverageValues,
} from "../schema/coverageSchema";
import { CoverageRow } from "../hooks/useGetCoverages";
import { capitalize } from "@/utils/strings";
import { AxiosError } from "axios";
import { useMemo } from "react";

export const CoverageDialog = () => {
  const { editCoverage, isLoading: isEditing } = useEditCoverage();
  const { createCoverage, isLoading: isCreating } = useCreateCoverage();
  const { updateDialog, prefilled: dialogPrefilled, dialogs } = useStore();
  const isOpen = dialogs[Dialogs.coverageDialog];
  const prefilled = dialogPrefilled as CoverageRow | null;

  const coverageId = prefilled?.id;
  const prefilledData = isOpen && coverageId ? prefilled : null;

  const initialValues = useMemo(
    () =>
      prefilledData
        ? {
            company: {
              value: String(prefilledData.company.id),
              label: prefilledData.company.display_name,
            },
            analyst: {
              value: String(prefilledData.primary_analyst.id),
              label: `${prefilledData.primary_analyst.first_name} ${prefilledData.primary_analyst.last_name}`,
            },
            coverageType: {
              value: prefilledData.coverage_type,
              label: capitalize(prefilledData.coverage_type),
            },
            effectiveStartDate:
              prefilledData.effective_start_date || new Date(),
            effectiveEndDate: prefilledData.effective_end_date,
          }
        : defaultCoverageValues,
    [prefilledData]
  );

  const form = useForm({
    defaultValues: initialValues,
    // @ts-expect-error - TODO: fix this
    resolver: zodResolver(coverageFormSchema),
  });

  const { handleSubmit } = form;

  const {
    companyOptions,
    debouncedSearchQuery: debouncedSearchQueryCompany,
    searchInputValue: searchInputValueCompany,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteCompanies({
    page: 1,
    page_size: 30,
  });

  const {
    userOptions,
    isFetchingNextPage: isFetchingNextUserPage,
    fetchNextPage: fetchNextUserPage,
    debouncedSearchQuery: debouncedSearchQueryUser,
    searchInputValue: searchInputValueUser,
  } = useInfiniteUsers({
    page: 1,
    page_size: 30,
  });

  const handleClose = useMemo(
    () => () => {
      updateDialog({ dialog: Dialogs.coverageDialog, status: false });
    },
    [updateDialog]
  );

  const onSubmit = async (formData: ICoverageValues) => {
    const model = convertCoverageRowToModel({
      coverageId: coverageId,
      companyId: Number(formData?.company?.value),
      userId: Number(formData?.analyst?.value),
      coverageType: formData?.coverageType?.value,
      effectiveStartDate: formData?.effectiveStartDate,
      effectiveEndDate: formData?.effectiveEndDate || undefined,
    });

    if (coverageId) {
      try {
        await editCoverage(coverageId, model);
        handleClose();
      } catch {
        toast({
          title: "Error",
          description: "Failed to update coverage",
          variant: "destructive",
        });
      }
    } else {
      try {
        await createCoverage(model);
        handleClose();
      } catch (error: unknown) {
        const axiosError = error as AxiosError<HTTPError>;
        toast({
          title: "Error creating coverage",
          description: axiosError.response?.data.detail,
          variant: "destructive",
        });
      }
    }
  };

  const isLoading = isEditing || isCreating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        isClose={false}
        className="flex h-full flex-col gap-0 border border-solid border-neutral-700 bg-[var(--neutral-900)] p-0"
      >
        <div className="h-full flex flex-col">
          <div
            className="flex flex-col gap-4 p-4 flex-1 min-h-0"
            data-testid="coverage-dialog"
          >
            <DialogHeader>
              <div className="flex items-center justify-between pb-3">
                <DialogTitle>
                  {coverageId ? "Edit Coverage" : "Create New Coverage"}
                </DialogTitle>
                <Close className="w-fit">
                  <div
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-700 transition-colors hover:bg-neutral-800"
                    onClick={handleClose}
                  >
                    <Icon name="X" color="currentColor" size="lg" />
                  </div>
                </Close>
              </div>
              <DialogDescription>
                {coverageId
                  ? "Update coverage details for this company and analyst."
                  : "Add a new coverage relationship between a company and an analyst."}
              </DialogDescription>
            </DialogHeader>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 flex-1 min-h-0"
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <FormInfiniteTextSelect
                      required
                      label="Company"
                      options={companyOptions || []}
                      control={form.control as Control<ICoverageValues>}
                      name="company"
                      placeholder="Select company"
                      isLoadingOptions={
                        isFetchingNextPage && !companyOptions?.length
                      }
                      isLoadingMore={isFetchingNextPage}
                      onLoadMore={fetchNextPage}
                      onSearchChange={debouncedSearchQueryCompany}
                      search={searchInputValueCompany}
                      testId="company-select"
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormInfiniteTextSelect
                      required
                      label="Analyst"
                      options={userOptions || []}
                      control={form.control as Control<ICoverageValues>}
                      name="analyst"
                      placeholder="Select analyst"
                      isLoadingOptions={
                        isFetchingNextUserPage && !userOptions?.length
                      }
                      isLoadingMore={isFetchingNextUserPage}
                      onLoadMore={fetchNextUserPage}
                      onSearchChange={debouncedSearchQueryUser}
                      search={searchInputValueUser}
                      testId="analyst-select"
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormInfiniteTextSelect
                      required
                      label="Coverage Type"
                      options={[
                        {
                          value: CoverageType.primary,
                          label: "Primary",
                        },
                        {
                          value: CoverageType.secondary,
                          label: "Secondary",
                        },
                        {
                          value: CoverageType.research,
                          label: "Research",
                        },
                        {
                          value: CoverageType.venture_analyst,
                          label: "Venture Analyst",
                        },
                      ]}
                      control={form.control as Control<ICoverageValues>}
                      name="coverageType"
                      placeholder="Select coverage type"
                      testId="coverage-type-select"
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormDatePicker
                      required
                      label="Effective Start Date"
                      control={form.control as Control<ICoverageValues>}
                      name="effectiveStartDate"
                      testId="effective-start-date-picker"
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormDatePicker
                      label="Effective End Date"
                      control={form.control as Control<ICoverageValues>}
                      name="effectiveEndDate"
                      testId="effective-end-date-picker"
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave blank if coverage is ongoing
                    </p>
                  </div>
                </div>

                <AlertDialogFooter className="p-4 sm:justify-between mt-auto">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={isLoading}
                    data-testid="coverage-dialog-save-button"
                  >
                    {isLoading ? "Saving..." : coverageId ? "Update" : "Create"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </FormProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
