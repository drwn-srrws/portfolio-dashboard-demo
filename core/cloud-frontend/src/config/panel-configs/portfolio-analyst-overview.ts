import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioAnalystOverviewPanelConfig: Config["portfolioAnalystOverviewPanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        orientation: Orientation.HORIZONTAL,
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
            size: 20,
          },
          {
            type: "branch",
            orientation: Orientation.VERTICAL,
            data: [
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
                    size: 50,
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
                    size: 50,
                  },
                ],
                size: 33,
              },
              {
                type: "branch",
                orientation: Orientation.HORIZONTAL,
                data: [
                  {
                    type: "leaf",
                    data: {
                      views: ["panel_3"],
                      activeView: "panel_3",
                      id: "3",
                      locked: true,
                      hideHeader: true,
                    },
                    size: 50,
                  },
                  {
                    type: "leaf",
                    data: {
                      views: ["panel_6"],
                      activeView: "panel_6",
                      id: "6",
                      locked: true,
                      hideHeader: true,
                    },
                    size: 50,
                  },
                  {
                    type: "leaf",
                    data: {
                      views: ["panel_7"],
                      activeView: "panel_7",
                      id: "7",
                      locked: true,
                      hideHeader: true,
                    },
                    size: 50,
                  },
                ],
                size: 33,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_5"],
                  activeView: "panel_5",
                  id: "5",
                  locked: true,
                  hideHeader: true,
                },
                size: 33,
              },
            ],
            size: 40,
          },
        ],
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        contentComponent: "PortfolioSummary",
        tabComponent: "props.defaultTabComponent",
        params: {
          columnSettings: {
            otherColumnOptions: [
              "net_exposure_percent",
              "primary_analyst_avatar",
              "secondary_analyst_avatars",
              "average_cost",
              "native_average_cost",
            ],
            defaultColumns: [
              "net_exposure_percent",
              "primary_analyst_avatar",
              "secondary_analyst_avatars",
              "average_cost",
              "native_average_cost",
            ],
          },
          groupBySettings: {
            otherGroupByOptions: [
              "company_security_code_portfolio_asset_class",
              "fund_name",
              "direction",
              "instrument_portfolio_asset_class",
              "illiquid_private",
              "market_cap",
            ],
          },
          nestedRowSettings: {
            defaultSubgroupBy: "company_security_code_portfolio_asset_class",
            defaultSubgroupByFallback: "instrument_security_code",
          },
          sortBySettings: {
            defaultSortByMetric: "net_exposure_percent",
            defaultSortDirection: "desc",
          },
        },
        title: "Portfolio Summary",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "FundPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          fundMetrics: [
            {
              name: "daily_pnl_percent_nav",
            },
            {
              name: "mtd_pnl_percent_nav",
            },
            {
              name: "qtd_pnl_percent_nav",
            },
            {
              name: "ytd_pnl_percent_nav",
            },
          ],
          benchmarkMetrics: [
            {
              name: "daily_benchmark_pnl_percent",
            },
            {
              name: "mtd_benchmark_pnl_percent",
            },
            {
              name: "qtd_benchmark_pnl_percent",
            },
            {
              name: "ytd_benchmark_pnl_percent",
            },
          ],
          fundIds: ["Flagship", "Innovation", "DemoBio"],
          columnsOrder: ["Flagship", "Innovation", "DemoBio"],
        },
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "BasketBreakdownTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultGroupByMetric: "name",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "Basket Breakdown",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "PerformanceOverview",
        tabComponent: "props.defaultTabComponent",
        params: {
          displayMetrics: [
            "cumulative_pnl_percent_nav",
            "cumulative_simple_alpha_pnl_percent_nav",
            "cumulative_net_adjusted_alpha_pnl_percent_nav",
          ],
          groupByMetrics: [
            "direction",
            "fund_name",
            "company_subsector",
            "instrument_portfolio_asset_class",
            "illiquid_private",
          ],
          defaultGroupByMetric: "fund_name",
          defaultDisplayMetric: "cumulative_pnl_percent_nav",
          filters: {},
          benchmarkSettings: {
            defaultBenchmark: "XBI US Equity",
          },
        },
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "MonthlyPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          columnSettings: {
            totalMetric: "cumulative_pnl_percent_nav",
          },
          groupBySettings: {
            otherGroupByOptions: ["fund_name", "market_cap", "direction"],
          },
          filterSettings: {
            filters: {},
          },
        },
        title: "Monthly Performance",
      },
      panel_6: {
        id: "panel_6",
        title: "MedTech Top Winners & Losers",
        contentComponent: "WinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10", "20"],
          groupByMetrics: [
            "company_security_code_portfolio_asset_class",
            "primary_analyst",
          ],
          defaultGroupByMetric: "company_security_code_portfolio_asset_class",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
          defaultSubgroupByFallback: "instrument_security_code",
          sortByMetric: "cumulative_pnl_percent_nav",
          metrics: ["cumulative_pnl_percent_nav", "cumulative_pnl"],
          defaultFilters: {
            company_subsector: ["Medical Technology"],
          },
          showPrecisionSelect: false,
          defaultPrecision: 2,
          showDateRangeSelect: true,
          showTopSelect: true,
        },
      },
      panel_7: {
        id: "panel_7",
        title: "Therapeutics Top Winners & Losers",
        contentComponent: "WinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10", "20"],
          groupByMetrics: [
            "company_security_code_portfolio_asset_class",
            "primary_analyst",
          ],
          showPrecisionSelect: false,
          defaultPrecision: 2,
          defaultGroupByMetric: "company_security_code_portfolio_asset_class",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
          defaultSubgroupByFallback: "instrument_security_code",
          sortByMetric: "cumulative_pnl_percent_nav",
          metrics: ["cumulative_pnl_percent_nav", "cumulative_pnl"],
          defaultFilters: {
            company_subsector: ["Therapeutics"],
          },
          showDateRangeSelect: true,
          showTopSelect: true,
        },
      },
    },
    activeGroup: "1",
  };
