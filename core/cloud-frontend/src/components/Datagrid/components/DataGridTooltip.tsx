import { ITooltipParams } from "@ag-grid-community/core";

export const DataGridTooltip = ({ value }: ITooltipParams) => (
  <div className="bg-neutral-800 text-white p-2 rounded max-w-[20rem] break-words border border-neutral-600 shadow-md">
    {value}
  </div>
);
