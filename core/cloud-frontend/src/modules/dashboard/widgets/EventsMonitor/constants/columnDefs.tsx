import { ColDef, ValueGetterParams } from "@ag-grid-community/core";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { Column } from "../types/Column";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { cellColor } from "@/utils/ag-grid/cells";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { Avatars } from "@/components/Avatars";
import {
  UserResponse,
  CompanyResponse,
  EventTrackerCatalogItem,
  MetricDisplayType,
  LoginResponse,
  CompanyEventEstimateResponse,
} from "@/api/types";
import { hyphenatedDate } from "@/utils/dates";
import { SoftDateCell } from "@/components/SoftDateCell";
import { WorkflowStatusCell } from "../cells/WorkflowStatusCell";
import { PriceTargetCell } from "../cells/PriceTargetCell";
import { WorkstreamCell, WorkstreamCellValue } from "../cells/WorkstreamCell";
import { PriceTargetCellValue } from "../types/PriceTargetTypes";
import { ImpliedEstimateCell } from "../cells/ImpliedEstimateCell";
import { EstimateCellValue } from "../types/EstimateTypes";
import { equals } from "ramda";
import { EventCell } from "../cells/EventCell";
import EventEstimateBar from "../components/EventEstimateBar";
import EstimateTooltipContent from "../components/EventEstimateBar/EstimateTooltipContent";
import { Tooltip as BarTooltip } from "@/components/Tooltip/Tooltip";
import { ProbabilitiesToDisplayStrings } from "@/typings/Probabilities";
import { AdvancedEventCell } from "../cells/AdvancedEventCell";
import { getEventTrackerData } from "../helpers/getEventTrackerData";
import { hasRole } from "@/utils/roleUtils";
import { RoleKinds } from "@/typings/Role";
import { ExtendedEventResponse } from "../components/EventsMonitorGrid/EventsMonitorDetailGrid";
import { IvolDot } from "@/components/IvolDot";
import { AnalystIvolStack } from "@/components/AnalystIvolStack";
import { Stoplight } from "@/components/Stoplight";

export const defaultColDef: ColDef = {
  flex: 1,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  resizable: false,
  headerClass: "scalable-table-header",
};

export const defaultDetailColDef: ColDef = {
  ...defaultColDef,
  sortable: true,
  minWidth: 100,
};

