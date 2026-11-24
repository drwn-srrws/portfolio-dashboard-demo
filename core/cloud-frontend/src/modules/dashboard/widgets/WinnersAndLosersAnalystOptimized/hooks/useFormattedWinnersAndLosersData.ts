import { useMemo } from "react";
import {
  MetricCatalogItem,
  TopWinnersAndLosersAnalystResponse,
} from "@api/types/index";
import {
  buildNestedRows,
  getMetricNamesFromResponse,
} from "../utils/buildNestedRows";
import { createWinnersAndLosersColumns } from "../utils/createColumns";

interface UseFormattedWinnersAndLosersDataParams {
  winnersResponses: TopWinnersAndLosersAnalystResponse[];
  losersResponses: TopWinnersAndLosersAnalystResponse[];
  metricsCatalog: MetricCatalogItem[];
}

export const useFormattedWinnersAndLosersData = ({
  winnersResponses,
  losersResponses,
  metricsCatalog,
}: UseFormattedWinnersAndLosersDataParams) => {
  const winnersRows = useMemo(
    () => buildNestedRows(winnersResponses),
    [winnersResponses]
  );

  const losersRows = useMemo(
    () => buildNestedRows(losersResponses),
    [losersResponses]
  );

  const metricNames = useMemo(
    () =>
      getMetricNamesFromResponse(
        winnersResponses.length ? winnersResponses : losersResponses
      ),
    [winnersResponses, losersResponses]
  );

  const columns = useMemo(
    () =>
      metricNames.length
        ? createWinnersAndLosersColumns(metricsCatalog, metricNames)
        : [],
    [metricsCatalog, metricNames]
  );

  return { winnersRows, losersRows, columns };
};
