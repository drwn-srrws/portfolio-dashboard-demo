import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioHistoricalPerformancePagePanelConfig: Config["portfolioHistoricalPerformancePagePanelConfig"] =
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
                  views: ["panel_4"],
                  activeView: "panel_4",
                  id: "4",
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
            ],
            size: 1,
            orientation: Orientation.VERTICAL,
          },
          {
            type: "branch",
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
                size: 1,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_1"],
                  activeView: "panel_1",
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
            size: 1,
            orientation: Orientation.VERTICAL,
          },
        ],
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_4: {
        id: "panel_4",
        contentComponent: "LongitudinalAlphaAnalysisWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByMetrics: [
            "fund_name",
            "primary_analyst",
            "secondary_analyst",
            "company_subsector",
            "market_cap",
          ],
          defaultGroupByMetric: "fund_name",
          defaultBenchmarkId: "XBI US Equity",
        },
        title: "Monthly Alpha PnL",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "LongitudinalAlphaAnalysisWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            portfolio_team: ["Medical Technology"],
          },
          groupByMetrics: [
            "fund_name",
            "primary_analyst",
            "secondary_analyst",
            "company_subsector",
            "market_cap",
          ],
          defaultGroupByMetric: "fund_name",
          defaultBenchmarkId: "XHE US Equity",
        },
        title: "MedTech Monthly Alpha PnL",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "LongitudinalAlphaAnalysisWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            portfolio_team: ["Therapeutics"],
          },
          groupByMetrics: [
            "fund_name",
            "primary_analyst",
            "secondary_analyst",
            "company_subsector",
            "market_cap",
          ],
          defaultGroupByMetric: "fund_name",
          defaultBenchmarkId: "XBI US Equity",
        },
        title: "Therapeutics Monthly Alpha PnL",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "MonthlyPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          totalMetric: "cumulative_pnl_percent_nav",
          groupByMetrics: [
            "fund_name",
            "market_cap",
            "primary_analyst",
            "direction",
          ],
          defaultGroupByMetric: "fund_name",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "Monthly Performance",
      },
      panel_1: {
        id: "panel_1",
        contentComponent: "MonthlyPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Medical Technology"],
          },
          totalMetric: "cumulative_pnl_percent_nav",
          groupByMetrics: [
            "fund_name",
            "market_cap",
            "primary_analyst",
            "direction",
          ],
          defaultGroupByMetric: "fund_name",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "MedTech Monthly Performance",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "MonthlyPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Therapeutics"],
          },
          totalMetric: "cumulative_pnl_percent_nav",
          groupByMetrics: [
            "fund_name",
            "market_cap",
            "primary_analyst",
            "direction",
          ],
          defaultGroupByMetric: "fund_name",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "Therapeutics Monthly Performance",
      },
    },
    activeGroup: "2",
  };
