import type { PanelConfig } from "@/config/shared-types";

const DRUG_PROGRAMS_PANEL_ID = "panel_drug_programs";

export const withoutDrugProgramsPanel = (config: PanelConfig): PanelConfig => {
  const panels = Object.fromEntries(
    Object.entries(config.panels).filter(
      ([panelId]) => panelId !== DRUG_PROGRAMS_PANEL_ID
    )
  );
  const { root } = config.grid;

  if (root.type !== "branch") {
    return { ...config, panels };
  }

  return {
    ...config,
    panels,
    grid: {
      ...config.grid,
      root: {
        ...root,
        data: root.data.filter(
          (node) =>
            !(
              node.type === "leaf" &&
              node.data.views?.includes(DRUG_PROGRAMS_PANEL_ID)
            )
        ),
      },
    },
  };
};
