import { isAfter, isBefore } from "date-fns";
import { z } from "zod";

import { CoverageType } from "@api/types/index";
import { Selectable } from "@typings/Selectable";
import { filterRows, FiltersMap, toTitleCase } from "@/utils/index";
import { SelectAll } from "@/utils/forms";
import { CoverageRow } from "../hooks/useGetCoverages";

const coverageTypeLabels = Object.values(CoverageType).map(toTitleCase);

export const filteringSchema = z.object({
  search: z.string().default("").optional(),
  coverageType: z
    .enum([SelectAll.label, ...coverageTypeLabels])
    .default(SelectAll.label)
    .optional(),
  isCoverageActive: z.string().default("").optional(),
});

const coverageActiveOptions: Selectable[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const filteringConfig = {
  search: {
    inputProps: {
      placeholder: "Search analyst or company name",
    },
  },
  coverageType: {
    inputProps: {
      classes: "w-36",
      placeholder: SelectAll.label,
    },
  },
  isCoverageActive: {
    fieldType: "toggle" as const,
    inputProps: {
      options: coverageActiveOptions,
    },
  },
};

const getValues = (
  filters: { isCoverageActive?: string },
  row: CoverageRow
) => ({
  startDate: row.effective_start_date,
  endDate: row.effective_end_date,
  active: filters.isCoverageActive === "active",
});

const isDateAfterStartAndBeforeEnd = (startDate: Date, endDate?: Date) =>
  endDate && isAfter(new Date(), startDate) && isBefore(new Date(), endDate);
const thereIsNoEndDateAndItIsAfterTheStartDate = (
  startDate: Date,
  endDate?: Date
) => !endDate && isAfter(new Date(), startDate);

const filtersMap: FiltersMap<z.infer<typeof filteringSchema>, CoverageRow> = {
  search: () => (filters, rows) => {
    if (!filters.search || filters.search.length === 0) return rows;

    const searchTerm = filters.search.toLowerCase();

    return rows.filter((row) => {
      if (
        row.company.display_name &&
        row.company.display_name.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }

      const analystFullName =
        `${row.primary_analyst.first_name} ${row.primary_analyst.last_name}`.toLowerCase();
      if (analystFullName.includes(searchTerm)) {
        return true;
      }
      if (
        row.primary_analyst.first_name &&
        row.primary_analyst.first_name.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }

      if (
        row.primary_analyst.last_name &&
        row.primary_analyst.last_name.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }

      return false;
    });
  },
  coverageType: () => (filters, rows) => {
    if (filters.coverageType === SelectAll.label) return rows;
    return rows.filter(
      (row) =>
        row.coverage_type ===
        filters.coverageType?.toLowerCase().replace(/ /g, "_")
    );
  },
  isCoverageActive: () => (filters, rows) => {
    if (filters.isCoverageActive === undefined) return rows;
    else {
      return rows.filter((row) => {
        const { startDate, endDate, active } = getValues(filters, row);

        if (!startDate) return false;

        if (active) {
          return (
            thereIsNoEndDateAndItIsAfterTheStartDate(startDate, endDate) ||
            isDateAfterStartAndBeforeEnd(startDate, endDate)
          );
        } else {
          if (thereIsNoEndDateAndItIsAfterTheStartDate(startDate, endDate))
            return false;
          else return true;
        }
      });
    }
  },
};

export const filterCoverages = filterRows(filtersMap);
