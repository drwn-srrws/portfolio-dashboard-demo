import { Orientation } from "dockview-react";
import type { Config } from "../types";

/**
 * Performance Summary II — host page for the AS5 PM Dashboard 2.0 cards.
 *
 * Layout: single column of stacked rows.
 *   Row 1: PnL by Subteam
 *   Row 2: PnL by New Companies (Company View)
 *   Row 3: PnL by New Companies (Analyst View)
 */
export const portfolioPerformanceSummaryIIPagePanelConfig: Config["portfolioPerformanceSummaryIIPagePanelConfig"] =
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
            ],
            size: 1,
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
            ],
            size: 1,
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
            ],
            size: 1,
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
        title: "PnL by Subteam",
        contentComponent: "PnlBySubteam",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultBenchmarkId: "XBI US Equity",
        },
      },
      panel_2: {
        id: "panel_2",
        title: "PnL by New Companies (Company View) - ITD",
        contentComponent: "PnlByNewCompaniesCompanyView",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultFundName: "Flagship",
        },
      },
      panel_3: {
        id: "panel_3",
        title: "PnL by New Companies (Analyst View)",
        contentComponent: "PnlByNewCompaniesAnalystView",
        tabComponent: "props.defaultTabComponent",
        params: {},
      },
    },
    activeGroup: "1",
  };
