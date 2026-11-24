import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioLtdAlphaTwoPagePanelConfig: Config["portfolioLtdAlphaTwoPagePanelConfig"] =
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
                  id: "2",
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
      panel_1: {
        id: "panel_1",
        contentComponent: "YearlyPerformanceOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {},
        },
        title: "Yearly Performance",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "YearlyAlphaPnLOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {},
        },
        title: "Yearly Alpha PnL",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "YearlyAlphaPnLOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultBenchmarkIds: [
            "RGUSHSME Index",
            "XHE US Equity",
            "DJSMDQT Index",
          ],
          filters: {
            portfolio_team: ["Medical Technology"],
          },
        },
        title: "MedTech Yearly Alpha PnL",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "YearlyAlphaPnLOptimizedWidget",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultBenchmarkIds: ["RGUSHSBT Index", "XBI US Equity", "NBI Index"],
          filters: {
            portfolio_team: ["Therapeutics"],
          },
        },
        title: "Therapeutics Yearly Alpha PnL",
      },
      panel_5: {
        id: "panel_5",
        title: "MedTech Analyst Yearly Alpha PnL",
        contentComponent: "MedTechYearlyAlphaPnLByAnalyst",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
      panel_6: {
        id: "panel_6",
        title: "Therapeutics Analyst Yearly Alpha PnL",
        contentComponent: "TherapeuticsYearlyAlphaPnLByAnalyst",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
    },
    activeGroup: "1",
  };
