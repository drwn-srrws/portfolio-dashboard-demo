export const Column = {
  company: "company",
  primary_analyst: "primary_analyst",
  coverage_type: "coverage_type",
  effective_start_date: "effective_start_date",
  effective_end_date: "effective_end_date",
} as const;

export type Column = keyof typeof Column;
