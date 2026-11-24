import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const universeDashboardPagePanelConfig: Config["universeDashboardPagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        data: [
          {
            type: "leaf",
            data: {
              views: ["panel_stats"],
              activeView: "panel_stats",
              id: "stats",
              locked: true,
              hideHeader: true,
            },
            size: 41,
          },
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_1"],
                  activeView: "panel_1",
                  id: "1",
                  locked: true,
                  hideHeader: true,
                },
                size: 0.5,
              },
              {
                type: "branch",
                orientation: Orientation.HORIZONTAL,
                data: [
                  {
                    type: "leaf",
                    data: {
                      views: ["panel_2"],
                      activeView: "panel_2",
                      id: "2",
                      locked: true,
                      hideHeader: true,
                    },
                    size: 0.5,
                  },
                  {
                    type: "leaf",
                    data: {
                      views: ["panel_3"],
                      activeView: "panel_3",
                      id: "3",
                      locked: true,
                      hideHeader: true,
                    },
                    size: 0.5,
                  },
                ],
                size: 0.5,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_4"],
                  activeView: "panel_4",
                  id: "4",
                  locked: true,
                  hideHeader: true,
                },
                size: 0.5,
              },
            ],
            size: 656.515625,
            orientation: Orientation.VERTICAL,
          },
        ],
        size: 697.515625,
        orientation: Orientation.VERTICAL,
      },
      width: 1558.671875,
      height: 697.515625,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_stats: {
        id: "panel_stats",
        contentComponent: "UniverseDashboardStats",
        tabComponent: "props.defaultTabComponent",
        title: "Universe Stats",
        minimumHeight: 29,
        maximumHeight: 29,
        params: {
          includes: [
            "position_exposure",
            "market_cap_bbg",
            "ytd_percent_return_bbg",
          ],
          filter: {
            hiddenFilters: {
              op: "or",
              filters: [
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 3,
                },
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 7,
                },
              ],
            },
          },
        },
      },
      panel_1: {
        id: "panel_1",
        title: "Coverage Distribution",
        contentComponent: "CoverageDistribution",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultMetric: "market_cap_bbg",
          filter: {
            hiddenFilters: {
              op: "or",
              filters: [
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 3,
                },
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 7,
                },
              ],
            },
          },
        },
      },
      panel_2: {
        id: "panel_2",
        title: "Winners & Losers (Stock Price)",
        contentComponent: "CoverageMonitorWinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10"],
          sortByMetric: "ytd_percent_return_bbg",
          filter: {
            hiddenFilters: {
              op: "or",
              filters: [
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 3,
                },
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 7,
                },
              ],
            },
          },
        },
      },
      panel_3: {
        id: "panel_3",
        title: "Winners & Losers (Fund Impact)",
        contentComponent: "WinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10"],
          groupByMetrics: [
            "company_security_code_portfolio_asset_class",
            "primary_analyst",
          ],
          defaultGroupByMetric: "company_security_code_portfolio_asset_class",
          defaultSubgroupBy: "instrument_security_code",
          defaultSubgroupByFallback: "instrument_security_code",
          sortByMetric: "cumulative_pnl_percent_nav",
          showGroupBySelect: false,
        },
      },
      panel_4: {
        id: "panel_4",
        title: "Timeseries",
        contentComponent: "TimeSeriesChart",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10"],
          groupByMetrics: [
            "company_security_code_portfolio_asset_class",
            "primary_analyst",
          ],
          defaultGroupByMetric: "company_security_code_portfolio_asset_class",
          defaultSubgroupBy: "instrument_security_code",
          defaultSubgroupByFallback: "instrument_security_code",
          sortByMetric: "cumulative_pnl_percent_nav",
          showGroupBySelect: false,
          filter: {
            hiddenFilters: {
              op: "or",
              filters: [
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 3,
                },
                {
                  field: "subsector.id",
                  op: "eq",
                  value: 7,
                },
              ],
            },
          },
        },
      },
    },
    activeGroup: "1",
  };
