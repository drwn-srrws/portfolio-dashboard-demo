import { HttpException, Injectable } from "@nestjs/common";
import { analystAvatar, benchmarkReturn, dailyPnl, holdings, Holding, NAV } from "./data";
import { iso, MetricsRequest, periodStart, resolveDates, tradingDays } from "./request";
import contracts from "./contracts.json";

type Value = string | number | boolean | null;
type Row = Record<string, Value>;
const ticker = "company_security_code_portfolio_asset_class";
const pnl = "cumulative_pnl_percent_nav";
const gmv = "company_netted_gmv_percent_nav";
const alphaModes = [pnl, "cumulative_simple_alpha_pnl_percent_nav", "cumulative_net_adjusted_alpha_pnl_percent_nav"];
const names = new Map(contracts.catalog.metrics.map(metric => [metric.name, metric.display_name]));
const sum = <T>(items: T[], measure: (item: T) => number) => items.reduce((total, item) => total + measure(item), 0);
const column = (row: Holding, key: string) => row[key as keyof Holding] ?? null;
const net = (rows: Holding[]) => sum(rows, row => row.exposure);
const dayPnl = (rows: Holding[], day: Date) => sum(rows, row => dailyPnl(row, day));
const compound = (days: Date[], rate: (day: Date) => number) => days.reduce((total, day) => total * (1 + rate(day)), 1) - 1;
const cumulative = (rows: Holding[], days: Date[], nav: number) => compound(days, day => dayPnl(rows, day) / nav);

function group(rows: Holding[], keys: string[]) {
  const groups = new Map<string, { tags: Row; items: Holding[] }>();
  for (const row of rows) {
    const tags = Object.fromEntries(keys.map(key => [key, column(row, key)]));
    const id = JSON.stringify(tags);
    if (!groups.has(id)) groups.set(id, { tags, items: [] });
    groups.get(id)!.items.push(row);
  }
  return [...groups.values()];
}

const gross = (rows: Holding[]) => sum(group(rows, ["instrument_security_code"]), ({ items }) => Math.abs(net(items)));
const matches = (row: Holding, filters: MetricsRequest["filters"]) =>
  Object.entries(filters).every(([key, values]) => !values?.length || values.includes(column(row, key) as Exclude<Value, null>));

function context(request: MetricsRequest) {
  const { start, end } = resolveDates(request.date_range);
  const rows = holdings(end).filter(row => matches(row, request.filters));
  const funds = request.filters.fund_name?.length ? request.filters.fund_name : [...NAV.keys()];
  const nav = sum(funds, fund => NAV.get(String(fund)) ?? 0) || 1;
  return { rows, days: tradingDays(start, end), nav, end };
}

function response(request: MetricsRequest, data: Row[], columns: string[] = [], keys: string[] = [], extra = {}) {
  const { start, end } = resolveDates(request.date_range);
  const filters = Object.fromEntries(Object.entries(request.filters).filter(([, values]) => values !== null));
  const displayColumns = [...new Set([...keys, ...columns])];
  return {
    data,
    metadata: {
      date_range: { start_date: iso(start), end_date: iso(end), period: request.date_range.period ?? null },
      filters, group_by: keys, record_count: data.length, display_columns: displayColumns,
      sort: null, selectable_display_columns: null,
      display_name_map: Object.fromEntries([...new Set([...displayColumns, ...Object.keys(filters)])]
        .map(name => [name, names.get(name) ?? name.replaceAll("_", " ").toUpperCase()])),
      ...extra,
    },
  };
}

@Injectable()
export class PortfolioService {
  catalog(includeValues: boolean) {
    const rows = holdings(new Date(0));
    return {
      ...contracts.catalog,
      filters: contracts.catalog.filters.map(filter => ({
        ...filter,
        values: includeValues ? [...new Set(rows.map(row => column(row, filter.name)))].sort() : null,
      })),
    };
  }

