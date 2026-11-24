import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioEventExposurePagePanelConfig: Config["portfolioEventExposurePagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        data: [
          {
            type: "leaf",
            data: {
              views: ["panel_1"],
              activeView: "panel_1",
              id: "3",
            },
            size: 41,
          },
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_2"],
                  activeView: "panel_2",
                  id: "1",
                },
                size: 318,
              },
            ],
            size: 636,
            orientation: Orientation.HORIZONTAL,
          },
        ],
        size: 1055,
        orientation: Orientation.VERTICAL,
      },
      width: 1055,
      height: 685,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_2: {
        id: "panel_2",
        contentComponent: "Events",
        tabComponent: "props.defaultTabComponent",
        title: "Events",
      },
      panel_1: {
        id: "panel_1",
        contentComponent: "MetricCards",
        tabComponent: "props.defaultTabComponent",
        title: "Metric Cards",
        minimumHeight: 29,
        maximumHeight: 29,
        params: {
          setDateRangeSettings: {
            type: "YTD",
          },
          metrics: [
            "event_num_events",
            "event_num_wins",
            "event_num_losses",
            "event_win_percentage",
            "event_loss_percentage",
          ],
        },
      },
    },
    activeGroup: "1",
  };
