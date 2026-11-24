import { HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { z } from "zod";
import { dayMs } from "./data";

const isoDate = z.string().date();
const periodSchema = z.enum(["YTD", "QTD", "MTD", "WTD", "DTD", "ITD"]);
const dateRange = z.object({
  period: periodSchema.nullish(),
  start_date: isoDate.nullish(),
  end_date: isoDate.nullish(),
}).refine(range => !(range.period && (range.start_date || range.end_date))
  && !(range.end_date && !range.start_date)
  && !(range.start_date && range.end_date && range.start_date > range.end_date), "Invalid date range");

export const metricsRequest = z.object({
  date_range: dateRange.default({}),
  filters: z.record(z.string(), z.array(z.union([z.string(), z.boolean(), z.number()])).nullable()).default({}),
  group_by: z.array(z.string()).nullish(),
  metric: z.string().nullish(),
  benchmark_id: z.string().nullish(),
});

export type MetricsRequest = z.infer<typeof metricsRequest>;

@Injectable()
export class RequestSchema<T> implements PipeTransform {
  constructor(private readonly schema: z.ZodType<T>) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) throw new HttpException({
      detail: result.error.issues.map(issue => ({ loc: ["body", ...issue.path], msg: issue.message, type: issue.code })),
    }, 422);
    return result.data;
  }
}

export const iso = (date: Date) => date.toISOString().slice(0, 10);
const today = () => new Date(new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date()));

export function periodStart(period: z.infer<typeof periodSchema>, end: Date) {
  const year = end.getUTCFullYear();
  const month = end.getUTCMonth();
  switch (period) {
    case "DTD": return end;
    case "WTD": return new Date(+end - ((end.getUTCDay() + 5) % 7 + 1) * dayMs);
    case "MTD": return new Date(Date.UTC(year, month));
    case "QTD": return new Date(Date.UTC(year, Math.floor(month / 3) * 3));
    case "YTD": return new Date(Date.UTC(year, 0));
    case "ITD": return new Date("2021-01-01");
  }
}

export function resolveDates(range: MetricsRequest["date_range"]) {
  const end = range.end_date ? new Date(range.end_date) : today();
  const start = range.start_date ? new Date(range.start_date) : periodStart(range.period ?? "YTD", end);
  if (end.getTime() - start.getTime() > 3660 * dayMs) {
    throw new HttpException({ detail: "Date range exceeds 10 years" }, 422);
  }
  return { start, end };
}

export function tradingDays(start: Date, end: Date) {
  const days: Date[] = [];
  for (let date = start; date <= end; date = new Date(+date + dayMs)) {
    if (date.getUTCDay() % 6 !== 0) days.push(date);
  }
  return days;
}