  fundSummary(request: MetricsRequest) {
    const { rows, days, nav } = context(request);
    const totals = {
      NAV: rows.length ? nav : 0,
      "PnL (%)": cumulative(rows, days, nav),
      "Long PnL (%)": cumulative(rows.filter(row => row.direction === "Long"), days, nav),
      "Short PnL (%)": cumulative(rows.filter(row => row.direction === "Short"), days, nav),
    };
    return response(request, Object.entries(totals).map(([name, value]) => ({ name, value })));
  }

  differences(request: MetricsRequest & { fund_1: string; fund_2: string }) {
    const { fund_1, fund_2 } = request;
    const fundNav1 = NAV.get(fund_1);
    const fundNav2 = NAV.get(fund_2);
    if (!fundNav1 || !fundNav2) throw new HttpException({ detail: "Unknown fund in comparison" }, 422);
    const { rows } = context({ ...request, filters: { ...request.filters, fund_name: [fund_1, fund_2] } });
    const data = group(rows, [ticker]).map(({ tags, items }) => {
      const first = net(items.filter(row => row.fund_name === fund_1)) / fundNav1;
      const second = net(items.filter(row => row.fund_name === fund_2)) / fundNav2;
      return { ...tags, fund_1: first, fund_2: second, difference: Math.abs(first - second) };
    }).sort((a, b) => b.difference - a.difference);
    return response(request, data, ["fund_1", "fund_2", "difference"], [ticker], { fund_1, fund_2 });
  }

  distribution(request: MetricsRequest, dimensions: string[]) {
    const { rows, nav } = context(request);
    return [dimensions.slice(0, 1), dimensions].map(keys =>
      response(request, group(rows, keys).map(({ tags, items }) => ({ ...tags, [gmv]: gross(items) / nav })), [gmv], keys));
  }

  kgExposure(request: MetricsRequest & { dimension: string }) {
    const { rows, days, nav } = context(request);
    const keys = [request.dimension];
    const data = group(rows, keys).map(({ tags, items }) => {
      const daily = days.length ? dayPnl(items, days.at(-1)!) : 0;
      const exposure = gross(items);
      return { ...tags, company_netted_gmv: exposure, [gmv]: exposure / nav,
        daily_pnl_usd: daily, daily_pnl_percent_nav: daily / nav, [pnl]: cumulative(items, days, nav) };
    });
    return response(request, data, ["company_netted_gmv", gmv, "daily_pnl_usd", "daily_pnl_percent_nav", pnl], keys);
  }

  analystBreakdown(request: MetricsRequest) {
    const { rows, days, nav } = context(request);
    const analysts = [...new Set(rows.map(row => row.primary_analyst))].sort();
    const data = analysts.map(analyst => {
      const row: Row = { analyst, analyst_avatar: analystAvatar(analyst) };
      for (const role of ["primary_analyst", "secondary_analyst"] as const) {
        const related = rows.filter(item => item[role] === analyst);
        row[role + "_net_exposure"] = net(related);
        row[role + "_cumulative_pnl_percent_nav"] = cumulative(related, days, nav);
      }
      return row;
    });
    return response(request, data, Object.keys(data[0] ?? {}));
  }

  fundBreakdown(request: MetricsRequest) {
    const { rows, nav } = context(request);
    const summary: Row[] = [];
    const detail: Row[] = [];
    for (const section of contracts.sections) {
      const selected = rows.filter(row => matches(row, section.filters as MetricsRequest["filters"]));
      const calculate = section.key === "company_netted_gmv" ? gross : net;
      const name = section.label;
      summary.push({ name, exposure_percent: calculate(selected) / nav });
      for (const { tags, items } of group(selected, section.detail_group_by)) {
        detail.push({ name, grouped_metric_value: Object.values(tags)[0], exposure_percent: calculate(items) / nav });
      }
    }
    return [response(request, summary, ["name", "exposure_percent"]),
      response(request, detail, ["name", "exposure_percent", "grouped_metric_value"])];
  }

