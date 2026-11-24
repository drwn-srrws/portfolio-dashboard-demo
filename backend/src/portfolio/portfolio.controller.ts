import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { z } from "zod";
import contracts from "./contracts.json";
import { NAV } from "./data";
import { PortfolioService } from "./portfolio.service";
import { MetricsRequest, metricsRequest, RequestSchema } from "./request";

const differenceRequest = metricsRequest.extend({ fund_1: z.string(), fund_2: z.string() });
const kgRequest = metricsRequest.extend({ dimension: z.enum(["ta", "modality", "stage", "geography"]) });
const fundRequest = metricsRequest.extend({
  fund_names: z.array(z.string()).default([...NAV.keys()]),
  benchmark_names: z.array(z.string()).default(Object.keys(contracts.catalog.benchmarks)),
}).refine(body => body.fund_names.length || body.benchmark_names.length, "Provide a fund or benchmark");
const winnersRequest = metricsRequest.extend({
  top_n: z.enum(["Top 5", "Top 10", "Top 20", "Show All"]).default("Top 10"),
  result_type: z.enum(["winners", "losers"]).nullish(),
});
const battingRequest = metricsRequest.extend({
  pnl_threshold: z.number().min(0).max(1).default(0.005),
  min_trades: z.number().int().nonnegative().default(0),
});

@Controller("api/dev/portfolio-metrics")
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Get("catalog")
  catalog(@Query("include_filterable_values") values?: string) {
    return this.portfolio.catalog(values === "true" || values === "1");
  }

  @Get(":metric/config")
  config(@Param("metric") metric: string) {
    if (!Object.hasOwn(contracts.config, metric)) throw new NotFoundException("Unknown metric");
    return contracts.config[metric as keyof typeof contracts.config];
  }

  @Post("fund-summary")
  @HttpCode(200)
  fundSummary(@Body(new RequestSchema(metricsRequest)) body: MetricsRequest) {
    return this.portfolio.fundSummary(body);
  }

  @Post("position-differences")
  @HttpCode(200)
  differences(@Body(new RequestSchema(differenceRequest)) body: z.infer<typeof differenceRequest>) {
    return this.portfolio.differences(body);
  }

  @Post("market-cap-distribution")
  @HttpCode(200)
  marketCap(@Body(new RequestSchema(metricsRequest)) body: MetricsRequest) {
    return this.portfolio.distribution(body, ["company_netted_direction", "market_cap"]);
  }

  @Post("liquidity-summary")
  @HttpCode(200)
  liquidity(@Body(new RequestSchema(metricsRequest)) body: MetricsRequest) {
    return this.portfolio.distribution(body, ["days_to_cover_binned", "company_security_code_portfolio_asset_class"]);
  }

  @Post("kg-exposure")
  @HttpCode(200)
  kg(@Body(new RequestSchema(kgRequest)) body: z.infer<typeof kgRequest>) {
    return this.portfolio.kgExposure(body);
  }

  @Post("analyst-breakdown")
  @HttpCode(200)
  analysts(@Body(new RequestSchema(metricsRequest)) body: MetricsRequest) {
    return this.portfolio.analystBreakdown(body);
  }

  @Post("fund-breakdown")
  @HttpCode(200)
  fundBreakdown(@Body(new RequestSchema(metricsRequest)) body: MetricsRequest) {
    return this.portfolio.fundBreakdown(body);
  }

  @Post("benchmark-and-fund-performance")
  @HttpCode(200)
  fundPerformance(@Body(new RequestSchema(fundRequest)) body: z.infer<typeof fundRequest>) {
    return this.portfolio.fundPerformance(body);
  }

  @Post("performance-overview")
  @HttpCode(200)
  overview(@Body(new RequestSchema(metricsRequest)) body: MetricsRequest) {
    return this.portfolio.overview(body);
  }

  @Post("top-winners-and-losers-investment")
  @HttpCode(200)
  investmentWinners(@Body(new RequestSchema(winnersRequest)) body: z.infer<typeof winnersRequest>) {
    return this.portfolio.winners(body, false);
  }

  @Post("top-winners-and-losers-analyst")
  @HttpCode(200)
  analystWinners(@Body(new RequestSchema(winnersRequest)) body: z.infer<typeof winnersRequest>) {
    return this.portfolio.winners(body, true);
  }

  @Post("batting-slugging")
  @HttpCode(200)
  batting(@Body(new RequestSchema(battingRequest)) body: z.infer<typeof battingRequest>) {
    return this.portfolio.batting(body);
  }
}
