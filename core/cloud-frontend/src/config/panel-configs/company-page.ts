import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const companyPanelConfig: Config["companyPanelConfig"] = {
  default: {
    grid: {
      root: {
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
                  views: ["panel_1"],
                  activeView: "panel_1",
                  id: "1",
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
                  id: "5",
                  locked: true,
                  hideHeader: true,
                },
                size: 50,
              },
            ],
            size: 25,
          },
          {
            type: "leaf",
            data: {
              views: ["panel_4"],
              activeView: "panel_4",
              id: "3",
              locked: true,
              hideHeader: true,
            },
            size: 30,
          },
          {
            type: "leaf",
            data: {
              views: ["panel_5"],
              activeView: "panel_5",
              id: "4",
              locked: true,
              hideHeader: true,
            },
            size: 20,
          },
          {
            type: "leaf",
            data: {
              views: ["panel_drug_programs"],
              activeView: "panel_drug_programs",
              id: "6",
              locked: true,
              hideHeader: true,
            },
            size: 25,
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
        contentComponent: "OverviewCard",
        tabComponent: "props.defaultTabComponent",
        title: "Metric Cards",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "TrendsChart",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Therapeutics"],
          },
        },
        title: "Performance",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "EventsTable",
        tabComponent: "props.defaultTabComponent",
        title: "Performance Overview",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "CostAttributesTable",
        tabComponent: "props.defaultTabComponent",
        title: "Cost Attributes",
      },
      panel_drug_programs: {
        id: "panel_drug_programs",
        contentComponent: "CompanyDrugPrograms",
        tabComponent: "props.defaultTabComponent",
        title: "Drug Programs",
      },
    },
    activeGroup: "2",
  },
  portfolioManager: {
    grid: {
      root: {
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
                  views: ["panel_1"],
                  activeView: "panel_1",
                  id: "1",
                  locked: true,
                  hideHeader: true,
                },
                size: 50,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_3"],
                  activeView: "panel_3",
                  id: "2",
                  locked: true,
                  hideHeader: true,
                },
                size: 33,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_6"],
                  activeView: "panel_6",
                  id: "5",
                  locked: true,
                  hideHeader: true,
                },
                size: 34,
              },
            ],
            size: 25,
          },
          {
            type: "leaf",
            data: {
              views: ["panel_4"],
              activeView: "panel_4",
              id: "3",
              locked: true,
              hideHeader: true,
            },
            size: 30,
          },
          {
            type: "leaf",
            data: {
              views: ["panel_5"],
              activeView: "panel_5",
              id: "4",
              locked: true,
              hideHeader: true,
            },
            size: 20,
          },
          {
            type: "leaf",
            data: {
              views: ["panel_drug_programs"],
              activeView: "panel_drug_programs",
              id: "6",
              locked: true,
              hideHeader: true,
            },
            size: 25,
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
        contentComponent: "OverviewCard",
        tabComponent: "props.defaultTabComponent",
        title: "Metric Cards",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "PortfolioAnalyticsTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Medical Technology"],
          },
        },
        title: "MedTech Monthly Performance",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "TrendsChart",
        tabComponent: "props.defaultTabComponent",
        params: {
          filters: {
            company_subsector: ["Therapeutics"],
          },
        },
        title: "Performance",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "EventsTable",
        tabComponent: "props.defaultTabComponent",
        title: "Performance Overview",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "CostAttributesTable",
        tabComponent: "props.defaultTabComponent",
        title: "Cost Attributes",
      },
      panel_drug_programs: {
        id: "panel_drug_programs",
        contentComponent: "CompanyDrugPrograms",
        tabComponent: "props.defaultTabComponent",
        title: "Drug Programs",
      },
    },
    activeGroup: "2",
  },
};
