import { assoc, groupBy, map, mergeAll } from "ramda";

import { MetricResultData } from "@api/types/index";

export type MetricResultDataItem = {
  company_security_code_portfolio_asset_class: string;
  fund_name: string;
  net_exposure_percent: number;
  [key: string]: unknown;
};

export type TransformedRowData = {
  id: string;
  company_security_code_portfolio_asset_class: string;
  [key: string]: string | number;
};

export const transformToRowsData = (
  data?: MetricResultData
): TransformedRowData[] => {
  if (!data) return [];

  return Object.values(
    map(
      (items: MetricResultDataItem[]) =>
        items.reduce<TransformedRowData>(
          (acc, item, idx) =>
            mergeAll([
              acc,
              {
                id: `${item.company_security_code_portfolio_asset_class}-${idx}`,
                company_security_code_portfolio_asset_class:
                  item.company_security_code_portfolio_asset_class,
              },
              assoc(item.fund_name, item.net_exposure_percent, {}),
            ]) as TransformedRowData,
          {} as TransformedRowData
        ),
      groupBy(
        (item: MetricResultDataItem) =>
          item.company_security_code_portfolio_asset_class,
        data as MetricResultDataItem[]
      ) as { [key: string]: MetricResultDataItem[] }
    )
  ) as TransformedRowData[];
};
