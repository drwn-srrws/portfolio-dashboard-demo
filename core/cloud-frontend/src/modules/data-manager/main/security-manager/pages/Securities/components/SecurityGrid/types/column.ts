export const Column = {
  Id: "Id",
  Name: "Name",
  SecCode: "Security Code",
  Ticker: "Ticker",
  EnfusionId: "EnfusionId",
  AssetClass: "AssetClass",
  UpdatedAt: "UpdatedAt",
  Status: "Status",
  Progress: "Progress",
  Actions: "Actions",
} as const;

export type ColumnId = (typeof Column)[keyof typeof Column];
