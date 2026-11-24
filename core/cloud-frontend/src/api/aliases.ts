/**
 * Hand-maintained compatibility aliases for orval-generated types.
 *
 * The OpenAPI spec exposes the portfolio-metrics `DateRangeRequest` component
 * under that short name. These aliases re-expose it (and its `Period` enum)
 * from a stable, hand-maintained path so app code has a single import site that
 * survives client regeneration, regardless of how orval names the component.
 *
 * This file deliberately lives in `src/api` rather than `src/api/types`,
 * because orval is configured with `clean: true` on the schemas directory and
 * would delete it on every client regeneration.
 */
export type { DateRangeRequest, DateRangeRequestPeriod } from "./types";
