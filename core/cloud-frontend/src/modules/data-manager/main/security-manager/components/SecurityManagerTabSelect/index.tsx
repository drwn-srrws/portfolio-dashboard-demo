import { useCallback } from "react";
import { TextSelect } from "@components/TextSelect";
import { useTab } from "@providers/TabProvider";
import { SecurityManagerTab } from "../../types/SecurityManagerTab";

const options = [
  { value: SecurityManagerTab.Securities, label: "Securities" },
  { value: SecurityManagerTab.Companies, label: "Companies" },
  { value: SecurityManagerTab.InstrumentGroups, label: "Instrument Groups" },
];

export const SecurityManagerTabSelect = () => {
  const { tab, setTab } = useTab<SecurityManagerTab>();

  const handleChange = useCallback(
    (tab: string | number | boolean) => {
      setTab(tab as SecurityManagerTab);
    },
    [setTab]
  );

  return (
    <TextSelect
      testId="security-manager-page-selector"
      value={tab}
      options={options}
      onChange={handleChange}
      placeholder="Select section"
    />
  );
};