  fundPerformance(request: MetricsRequest & { fund_names: string[]; benchmark_names: string[] }) {
    const { rows, end } = context(request);
    const data: Row[] = [];
    for (const name of new Set([...request.fund_names, ...request.benchmark_names])) {
      if (!NAV.has(name) && name !== "DEMO") continue;
      const selected = rows.filter(row => row.fund_name === name);
      const row: Row = { name: name === "DEMO" ? "Demo benchmark" : name };
      for (const period of ["DTD", "MTD", "QTD", "YTD"] as const) {
        const days = tradingDays(periodStart(period, end), end);
        const key = period === "DTD" ? "daily" : period.toLowerCase();
        row[key + "_pnl_percent_nav"] = name === "DEMO"
          ? compound(days, benchmarkReturn) : cumulative(selected, days, NAV.get(name)!);
      }
      data.push(row);
    }
    return response(request, data, Object.keys(data[0] ?? {}));
  }

  overview(request: MetricsRequest) {
    const { rows, days, nav } = context(request);
    const keys = (request.group_by ?? ["direction"]).filter(key => key !== "date");
    const metric = alphaModes.includes(request.metric ?? "") ? request.metric! : pnl;
    const data = group(rows, keys).flatMap(({ tags, items }) => {
      let running = 1;
      return days.map(day => {
        let contribution = dayPnl(items, day) / nav;
        if (metric === alphaModes[1]) contribution -= benchmarkReturn(day);
        if (metric === alphaModes[2]) contribution -= benchmarkReturn(day) * net(items) / nav;
        running *= 1 + contribution;
        return { ...tags, date: iso(day), [metric]: running - 1 };
      });
    });
    return [response(request, data, [metric], ["date", ...keys], {
      selectable_display_dimensions: alphaModes, selected_display_dimension: metric,
    })];
  }

  winners(request: MetricsRequest & { top_n: string; result_type?: string | null }, byAnalyst: boolean) {
    const { rows, days, nav } = context(request);
    const keys = [...new Set([...(request.group_by ?? []), ticker])];
    if (byAnalyst && !keys.includes("primary_analyst")) keys.unshift("primary_analyst");
    const data = group(rows, keys).map(({ tags, items }) => {
      const row = {
        ...tags, [pnl]: cumulative(items, days, nav),
        instrument_security_code: items[0].instrument_security_code,
        position_instrument_security_code: items[0].instrument_security_code,
      };
      if (byAnalyst) {
        for (const role of ["primary_analyst", "secondary_analyst"]) {
          if (typeof tags[role] === "string") Object.assign(row, { [role + "_avatar"]: analystAvatar(tags[role]) });
        }
      }
      return row;
    });
    const count = Number(request.top_n.split(" ")[1]) || data.length;
    const winners = data.filter(row => row[pnl] > 0).sort((a, b) => b[pnl] - a[pnl]).slice(0, count);
    const losers = data.filter(row => row[pnl] < 0).sort((a, b) => a[pnl] - b[pnl]).slice(0, count);
    const selected = request.result_type === "winners" ? winners : request.result_type === "losers" ? losers : [...winners, ...losers];
    return [response(request, selected, [pnl], keys)];
  }

  batting(request: MetricsRequest & { pnl_threshold: number; min_trades: number }) {
    const { rows, days, nav } = context(request);
    const keys = request.group_by ?? ["primary_analyst"];
    const columns = ["total_number_of_trades", "number_of_wins", "number_of_losses", "hit_rate",
      "slugging_ratio", "avg_win_pnl_percent_nav", "avg_loss_pnl_percent_nav"];
    const data = group(rows, keys).filter(({ items }) => items.length >= request.min_trades)
      .map(({ tags, items }) => {
        const trades = items.map(row => sum(days, day => dailyPnl(row, day)) / nav);
        const wins = trades.filter(value => value > request.pnl_threshold);
        const losses = trades.filter(value => value < -request.pnl_threshold);
        const average = (values: number[]) => sum(values, value => value) / (values.length || 1);
        const win = average(wins);
        const loss = average(losses);
        const row = { ...tags, ...Object.fromEntries(columns.map((key, index) => [key,
          [trades.length, wins.length, losses.length, wins.length / trades.length,
            losses.length ? win / -loss : null, win, loss][index]])) };
        if (typeof tags.primary_analyst === "string") row.primary_analyst_avatar = analystAvatar(tags.primary_analyst);
        return row;
      });
    return [response(request, data, columns, keys)];
  }
}
