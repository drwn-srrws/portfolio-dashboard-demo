import type { DateRangeRequest } from "@/api/aliases";

export function compactDateRangeRequest(
  input: DateRangeRequest
): DateRangeRequest {
  const period = input.period ?? undefined;
  const start_date = input.start_date ?? undefined;
  const end_date = input.end_date ?? undefined;

  if (period != null) return { period };

  const out: DateRangeRequest = {};
  if (start_date != null) out.start_date = start_date;
  if (end_date != null) out.end_date = end_date;
  return out;
}
