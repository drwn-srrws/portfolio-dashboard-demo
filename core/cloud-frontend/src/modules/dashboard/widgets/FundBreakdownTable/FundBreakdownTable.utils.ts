import { MetricResult, MetricRequest } from "@api/types";
import { Filters } from "@typings/Filters";
import { MetricFlags } from "@typings/MetricFlags";

type GetFundBreakdownArgs = {
  startDate: string;
  endDate: string;
  metricFlags: MetricFlags;
  filters: Filters;
};

export const getFundBreakdownRequest = ({
  startDate,
  endDate,
  metricFlags,
  filters,
}: GetFundBreakdownArgs): MetricRequest[] => [
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: {
      ...filters,
      illiquid_private: [false],
      company_netted_direction: ["Long"],
    },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: {
      ...filters,
      illiquid_private: [false],
      company_netted_direction: ["Long"],
    },
    group_by: ["company_security_code_portfolio_asset_class"],
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: { ...filters, illiquid_private: [true] },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: { ...filters, illiquid_private: [true] },
    group_by: ["company_security_code_portfolio_asset_class"],
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: {
      ...filters,
      illiquid_private: [false],
      company_netted_direction: ["Short"],
    },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: {
      ...filters,
      illiquid_private: [false],
      company_netted_direction: ["Short"],
    },
    group_by: ["company_security_code_portfolio_asset_class"],
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: { ...filters, illiquid_private: [false] },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: { ...filters, illiquid_private: [false] },
    group_by: ["company_security_code_portfolio_asset_class"],
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "company_netted_gmv_percent_nav" }],
    filters: { ...filters },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "company_netted_gmv_percent_nav" }],
    filters: { ...filters },
    group_by: ["company_security_code_portfolio_asset_class"],
    start_date: startDate,
    end_date: endDate,
  },

  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: { ...filters, company_netted_direction: ["Long"] },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "net_exposure_percent" }],
    filters: { ...filters, company_netted_direction: ["Long"] },
    group_by: ["company_security_code_portfolio_asset_class"],
    start_date: startDate,
    end_date: endDate,
  },

  ...(metricFlags.explode_composites
    ? [
        {
          metrics: [{ name: "net_exposure_percent" }],
          filters: { ...filters, whale_minnow_tag: ["Minnow"] },
          start_date: startDate,
          end_date: endDate,
        },
        {
          metrics: [{ name: "net_exposure_percent" }],
          filters: { ...filters, whale_minnow_tag: ["Minnow"] },
          group_by: ["instrument_security_code"],
          start_date: startDate,
          end_date: endDate,
        },
      ]
    : []),
];

export const transformFundBreakdownResponse = (
  response: MetricResult[],
  metricFlags: MetricFlags
) => {
  const rows = [
    {
      name: "Gross Long",
      value: response[0]?.data?.[0]?.net_exposure_percent,
      nested: response[1]?.data?.map((item) => ({
        name: item.company_security_code_portfolio_asset_class,
        value: item.net_exposure_percent,
      })),
    },
    {
      name: "Illiquid Privates",
      value: response[2]?.data?.[0]?.net_exposure_percent,
      nested: response[3]?.data?.map((item) => ({
        name: item.company_security_code_portfolio_asset_class,
        value: item.net_exposure_percent,
      })),
    },
    {
      name: "Gross Short",
      value: response[4]?.data?.[0]?.net_exposure_percent,
      nested: response[5]?.data?.map((item) => ({
        name: item.company_security_code_portfolio_asset_class,
        value: item.net_exposure_percent,
      })),
    },
    {
      name: "Net Exposure",
      value: response[6]?.data?.[0]?.net_exposure_percent,
      nested: response[7]?.data?.map((item) => ({
        name: item.company_security_code_portfolio_asset_class,
        value: item.net_exposure_percent,
      })),
    },
    {
      name: "Gross Exposure",
      value: response[8]?.data?.[0]?.company_netted_gmv_percent_nav,
      nested: response[9]?.data?.map((item) => ({
        name: item.company_security_code_portfolio_asset_class,
        value: item.company_netted_gmv_percent_nav,
      })),
    },
    {
      name: "Total Long",
      value: response[10]?.data?.[0]?.net_exposure_percent,
      nested: response[11]?.data?.map((item) => ({
        name: item.company_security_code_portfolio_asset_class,
        value: item.net_exposure_percent,
      })),
    },

    ...(metricFlags.explode_composites
      ? [
          {
            name: "Minnows",
            value: response[12]?.data?.[0]?.net_exposure_percent,
            nested: response[13]?.data?.map((item) => ({
              name: item.instrument_security_code,
              value: item.net_exposure_percent,
            })),
          },
        ]
      : []),
  ];

  const transformedData = rows.map((row) => ({
    name: row.name,
    value: row.value,
  }));

  const nestedData = rows.flatMap((row) => {
    if (!row.nested) {
      return [];
    }
    return row.nested.map((nestedRow) => ({
      name: row.name,
      company_security_code_portfolio_asset_class: nestedRow.name,
      value: nestedRow.value,
    }));
  });

  return { transformedData, nestedData };
};
