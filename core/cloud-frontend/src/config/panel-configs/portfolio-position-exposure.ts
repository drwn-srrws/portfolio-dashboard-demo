import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioPositionExposurePagePanelConfig: Config["portfolioPositionExposurePagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        orientation: Orientation.HORIZONTAL,
        data: [
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_6"],
                  activeView: "panel_6",
                  id: "6",
                  locked: true,
                  hideHeader: true,
                },
                size: 400,
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
                size: 400,
              },
            ],
            size: 500,
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
                size: 180,
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
                size: 200,
              },
            ],
            size: 480,
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
            size: 630,
          },
        ],
      },
      width: 2000,
      height: 1000,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_6: {
        id: "panel_6",
        contentComponent: "FundSummaryTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultGroupByMetric: "name",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "Fund Summary",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "FundBreakdownTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultGroupByMetric: "name",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "panel_3",
      },
      panel_1: {
        id: "panel_1",
        contentComponent: "LiquiditySummary",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultMetrics: ["company_netted_gmv_percent_nav"],
          defaultGroupByMetric: "days_to_cover_binned",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
        },
        title: "panel_1",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "MarketCapDistributionTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultGroupByMetric: "company_netted_direction",
          defaultMetrics: ["company_netted_gmv_percent_nav"],
          defaultSubgroupBy: "market_cap",
        },
        title: "panel_2",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "AnalystBreakdownTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          primaryMetrics: [
            "primary_analyst_avatar",
            "net_exposure",
            "cumulative_pnl_percent_nav",
            "cumulative_alpha_pnl_percent",
          ],
          benchmarkIds: [],
          primaryGroupByMetrics: ["primary_analyst"],
          secondaryMetrics: [
            "secondary_analyst",
            "net_exposure",
            "cumulative_pnl_percent_nav",
            "cumulative_alpha_pnl_percent",
          ],
          secondaryGroupByMetrics: ["secondary_analyst"],
          defaultSortDirection: "desc",
        },
        title: "Analyst Breakdown",
      },
    },
    activeGroup: "3",
  };
