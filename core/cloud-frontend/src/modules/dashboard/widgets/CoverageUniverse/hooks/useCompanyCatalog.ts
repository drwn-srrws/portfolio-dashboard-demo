import {
  CompanyCatalogMetadata,
  RetrieveCompanyCatalogParams,
} from "@api/types";
import { useRetrieveCompanyCatalog } from "@api/endpoints/company/company";
import { useConfig } from "@providers/ConfigProvider";

export const useCompanyCatalog = (
  metadata?: CompanyCatalogMetadata,
  params?: RetrieveCompanyCatalogParams
) => {
  const config = useConfig();

  return useRetrieveCompanyCatalog(
    {
      filters: config.pages?.coverageMonitor?.hiddenFilters || undefined,
      ...metadata,
    },
    {
      include_filterable_values: true,
      ...params,
    }
  );
};
