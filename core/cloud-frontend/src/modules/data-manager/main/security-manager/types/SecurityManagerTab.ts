export const SecurityManagerTab = {
  Securities: "securities",
  InstrumentGroups: "instrument-groups",
  Companies: "companies",
} as const satisfies Record<string, string>;

export type SecurityManagerTab =
  (typeof SecurityManagerTab)[keyof typeof SecurityManagerTab];
