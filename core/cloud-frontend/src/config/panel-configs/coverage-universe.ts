import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const coverageUniversePagePanelConfig: Config["coverageUniversePagePanelConfig"] =
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
            size: 1040.8507080078125,
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
        title: "Coverage Universe",
        contentComponent: "CoverageMonitorTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          metrics: [
            "drugs",
            "primary_analyst",
            "secondary_analysts",
            "venture_analyst",
            "primary_analyst_upside_price_target",
            "primary_analyst_downside_price_target",
            "research_analysts",
            "primary_analyst_rating",
            "ytd_return",
            "ivol_ratio",
            "position_exposure",
            "market_data_bbg",
            "market_price_history_ytd_bbg",
            "pitchbook_profile",
          ],
          filter: {
            hiddenFilters: {
              op: "and",
              filters: [
                {
                  op: "or",
                  filters: [
                    {
                      field: "subsector.id",
                      op: "eq",
                      value: 3,
                    },
                    {
                      field: "subsector.id",
                      op: "eq",
                      value: 7,
                    },
                  ],
                },
                {
                  op: "or",
                  filters: [
                    {
                      field: "pitchbook_profile.pitchbook_id",
                      op: "is_null",
                    },
                    {
                      op: "and",
                      filters: [
                        {
                          op: "not",
                          filters: [
                            {
                              op: "or",
                              filters: [
                                {
                                  field: "pitchbook_profile.business_status",
                                  op: "eq",
                                  value: "Bankruptcy: Admin/Reorg",
                                },
                                {
                                  field: "pitchbook_profile.business_status",
                                  op: "eq",
                                  value: "Bankruptcy: Liquidation",
                                },
                                {
                                  field: "pitchbook_profile.business_status",
                                  op: "eq",
                                  value: "Out of Business",
                                },
                              ],
                            },
                          ],
                        },
                        {
                          field: "pitchbook_profile.total_raised",
                          op: "gte",
                          value: 10000000,
                        },
                        {
                          field: "pitchbook_profile.years_since_last_round",
                          op: "lte",
                          value: 5,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
    activeGroup: "1",
  };
