import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioPerformanceSummaryPagePanelConfig: Config["portfolioPerformanceSummaryPagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        data: [
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_3"],
                  activeView: "panel_3",
                  id: "1",
                  locked: true,
                  hideHeader: true,
                },
                size: 1,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_2"],
                  activeView: "panel_2",
                  id: "2",
                  locked: true,
                  hideHeader: true,
                },
                size: 1,
              },
            ],
            size: 2.5,
          },
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_1"],
                  activeView: "panel_1",
                  id: "3",
                  locked: true,
                  hideHeader: true,
                },
                size: 1,
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
                size: 1,
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
                size: 1,
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
                size: 1,
              },
            ],
            size: 3,
          },
        ],
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        title: "Top Winners & Losers (Analysts)",
        contentComponent: "WinnersAndLosersAnalysts",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10", "20"],
          metrics: ["primary_analyst_avatar", "cumulative_pnl_percent_nav"],
          sortByMetric: "cumulative_pnl_percent_nav",
          showAnalystTypeSelect: true,
        },
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
          showPrecisionSelect: true,
          defaultPrecision: 2,
          defaultGroupByMetric: "company_security_code_portfolio_asset_class",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
          defaultSubgroupByFallback: "instrument_security_code",
          sortByMetric: "cumulative_pnl_percent_nav",
          defaultFilters: {
            company_subsector: ["Medical Technology"],
          },
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
          showPrecisionSelect: true,
          defaultPrecision: 2,
          defaultGroupByMetric: "company_security_code_portfolio_asset_class",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
          defaultSubgroupByFallback: "instrument_security_code",
          sortByMetric: "cumulative_pnl_percent_nav",
          defaultFilters: {
            company_subsector: ["Therapeutics"],
          },
        },
      },
      panel_2: {
        id: "panel_2",
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
            "primary_analyst",
          ],
          defaultGroupByMetric: "fund_name",
          defaultDisplayMetric: "cumulative_pnl_percent_nav",
          benchmarkSettings: {
            defaultBenchmark: "XBI US Equity",
          },
        },
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "BattingAndSluggingTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultMetrics: [
            "primary_analyst_avatar",
            "total_number_of_trades",
            "number_of_wins",
            "number_of_losses",
            "avg_loss_pnl_percent_nav",
            "avg_win_pnl_percent_nav",
            "hit_rate",
            "slugging_ratio",
          ],
          defaultSortByMetric: "hit_rate",
          defaultSortDirection: "desc",
          defaultGroupByMetric: "primary_analyst",
          groupByMetrics: ["primary_analyst", "company_subsector", "direction"],
        },
      },
      panel_5: {
        id: "panel_5",
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
    },
    activeGroup: "2",
  };
