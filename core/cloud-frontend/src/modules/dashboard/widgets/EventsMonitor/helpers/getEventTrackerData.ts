import { EventTrackerCatalogItem } from "@api/types";

export const getEventTrackerData = (
  catalog: Array<EventTrackerCatalogItem>,
  key: string
) => {
  const metric = catalog.find((metric) => metric.name === key);
  return metric;
};