export const createCompanyColumnDefs = (
  selectedColumns?: string[],
  catalogFields: EventTrackerCatalogItem[] = [],
  account?: LoginResponse | null,
  isMobile?: boolean
): ColDef<CompanyResponse>[] => {
  const allColumns: ColDef<CompanyResponse>[] = [
    {
      colId: Column.Company,
      headerName: getEventTrackerData(catalogFields, "name")?.display_name,
      pinned: !isMobile,
      minWidth: 200,
      headerTooltip: getEventTrackerData(catalogFields, "name")?.description,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => ({
        name: params.data?.name || "",
        workflowStatus: params.data?.workflow_status || null,
        companyId: params.data?.id,
      }),
      equals,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        innerRenderer: WorkflowStatusCell,
        suppressCount: true,
      },
      tooltipField: "name",
      comparator: () => 0,
    },
    {
      colId: Column.Ticker,
      headerName:
        getEventTrackerData(catalogFields, "primary_instrument.security_code")
          ?.display_name || "Security Code",
      maxWidth: 90,
      pinned: !isMobile,
      headerTooltip:
        getEventTrackerData(catalogFields, "primary_instrument.security_code")
          ?.description || "Primary instrument security code",
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return params.data?.primary_instrument?.security_code || "";
      },
      comparator: () => 0,
    },
    {
      colId: Column.Workstream,
      headerName:
        getEventTrackerData(catalogFields, "workstream")?.display_name ||
        "Workstream",
      headerTooltip:
        getEventTrackerData(catalogFields, "workstream")?.description ||
        "Company workstream",
      minWidth: 120,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        if (!params.data) return null;
        const value: WorkstreamCellValue = {
          companyId: params.data.id,
          companyName: params.data.name || "",
          workstream: params.data.workstream || null,
        };
        return value;
      },
      equals,
      cellRenderer: WorkstreamCell,
      comparator: () => 0,
    },

    {
      colId: Column.Size,
      headerName: getEventTrackerData(catalogFields, "position_size")
        ?.display_name,
      headerTooltip: getEventTrackerData(catalogFields, "position_size")
        ?.description,
      maxWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return formatMetric(
          params.data?.position_size,
          MetricDisplayType.percent
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.YtdPnl,
      headerName: getEventTrackerData(
        catalogFields,
        "position_ytd_pnl_by_funds"
      )?.display_name,
      headerTooltip: getEventTrackerData(
        catalogFields,
        "position_ytd_pnl_by_funds"
      )?.description,
      hide: !hasRole(account?.roles, [
        RoleKinds.PortfolioManager,
        RoleKinds.Admin,
      ]),
      maxWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        const allFundData = params.data?.position_ytd_pnl_by_funds?.find(
          (item) => item.fund.name === "All" || item.fund.id === -1
        );
        return formatMetric(
          allFundData?.ytd_pnl,
          (getEventTrackerData(catalogFields, "position_ytd_pnl_by_funds")
            ?.display_type as MetricDisplayType) ?? MetricDisplayType.pnl
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.PrimaryAnalyst,
      headerName: getEventTrackerData(catalogFields, "primary_analyst.name")
        ?.display_name,
      field: "primary_analyst",
      maxWidth: 70,
      headerTooltip: getEventTrackerData(catalogFields, "primary_analyst.name")
        ?.description,
      cellRenderer: (params: { value: unknown }) => {
        if (!params.value) return "";
        const analyst = params.value as UserResponse;
        return (
          <div className="flex flex-col justify-center size-full -mt-0.5">
            <div className="flex items-center justify-start">
              <Avatars data={[analyst]} dense={false} />
            </div>
          </div>
        );
      },
    },
    {
      colId: Column.SecondaryAnalysts,
      headerName: getEventTrackerData(catalogFields, "secondary_analysts.name")
        ?.display_name,
      maxWidth: 80,
      headerTooltip: getEventTrackerData(
        catalogFields,
        "secondary_analysts.name"
      )?.description,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return params.data?.secondary_analysts || null;
      },
      cellRenderer: (params: { value: unknown }) => {
        if (!params.value) return "";
        const analysts = params.value as UserResponse[];
        return (
          <div className="flex flex-col justify-center size-full -mt-0.5">
            <div className="flex items-center justify-start">
              <Avatars data={analysts} dense={false} />
            </div>
          </div>
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.Coverage,
      headerName: getEventTrackerData(catalogFields, "research_analysts.name")
        ?.display_name,
      maxWidth: 120,
      headerTooltip: getEventTrackerData(
        catalogFields,
        "research_analysts.name"
      )?.description,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return params.data?.research_analysts || null;
      },
      cellRenderer: (params: { value: unknown }) => {
        if (!params.value) return "";
        const analysts = params.value as UserResponse[];
        return (
          <div className="flex flex-col justify-center size-full -mt-0.5">
            <div className="flex items-center justify-start">
              <Avatars data={analysts} dense={false} />
            </div>
          </div>
        );
      },
      comparator: () => 0,
    },
    {
      colId: Column.UpsidePt,
      headerName: getEventTrackerData(
        catalogFields,
        "primary_analyst_upside_price_target.price_target_usd"
      )?.display_name,
      headerTooltip: "12-month forward price targets",
      maxWidth: 70,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        if (!params.data) return null;

        const upsideTargets = params.data.upside_price_targets;
        const primaryTarget = params.data.primary_analyst_upside_price_target;

        const value: PriceTargetCellValue = {
          companyId: Number(params.data.id),
          companyName: params.data.name || "",
          type: "upside",
          displayValue: primaryTarget?.price_target_usd
            ? formatMetric(
                primaryTarget.price_target_usd,
                getEventTrackerData(
                  catalogFields,
                  "primary_analyst_upside_price_target.price_target_usd"
                )?.display_type as MetricDisplayType
              )
            : null,
          priceTargetData: primaryTarget
            ? {
                id: primaryTarget.id,
                price_target_usd: primaryTarget.price_target_usd,
                created_by: primaryTarget.created_by,
                created_at_utc: primaryTarget.created_at_utc,
              }
            : undefined,
          allPriceTargets: upsideTargets || [],
        };

        return value;
      },
      equals,
      cellRenderer: PriceTargetCell,
      comparator: () => 0,
    },
    {
      colId: Column.DownsidePt,
      headerName: getEventTrackerData(
        catalogFields,
        "primary_analyst_downside_price_target.price_target_usd"
      )?.display_name,
      headerTooltip: "12-month forward price targets",
      maxWidth: 90,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        if (!params.data) return null;

        const downsideTargets = params.data.downside_price_targets;
        const primaryTarget = params.data.primary_analyst_downside_price_target;

        const value: PriceTargetCellValue = {
          companyId: Number(params.data.id),
          companyName: params.data.name || "",
          type: "downside",
          displayValue: primaryTarget?.price_target_usd
            ? formatMetric(
                primaryTarget.price_target_usd,
                getEventTrackerData(
                  catalogFields,
                  "primary_analyst_downside_price_target.price_target_usd"
                )?.display_type as MetricDisplayType
              )
            : null,
          priceTargetData: primaryTarget
            ? {
                id: primaryTarget.id,
                price_target_usd: primaryTarget.price_target_usd,
                created_by: primaryTarget.created_by,
                created_at_utc: primaryTarget.created_at_utc,
              }
            : undefined,
          allPriceTargets: downsideTargets || [],
        };

        return value;
      },
      equals,
      cellRenderer: PriceTargetCell,
      comparator: () => 0,
    },
    {
      colId: Column.NextEvent,
      headerName: getEventTrackerData(catalogFields, "next_event.name")
        ?.display_name,
      headerTooltip: getEventTrackerData(catalogFields, "next_event.name")
        ?.description,
      flex: 0,
      width: 220,
      minWidth: 220,
      suppressSizeToFit: true,
      tooltipField: "next_event.name",
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return params.data?.next_event?.name || "";
      },
      cellRenderer: (params: CustomCellRendererProps<CompanyResponse>) =>
        AdvancedEventCell(params, "next_event"),
    },
    {
      colId: Column.NextBiggestEvent,
      headerName: getEventTrackerData(catalogFields, "next_biggest_event.name")
        ?.display_name,
      headerTooltip: getEventTrackerData(
        catalogFields,
        "next_biggest_event.name"
      )?.description,
      flex: 0,
      width: 220,
      minWidth: 220,
      suppressSizeToFit: true,
      tooltipField: "next_biggest_event.name",
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return params.data?.next_biggest_event?.name || "";
      },
      cellRenderer: (params: CustomCellRendererProps<CompanyResponse>) =>
        AdvancedEventCell(params, "next_biggest_event"),
    },
    {
      colId: Column.DaysUntilEvent,
      headerName: getEventTrackerData(
        catalogFields,
        "next_event.days_until_event"
      )?.display_name,
      headerTooltip: getEventTrackerData(
        catalogFields,
        "next_event.days_until_event"
      )?.description,
      maxWidth: 100,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        const days = params.data?.next_event?.days_until_event;
        return days !== undefined ? String(days) : "";
      },
    },
    {
      colId: Column.RiskReward,
      headerName:
        getEventTrackerData(catalogFields, "risk_reward")?.display_name ||
        "Risk/Reward",
      headerTooltip:
        getEventTrackerData(catalogFields, "risk_reward")?.description ||
        "Risk/Reward ratio",
      maxWidth: 120,
      valueGetter: (params: ValueGetterParams<CompanyResponse>) => {
        return params.data?.risk_reward;
      },
      valueFormatter: (params) => {
        return formatMetric(params.value, MetricDisplayType.float);
      },
      comparator: () => 0,
    },
  ];

  if (!selectedColumns || selectedColumns.length === 0) {
    return allColumns;
  }

  const essentialColumns = [Column.Company, Column.Ticker];
  const columnsToShow = [...new Set([...essentialColumns, ...selectedColumns])];

  return columnsToShow
    .map((columnId) => allColumns.find((col) => col.colId === columnId))
    .filter((col): col is ColDef<CompanyResponse> => col !== undefined);
};

