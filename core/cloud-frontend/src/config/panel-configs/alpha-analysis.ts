import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const alphaAnalysisPagePanelConfig: Config["alphaAnalysisPagePanelConfig"] =
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
                  id: "1",
                  locked: true,
                  hideHeader: true,
                },
                size: 1,
              },
            ],
            size: 1,
          },
          {
            type: "branch",
            data: [
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
          },
        ],
        size: 697.515625,
      },
      width: 1558.671875,
      height: 697.515625,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        contentComponent: "AlphaAnalysisWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultBenchmarkId: "XBI US Equity",
        },
        title: "Alpha Analysis",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "AlphaMergedAnalystBreakdown",
        tabComponent: "props.defaultTabComponent",
        title: "Analyst Breakdown",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "MedTechAnalystPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          metrics: [
            "average_net_exposure",
            "cumulative_pnl_percent_nav",
            "cumulative_alpha_pnl_percent",
            "cumulative_group_pnl_percent",
            "cumulative_pnl",
          ],
          defaultSortByMetric: "average_net_exposure",
          benchmarkIds: ["DJSMDQT Index", "XHE US Equity"],
          defaultSortDirection: "desc",
          defaultFilters: {
            portfolio_team: ["Medical Technology"],
          },
          columnsOrder: [
            "primary_analyst_avatar",
            "average_net_exposure",
            "cumulative_group_pnl_percent",
            "DJSMDQT Index",
            "XHE US Equity",
            "cumulative_pnl_percent_nav",
            "cumulative_pnl",
          ],
          defaultBenchmarkId: "XBI US Equity",
        },
        title: "MedTech Analyst Breakdown",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "TherapeuticsAnalystPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          metrics: [
            "average_net_exposure",
            "cumulative_pnl_percent_nav",
            "cumulative_alpha_pnl_percent",
            "cumulative_group_pnl_percent",
            "cumulative_pnl",
          ],
          defaultSortByMetric: "average_net_exposure",
          benchmarkIds: ["XBI US Equity", "RGUSHSBT Index"],
          defaultSortDirection: "desc",
          defaultFilters: {
            portfolio_team: ["Therapeutics"],
          },
          columnsOrder: [
            "primary_analyst_avatar",
            "average_net_exposure",
            "cumulative_group_pnl_percent",
            "XBI US Equity",
            "RGUSHSBT Index",
            "cumulative_pnl_percent_nav",
            "cumulative_pnl",
          ],
        },
        title: "Therapeutics Analyst Breakdown",
      },
    },
    activeGroup: "1",
  };
