import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioHistoricalPerformanceOptimizedPagePanelConfig: Config["portfolioHistoricalPerformanceOptimizedPagePanelConfig"] =
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
                  views: ["panel_5"],
                  activeView: "panel_5",
                  id: "5",
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
                  views: ["panel_2"],
                  activeView: "panel_2",
                  id: "2",
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
        ],
        orientation: Orientation.HORIZONTAL,
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        contentComponent: "HistoricalMonthlyAlphaPerfOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {},
        },
        title: "Monthly Alpha PnL",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "HistoricalMonthlyAlphaPerfOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            portfolio_team: ["Medical Technology"],
          },
        },
        title: "MedTech Monthly Alpha PnL",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "HistoricalMonthlyAlphaPerfOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            portfolio_team: ["Therapeutics"],
          },
        },
        title: "Therapeutics Monthly Alpha PnL",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "HistoricalMonthlyPerformanceOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {},
        },
        title: "Monthly Performance",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "HistoricalMonthlyPerformanceOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Medical Technology"],
          },
        },
        title: "MedTech Monthly Performance",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "HistoricalMonthlyPerformanceOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Therapeutics"],
          },
        },
        title: "Therapeutics Monthly Performance",
      },
    },
    activeGroup: "1",
  };
