export const RowLevel = {
  Company: 0,
} as const;

export type RowLevel = (typeof RowLevel)[keyof typeof RowLevel];
