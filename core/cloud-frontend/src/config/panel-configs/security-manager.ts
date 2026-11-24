import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const securityManagerPagePanelConfig: Config["securityManagerPagePanelConfig"] =
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
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        contentComponent: "PendingSecurities",
        tabComponent: "props.defaultTabComponent",
        title: "Pending Securities",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "ExternallyPublishedSecurities",
        tabComponent: "props.defaultTabComponent",
        title: "Externally Published Securities",
      },
    },
    activeGroup: "2",
  };
