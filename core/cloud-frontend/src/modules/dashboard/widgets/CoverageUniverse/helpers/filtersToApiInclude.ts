import { Filters } from "@/typings/Filters";
import { CompanyIncludes } from "@api/types";

export const filtersToApiInclude = (filters: Filters): CompanyIncludes[] => {
  const filterKeys = Object.keys(filters);
  return filterKeys.flatMap((key) => {
    const potentialIncludeKeys = key.includes(".") ? key.split(".") : [key];
    return potentialIncludeKeys
      .map(
        (potentialIncludeKey) =>
          CompanyIncludes[potentialIncludeKey as keyof typeof CompanyIncludes]
      )
      .filter(Boolean);
  }) as CompanyIncludes[];
};
