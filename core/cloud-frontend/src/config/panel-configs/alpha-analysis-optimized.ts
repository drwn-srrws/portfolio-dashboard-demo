import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const alphaAnalysisOptimizedPagePanelConfig: Config["alphaAnalysisOptimizedPagePanelConfig"] =
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
                  views: ["panel_7"],
                  activeView: "panel_7",
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
          {
            type: "leaf",
            data: {
              views: ["panel_2"],
              activeView: "panel_2",
              id: "7",
              locked: true,
              hideHeader: true,
            },
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
          defaultFilters: {
            portfolio_team: ["Medical Technology"],
          },
          benchmarkIds: ["DJSMDQT Index", "XHE US Equity"],
        },
        title: "MedTech Analyst Breakdown",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "TherapeuticsAnalystPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultFilters: {
            portfolio_team: ["Therapeutics"],
          },
          benchmarkIds: ["XBI US Equity", "RGUSHSBT Index"],
        },
        title: "Therapeutics Analyst Breakdown",
      },
      panel_7: {
        id: "panel_7",
        contentComponent: "AlphaAnalysisByMarketCap",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultBenchmarkId: "XBI US Equity",
        },
        title: "Alpha Analysis by Market Cap",
      },
    },
    activeGroup: "1",
  };
