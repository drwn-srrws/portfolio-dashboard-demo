import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioLtdAlphaPagePanelConfig: Config["portfolioLtdAlphaPagePanelConfig"] =
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
                  id: "3",
                  locked: true,
                  hideHeader: true,
                },
                size: 1,
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
                size: 1,
              },
            ],
            size: 1,
            orientation: Orientation.HORIZONTAL,
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
            orientation: Orientation.HORIZONTAL,
          },
        ],
        orientation: Orientation.VERTICAL,
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_3: {
        id: "panel_3",
        contentComponent: "YearlyPerformanceWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {},
          defaultGroupBy: "fund_name",
          totalMetric: "cumulative_pnl_percent_nav",
        },
        title: "Yearly Performance",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "YearlyAlphaPnLWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {},
          defaultGroupBy: "fund_name",
          totalMetric: "cumulative_alpha_pnl_percent_nav",
          defaultBenchmarkIds: ["RGUSHSBT Index", "XBI US Equity", "NBI Index"],
        },
        title: "Yearly Alpha PnL",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "YearlyAlphaPnLWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            portfolio_team: ["Medical Technology"],
          },
          defaultGroupBy: "fund_name",
          totalMetric: "cumulative_alpha_pnl_percent_nav",
          defaultBenchmarkIds: [
            "RGUSHSME Index",
            "XHE US Equity",
            "DJSMDQT Index",
          ],
        },
        title: "MedTech Yearly Alpha PnL",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "YearlyAlphaPnLWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            portfolio_team: ["Therapeutics"],
          },
          defaultGroupBy: "fund_name",
          totalMetric: "cumulative_alpha_pnl_percent_nav",
          defaultBenchmarkIds: ["RGUSHSBT Index", "XBI US Equity", "NBI Index"],
        },
        title: "Therapeutics Yearly Alpha PnL",
      },
    },
    activeGroup: "2",
  };
