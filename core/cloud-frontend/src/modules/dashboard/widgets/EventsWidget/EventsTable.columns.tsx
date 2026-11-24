import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";
import { format } from "date-fns";

import { ProbabilitiesToDisplayStrings } from "@/typings/Probabilities";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import {
  MetricCatalogItem,
  MetricResult,
  MetricResultDataAnyOfItem,
} from "@api/types/index";

import { createNullableComparator } from "@/components/Datagrid/helpers/createNullableComparator";
import PercentageBar from "./PercentageBar";
import { parseDateString } from "@/utils";
import { SoftDateCell } from "@/components/SoftDateCell";
import { EventHorizonType } from "@/api/types/eventHorizonType";
import { getEventNameTooltip } from "./utils";
import { truncate } from "@/utils/strings";
import { Avatar } from "@components/Avatar";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { MultiAnalystTooltip } from "./components/MultiAnalystTooltip";
import {
  EstimateItem,
  getAllEstimates,
} from "./components/MultiAnalystTooltip/utils";
import { PrimaryEstimateValue } from "./components/PrimaryEstimateValue";
import { Stoplight } from "@/components/Stoplight";
import { StoplightSignal } from "@/api/types";
import { IvolDot } from "@/components/IvolDot";
import { AnalystIvolStack } from "@/components/AnalystIvolStack";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const getMetricData = (catalog: Array<MetricCatalogItem>, key: string) => {
  const metric = catalog.find((metric) => metric.name === key);
  return metric;
};