export const createEventColumnDefs = (
  catalogFields: EventTrackerCatalogItem[] = [],
  isIvolEnabled = false
): ColDef<ExtendedEventResponse>[] => [
  {
    colId: Column.Date,
    headerName: getEventTrackerData(catalogFields, "events.date")?.display_name,
    field: "date",
    minWidth: 120,
    headerTooltip: getEventTrackerData(catalogFields, "events.date")
      ?.description,
    valueFormatter: (params) => {
      return params.value ? hyphenatedDate(new Date(params.value)) : "";
    },
    cellRenderer: (params: CustomCellRendererProps<ExtendedEventResponse>) => {
      if (!params.value) return "";
      const formatted = hyphenatedDate(new Date(params.value));
      return <SoftDateCell formatted={formatted} horizon={params.data} />;
    },
  },
  {
    colId: Column.Event,
    headerName: getEventTrackerData(catalogFields, "events.name")?.display_name,
    field: "name",
    minWidth: 200,
    headerTooltip: getEventTrackerData(catalogFields, "events.name")
      ?.description,
    tooltipField: "name",
    cellRenderer: EventCell,
  },
  {
    colId: Column.Description,
    headerName: getEventTrackerData(catalogFields, "events.description")
      ?.display_name,
    field: "description",
    minWidth: 250,
    headerTooltip: getEventTrackerData(catalogFields, "events.description")
      ?.description,
    tooltipField: "description",
  },
  {
    colId: Column.ImpliedUpside,
    headerName: getEventTrackerData(
      catalogFields,
      "events.estimate.implied_upside_price_usd"
    )?.display_name,
    minWidth: 130,
    headerTooltip: getEventTrackerData(
      catalogFields,
      "events.estimate.implied_upside_price_usd"
    )?.description,
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const estimate = params.data?.estimate;

      const value: EstimateCellValue = {
        type: "implied_upside",
        displayValue: estimate?.implied_upside_price_usd
          ? formatMetric(
              estimate.implied_upside_price_usd,
              getEventTrackerData(
                catalogFields,
                "events.estimate.implied_upside_price_usd"
              )?.display_type as MetricDisplayType
            )
          : null,
        eventId: params.data?.id || 0,
      };

      return value;
    },
    cellRenderer: ImpliedEstimateCell,
  },
  {
    colId: Column.ImpliedDownside,
    headerName: getEventTrackerData(
      catalogFields,
      "events.estimate.implied_downside_price_usd"
    )?.display_name,
    headerTooltip: getEventTrackerData(
      catalogFields,
      "events.estimate.implied_downside_price_usd"
    )?.description,
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const estimate = params.data?.estimate;

      const value: EstimateCellValue = {
        type: "implied_downside",
        displayValue: estimate?.implied_downside_price_usd
          ? formatMetric(
              estimate.implied_downside_price_usd,
              getEventTrackerData(
                catalogFields,
                "events.estimate.implied_downside_price_usd"
              )?.display_type as MetricDisplayType
            )
          : null,
        eventId: params.data?.id || 0,
      };

      return value;
    },
    cellRenderer: ImpliedEstimateCell,
  },
  {
    colId: Column.EstimateCount,
    headerName: "# of Estimates",
    maxWidth: 130,
    headerTooltip: "Number of estimates for this event",
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const allEstimates = params.data?.estimates;
      return allEstimates?.length || 0;
    },
    cellStyle: (params) => {
      const count = params.value || 0;
      return {
        color: count > 1 ? "#ef4444" : "inherit",
      };
    },
  },
  ...(isIvolEnabled
    ? [
        {
          colId: Column.Stoplights,
          headerName: "",
          headerTooltip: "iVol / analyst mismatch indicators",
          maxWidth: 105,
          cellRenderer: (
            params: CustomCellRendererProps<ExtendedEventResponse>
          ) => {
            const signals = params.data?.event_ivol_analyst_stoplights;
            if (!signals || signals.length === 0) return null;
            return (
              <Stoplight
                signals={signals}
                asOfDt={params.data?.event_ivol_as_of_dt}
              />
            );
          },
        } as ColDef<ExtendedEventResponse>,
      ]
    : []),
  {
    colId: Column.Estimate,
    headerName: isIvolEnabled ? "Estimate / Range" : "Estimate",
    minWidth: isIvolEnabled ? 290 : 240,
    headerClass: "scalable-table-header estimate-bar-cell-header",
    headerTooltip: getEventTrackerData(
      catalogFields,
      "events.estimate.downside_percentage"
    )?.description,
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const estimate = params.data?.estimate;
      const allEstimates = params.data?.estimates;
      return {
        downside: estimate?.latest_downside_percentage,
        upside: estimate?.latest_upside_percentage,
        allEstimates: allEstimates || [],
      };
    },
    cellRenderer: (
      params: CustomCellRendererProps<
        ExtendedEventResponse,
        {
          downside: number;
          upside: number;
          allEstimates: CompanyEventEstimateResponse[];
        }
      >
    ) => {
      const { downside, upside, allEstimates } = params.value || {};
      const ivolUpside = params.data?.event_ivol_range_implied_move_upside;
      const ivolDownside = params.data?.event_ivol_range_implied_move_downside;
      const ivolAsOfDt = params.data?.event_ivol_as_of_dt;

      const barCoefficient = 70;
      const hasIvolDots =
        isIvolEnabled && (ivolDownside != null || ivolUpside != null);

      if (downside == null || upside == null) {
        if ((allEstimates && allEstimates.length > 0) || hasIvolDots) {
          return (
            <div className="flex w-full items-center justify-center gap-2">
              {isIvolEnabled && (
                <IvolDot
                  value={ivolDownside}
                  direction="downside"
                  asOfDt={ivolAsOfDt}
                />
              )}
              {allEstimates && allEstimates.length > 0 ? (
                <BarTooltip
                  asChild
                  trigger={
                    <span className="text-center text-neutral-500 text-xs cursor-default select-none whitespace-nowrap">
                      No primary estimate
                    </span>
                  }
                  content={
                    <div className="space-y-4">
                      <EstimateTooltipContent
                        allEstimates={allEstimates}
                        isUpside={true}
                      />
                      <div className="border-t border-neutral-700 pt-3">
                        <EstimateTooltipContent
                          allEstimates={allEstimates}
                          isUpside={false}
                        />
                      </div>
                    </div>
                  }
                  contentClasses="bg-neutral-800 text-white rounded max-w-[20rem] break-words border border-neutral-600 shadow-md"
                  side="left"
                />
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
        return null;
      }

      return (
        <div className="flex w-full items-center justify-center gap-0">
          <div className="relative w-[90px] -translate-y-px">
            <EventEstimateBar
              percentage={-Math.abs(downside * 100)}
              coefficient={barCoefficient}
              isWin={false}
              allEstimates={allEstimates}
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
          <div className="relative w-[90px] -translate-y-px">
            <EventEstimateBar
              percentage={upside * 100}
              coefficient={barCoefficient}
              isWin={true}
              allEstimates={allEstimates}
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
        </div>
      );
    },
  },
  {
    colId: Column.UpPnlNav,
    headerName:
      getEventTrackerData(
        catalogFields,
        "events.estimate.event_estimate_upside_nav_impact"
      )?.display_name || "Up PnL (% NAV)",
    minWidth: 130,
    headerTooltip:
      getEventTrackerData(
        catalogFields,
        "events.estimate.event_estimate_upside_nav_impact"
      )?.description || "The upside PnL (% NAV) impact of the price estimate",
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const value = params.data?.estimate?.event_estimate_upside_nav_impact;
      return value !== null && value !== undefined ? value : null;
    },
    cellRenderer: (params: CustomCellRendererProps<ExtendedEventResponse>) => {
      const status = getValueStatusForMetric({
        value: params.value,
        metric: { display_type: MetricDisplayType.percent },
      });
      const formatted = formatMetric(params.value, MetricDisplayType.percent);

      return (
        <AnalystIvolStack
          isIvolEnabled={isIvolEnabled}
          analystValue={
            <span style={{ color: cellColor[status] }}>{formatted}</span>
          }
          ivol={{
            value: params.data?.event_ivol_implied_pnl_upside,
            asOfDt: params.data?.event_ivol_as_of_dt,
            tooltipLabel: "Implied Up PnL (% NAV)",
          }}
        />
      );
    },
    ...createFullPrecisionPercentTooltipProps({
      display_type: MetricDisplayType.percent,
    }),
  },
  {
    colId: Column.DownPnlNav,
    headerName:
      getEventTrackerData(
        catalogFields,
        "events.estimate.event_estimate_downside_nav_impact"
      )?.display_name || "Down PnL (% NAV)",
    minWidth: 130,
    headerTooltip:
      getEventTrackerData(
        catalogFields,
        "events.estimate.event_estimate_downside_nav_impact"
      )?.description || "The downside PnL (% NAV) impact of the price estimate",
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const value = params.data?.estimate?.event_estimate_downside_nav_impact;
      return value !== null && value !== undefined ? value : null;
    },
    cellRenderer: (params: CustomCellRendererProps<ExtendedEventResponse>) => {
      const status = getValueStatusForMetric({
        value: params.value,
        metric: { display_type: MetricDisplayType.percent },
      });
      const formatted = formatMetric(params.value, MetricDisplayType.percent);

      return (
        <AnalystIvolStack
          isIvolEnabled={isIvolEnabled}
          analystValue={
            <span style={{ color: cellColor[status] }}>{formatted}</span>
          }
          ivol={{
            value: params.data?.event_ivol_implied_pnl_downside,
            asOfDt: params.data?.event_ivol_as_of_dt,
            tooltipLabel: "Implied Down PnL (% NAV)",
          }}
        />
      );
    },
    ...createFullPrecisionPercentTooltipProps({
      display_type: MetricDisplayType.percent,
    }),
  },
  {
    colId: Column.LastUpdate,
    headerName: getEventTrackerData(
      catalogFields,
      "events.estimate.updated_at_utc"
    )?.display_name,
    headerTooltip: getEventTrackerData(
      catalogFields,
      "events.estimate.updated_at_utc"
    )?.description,
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const updatedAt = params.data?.estimate?.updated_at_utc;
      return updatedAt ? hyphenatedDate(new Date(updatedAt)) : "";
    },
  },
  {
    colId: Column.UpsidePos,
    headerName: getEventTrackerData(
      catalogFields,
      "events.estimate.upside_probability"
    )?.display_name,
    minWidth: 120,
    headerTooltip: getEventTrackerData(
      catalogFields,
      "events.estimate.upside_probability"
    )?.description,
    valueGetter: (params: ValueGetterParams<ExtendedEventResponse>) => {
      const probability = params.data?.estimate?.upside_probability;
      return probability
        ? ProbabilitiesToDisplayStrings[probability] || probability
        : "";
    },
    cellRenderer: (params: CustomCellRendererProps<ExtendedEventResponse>) => (
      <AnalystIvolStack
        isIvolEnabled={isIvolEnabled}
        analystValue={<span>{params.value || "-"}</span>}
        ivol={{
          value: params.data?.event_ivol_upside_probability,
          asOfDt: params.data?.event_ivol_as_of_dt,
          tooltipLabel: "Upside Probability (iVol)",
        }}
      />
    ),
  },
];
