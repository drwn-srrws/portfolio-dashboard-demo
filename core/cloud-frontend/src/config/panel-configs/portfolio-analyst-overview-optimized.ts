import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioAnalystOverviewOptimizedPagePanelConfig: Config["portfolioAnalystOverviewOptimizedPagePanelConfig"] =
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
        params: {},
        title: "Portfolio Summary",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "FundPerformance",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Fund Performance",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "BasketBreakdownTable",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Basket Breakdown",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "PerformanceOverview",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Performance Overview",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "MonthlyPerformanceOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Monthly Performance",
      },
      panel_6: {
        id: "panel_6",
        title: "MedTech Top Winners & Losers",
        contentComponent: "WinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultFilters: {
            company_subsector: ["Medical Technology"],
          },
          showDateRangeSelect: true,
          showTopSelect: true,
          showGroupBySelect: true,
        },
      },
      panel_7: {
        id: "panel_7",
        title: "Therapeutics Top Winners & Losers",
        contentComponent: "WinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultFilters: {
            company_subsector: ["Therapeutics"],
          },
          showDateRangeSelect: true,
          showTopSelect: true,
          showGroupBySelect: true,
        },
      },
    },
    activeGroup: "1",
  };