const createCustomEventColumns = (
  catalog: Array<MetricCatalogItem>,
  isIvolEnabled = false
) => {
  const renderPriceMovePct =
    (field: keyof EstimateItem) => (e: EstimateItem) => {
      const val = e[field];
      return typeof val === "number" ? formatMetric(val, "percent") : "-";
    };

  return {
    event_name: {
      headerName: getMetricData(catalog, "event_name")?.display_name,
      field: "event_name",
      resizable: true,
      headerTooltip: getMetricData(catalog, "event_name")?.description,
      minWidth: 180,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        return truncate(String(params.value || ""), 25);
      },
      tooltipValueGetter: getEventNameTooltip,
    },
    estimate: {
      headerName: isIvolEnabled ? "Estimate / Range" : "Estimate",
      field: "estimate",
      minWidth: 230,
      headerClass: "estimate-bar-cell-header",
      headerTooltip: [
        getMetricData(catalog, "event_estimate_upside_price_move_percent") &&
          `${getMetricData(catalog, "event_estimate_upside_price_move_percent")?.display_name}: ${getMetricData(catalog, "event_estimate_upside_price_move_percent")?.description}`,
        getMetricData(catalog, "event_estimate_downside_price_move_percent") &&
          `${getMetricData(catalog, "event_estimate_downside_price_move_percent")?.display_name}: ${getMetricData(catalog, "event_estimate_downside_price_move_percent")?.description}`,
      ]
        .filter(Boolean)
        .join("\n"),
      flex: 0,
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const left = params.data?.event_estimate_downside_price_move_percent as
          | number
          | undefined;

        const right = params.data?.event_estimate_upside_price_move_percent as
          | number
          | undefined;

        const eventEstimateId = params.data?._event_estimate_id as
          | string
          | undefined;

        const all_estimates = getAllEstimates(params.data ?? {});
        const ivolUpside = params.data?.event_ivol_range_implied_move_upside as
          | number
          | null
          | undefined;
        const ivolDownside = params.data
          ?.event_ivol_range_implied_move_downside as number | null | undefined;
        const ivolAsOfDt = params.data?.event_ivol_as_of_dt as
          | string
          | null
          | undefined;

        const barCoefficient = 70;
        const hasIvolDots =
          isIvolEnabled && (ivolDownside != null || ivolUpside != null);

        if (!eventEstimateId || left == null || right == null) {
          if (all_estimates.length === 0 && !hasIvolDots) return null;
          return (
            <div className="flex w-full items-center justify-center gap-2">
              {isIvolEnabled && (
                <IvolDot
                  value={ivolDownside}
                  direction="downside"
                  asOfDt={ivolAsOfDt}
                />
              )}
              {all_estimates.length > 0 ? (
                <MultiAnalystTooltip
                  estimates={all_estimates}
                  title="Down/Up Estimates"
                  renderEventEstimateField={(e) => {
                    const dn = e.event_estimate_downside_price_move_percent;
                    const up = e.event_estimate_upside_price_move_percent;
                    return `${dn != null ? formatMetric(dn, "percent") : "-"} / ${up != null ? formatMetric(up, "percent") : "-"}`;
                  }}
                >
                  <span className="text-center text-neutral-500 text-xs cursor-default select-none whitespace-nowrap">
                    No primary
                  </span>
                </MultiAnalystTooltip>
              ) : null}
              {isIvolEnabled && (
                <IvolDot
                  value={ivolUpside}
                  direction="upside"
                  asOfDt={ivolAsOfDt}
                />
              )}
            </div>
          );
        }

        return (
          <div className="flex w-full items-center justify-center gap-1">
            <MultiAnalystTooltip
              estimates={all_estimates}
              title="Downside Estimates"
              side="left"
              renderEventEstimateField={renderPriceMovePct(
                "event_estimate_downside_price_move_percent"
              )}
            >
              <div className="relative w-[80px] -translate-y-px">
                <PercentageBar
                  percentage={left * 100}
                  coefficient={barCoefficient}
                  isWin={false}
                />
                {isIvolEnabled && (
                  <IvolDot
                    value={ivolDownside}
                    direction="downside"
                    asOfDt={ivolAsOfDt}
                    barCoefficient={barCoefficient}
                  />
                )}
              </div>
            </MultiAnalystTooltip>
            <MultiAnalystTooltip
              estimates={all_estimates}
              title="Upside Estimates"
              side="right"
              renderEventEstimateField={renderPriceMovePct(
                "event_estimate_upside_price_move_percent"
              )}
            >
              <div className="relative w-[80px] -translate-y-px">
                <PercentageBar
                  percentage={right * 100}
                  coefficient={barCoefficient}
                  isWin={true}
                />
                {isIvolEnabled && (
                  <IvolDot
                    value={ivolUpside}
                    direction="upside"
                    asOfDt={ivolAsOfDt}
                    barCoefficient={barCoefficient}
                  />
                )}
              </div>
            </MultiAnalystTooltip>
          </div>
        );
      },
    },
    date: {
      headerName: getMetricData(catalog, "date")?.display_name,
      headerTooltip: getMetricData(catalog, "date")?.description,
      field: "date",
      minWidth: 55,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        if (!params.value) return "";
        const date = parseDateString(params.value);

        if (!date) return "";

        return format(date, "MMM d");
      },
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        if (!params.value) return "";
        const date = parseDateString(params.value as string | Date);

        if (!date) return "";

        const formatted = format(date, "MMM d");

        const startDate = params.data?.event_start_date;
        const endDate = params.data?.event_end_date;
        const horizonType = params.data?.event_horizon_type;

        const horizon =
          startDate && endDate && horizonType
            ? {
                start_date: String(startDate),
                end_date: String(endDate),
                horizon_type: horizonType as EventHorizonType,
              }
            : null;

        return <SoftDateCell formatted={formatted} horizon={horizon} />;
      },
      cellStyle: {
        ...defaultStyle,
      },
    },
    event_estimate_upside_probability: {
      headerName: getMetricData(catalog, "event_estimate_upside_probability")
        ?.display_name,
      headerTooltip: getMetricData(catalog, "event_estimate_upside_probability")
        ?.description,
      field: "event_estimate_upside_probability",
      minWidth: isIvolEnabled ? 70 : 60,
      cellStyle: {
        ...defaultStyle,
      },
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const formatProbability = (v: string | null | undefined) =>
          v ? (ProbabilitiesToDisplayStrings[v.toUpperCase()] ?? "-") : "-";
        const all_estimates = getAllEstimates(params.data ?? {});
        return (
          <AnalystIvolStack
            isIvolEnabled={isIvolEnabled}
            analystValue={
              <MultiAnalystTooltip
                estimates={all_estimates}
                title="Upside Probability"
                renderEventEstimateField={(e) =>
                  formatProbability(e.event_estimate_upside_probability)
                }
              >
                <PrimaryEstimateValue
                  primaryValue={params.value}
                  formattedValue={formatProbability(params.value)}
                  hasOtherEstimates={all_estimates.length > 0}
                />
              </MultiAnalystTooltip>
            }
            ivol={{
              value: params.data?.event_ivol_upside_probability as
                | number
                | null
                | undefined,
              asOfDt: params.data?.event_ivol_as_of_dt as
                | string
                | null
                | undefined,
              tooltipLabel: "Upside Probability (iVol)",
            }}
          />
        );
      },
    },
    event_estimate_up_down_ratio: {
      headerName: getMetricData(catalog, "event_estimate_up_down_ratio")
        ?.display_name,
      headerTooltip: getMetricData(catalog, "event_estimate_up_down_ratio")
        ?.description,
      field: "event_estimate_up_down_ratio",
      minWidth: 60,
      comparator: createNullableComparator<string>((a, b) => {
        const [numA, denA] = a.split(":").map(Number);
        const [numB, denB] = b.split(":").map(Number);

        return numA / denA - numB / denB;
      }),
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const formatRatio = (v: string | null | undefined) => v ?? "-";
        const all_estimates = getAllEstimates(params.data ?? {});
        return (
          <MultiAnalystTooltip
            estimates={all_estimates}
            title="Up/Down Ratio"
            renderEventEstimateField={(e) =>
              formatRatio(e.event_estimate_up_down_ratio)
            }
          >
            <PrimaryEstimateValue
              primaryValue={params.value}
              formattedValue={formatRatio(params.value)}
              hasOtherEstimates={all_estimates.length > 0}
            />
          </MultiAnalystTooltip>
        );
      },
    },
    event_estimate_upside_nav_impact: {
      headerName: getMetricData(catalog, "event_estimate_upside_nav_impact")
        ?.display_name,
      headerTooltip: getMetricData(catalog, "event_estimate_upside_nav_impact")
        ?.description,
      field: "event_estimate_upside_nav_impact",
      minWidth: isIvolEnabled ? 70 : 50,
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric: { display_type: "percent" },
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const formatNavImpact = (v: number | null | undefined) =>
          formatMetric(v, "percent");
        const all_estimates = getAllEstimates(params.data ?? {});
        return (
          <AnalystIvolStack
            isIvolEnabled={isIvolEnabled}
            analystValue={
              <MultiAnalystTooltip
                estimates={all_estimates}
                title="Upside NAV Impact"
                renderEventEstimateField={(e) =>
                  formatNavImpact(e.event_estimate_upside_nav_impact)
                }
              >
                <PrimaryEstimateValue
                  primaryValue={params.value}
                  formattedValue={formatNavImpact(params.value)}
                  hasOtherEstimates={all_estimates.length > 0}
                />
              </MultiAnalystTooltip>
            }
            ivol={{
              value: params.data?.event_ivol_implied_pnl_upside as
                | number
                | null
                | undefined,
              asOfDt: params.data?.event_ivol_as_of_dt as
                | string
                | null
                | undefined,
              tooltipLabel: "Implied Up PnL (% NAV)",
            }}
          />
        );
      },
    },
    event_estimate_downside_nav_impact: {
      headerName: getMetricData(catalog, "event_estimate_downside_nav_impact")
        ?.display_name,
      headerTooltip: getMetricData(
        catalog,
        "event_estimate_downside_nav_impact"
      )?.description,
      field: "event_estimate_downside_nav_impact",
      minWidth: isIvolEnabled ? 70 : 50,
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric: { display_type: "percent" },
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const formatNavImpact = (v: number | null | undefined) =>
          formatMetric(v, "percent");
        const all_estimates = getAllEstimates(params.data ?? {});
        return (
          <AnalystIvolStack
            isIvolEnabled={isIvolEnabled}
            analystValue={
              <MultiAnalystTooltip
                estimates={all_estimates}
                title="Downside NAV Impact"
                renderEventEstimateField={(e) =>
                  formatNavImpact(e.event_estimate_downside_nav_impact)
                }
              >
                <PrimaryEstimateValue
                  primaryValue={params.value}
                  formattedValue={formatNavImpact(params.value)}
                  hasOtherEstimates={all_estimates.length > 0}
                />
              </MultiAnalystTooltip>
            }
            ivol={{
              value: params.data?.event_ivol_implied_pnl_downside as
                | number
                | null
                | undefined,
              asOfDt: params.data?.event_ivol_as_of_dt as
                | string
                | null
                | undefined,
              tooltipLabel: "Implied Down PnL (% NAV)",
            }}
          />
        );
      },
    },
    event_estimate_last_updated_date: {
      headerName: getMetricData(catalog, "event_estimate_last_updated_date")
        ?.display_name,
      field: "event_estimate_last_updated_date",
      headerTooltip: getMetricData(catalog, "event_estimate_last_updated_date")
        ?.description,
      minWidth: 85,
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const formatLastUpdated = (v: string | null | undefined) => {
          if (!v) return "-";
          const date = parseDateString(v);
          return date ? format(date, "MMM d") : "-";
        };
        const all_estimates = getAllEstimates(params.data ?? {});
        return (
          <MultiAnalystTooltip
            estimates={all_estimates}
            title="Last Updated"
            renderEventEstimateField={(e) =>
              formatLastUpdated(e.event_estimate_last_updated_date)
            }
          >
            <PrimaryEstimateValue
              primaryValue={params.value}
              formattedValue={formatLastUpdated(params.value)}
              hasOtherEstimates={all_estimates.length > 0}
            />
          </MultiAnalystTooltip>
        );
      },
    },
    num_estimates: {
      headerName: "# Of Estimates",
      colId: "num_estimates",
      valueGetter: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) =>
        getAllEstimates(params.data ?? {}).length,
      maxWidth: 80,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) =>
        params.value > 0 ? String(params.value) : "",
      cellStyle: (params: ValueFormatterParams<MetricResult>) => ({
        ...defaultStyle,
        color: params.value > 1 ? "var(--red-100)" : undefined,
      }),
    },
    primary_analyst_avatar: {
      headerName: getMetricData(catalog, "primary_analyst_avatar")
        ?.display_name,
      field: "primary_analyst_avatar",
      headerTooltip: getMetricData(catalog, "primary_analyst_avatar")
        ?.description,
      maxWidth: 75,
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        if (!params.data?.primary_analyst_avatar) {
          return "-";
        }

        const primaryAnalystAvatar = String(
          params.data?.primary_analyst_avatar
        );

        const data = {
          email: primaryAnalystAvatar?.split("|")[0],
          first_name: primaryAnalystAvatar?.split("|")[1],
          last_name: primaryAnalystAvatar?.split("|")[2],
        };

        return (
          <div className="flex justify-center items-center w-full h-full">
            <Avatar data={data} />
          </div>
        );
      },
    },
    event_ivol_analyst_stoplights: {
      headerName:
        getMetricData(catalog, "event_ivol_analyst_stoplights")?.display_name ||
        "",
      headerTooltip: getMetricData(catalog, "event_ivol_analyst_stoplights")
        ?.description,
      field: "event_ivol_analyst_stoplights",
      minWidth: 105,
      cellStyle: {
        ...defaultStyle,
      },
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const signals = (params.value ?? []) as StoplightSignal[];
        if (signals.length === 0) return null;
        return (
          <Stoplight
            signals={signals}
            asOfDt={
              params.data?.event_ivol_as_of_dt as string | null | undefined
            }
          />
        );
      },
    },
  };
};

export const createEventColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  columnsOrder: string[],
  isIvolEnabled = false
) => {
  const customEventColumns = createCustomEventColumns(
    selectedMetrics,
    isIvolEnabled
  );

  const mainColumns = columnsOrder.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);
    const column = customEventColumns[key as keyof typeof customEventColumns];

    if (column) {
      return column;
    }

    return {
      colId: metric?.name,
      headerName: metric?.display_name || key,
      field: metric?.name,
      resizable: true,
      headerTooltip: metric?.description || metric?.display_name,
      minWidth: key.includes("actual_nav_impact") ? 60 : undefined,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        return metric?.display_type
          ? formatMetric(params.value, metric?.display_type)
          : "";
      },
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });

  return (mainColumns as ColDef[])
    .map((column) => ({
      ...column,
      cellClass: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) => {
        return params.data?.event_is_passed
          ? "event-passed"
          : "event-not-passed";
      },
    }))
    .flat();
};
