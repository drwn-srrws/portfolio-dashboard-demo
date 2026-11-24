import { useMemo } from "react";
import { useLocalFilters } from "@providers/LocalFiltersProvider";
import { useFilters } from "@providers/FiltersProvider";
import { omitBy } from "@utils/omit";

export const useSharedFilters = () => {
  const { filters: globalFilters } = useFilters();
  const { filters: localFilters } = useLocalFilters();

  const filters = useMemo(
    () => ({
      ...globalFilters,
      ...omitBy(localFilters, (item) => !item.length),
    }),
    [globalFilters, localFilters]
  );

  return { filters };
};
