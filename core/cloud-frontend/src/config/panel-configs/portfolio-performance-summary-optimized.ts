import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioPerformanceSummaryOptimizedPagePanelConfig: Config["portfolioPerformanceSummaryOptimizedPagePanelConfig"] =
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
        params: {},
      },
      panel_2: {
        id: "panel_2",
        title: "Performance Overview",
        contentComponent: "PerformanceOverview",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
      panel_3: {
        id: "panel_3",
        title: "Batting & Slugging Stats",
        contentComponent: "BattingAndSluggingTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultSortByMetric: "hit_rate",
          defaultSortDirection: "desc",
          defaultGroupByMetric: "primary_analyst",
        },
      },
      panel_5: {
        id: "panel_5",
        title: "Fund Performance",
        contentComponent: "FundPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
      panel_6: {
        id: "panel_6",
        title: "MedTech Top Winners & Losers",
        contentComponent: "WinnersAndLosersMedTech",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
      panel_7: {
        id: "panel_7",
        title: "Therapeutics Top Winners & Losers",
        contentComponent: "WinnersAndLosersTherapeutics",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
    },
    activeGroup: "1",
  };
