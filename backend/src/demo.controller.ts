import { Controller, Get, HttpException, Injectable, Param } from "@nestjs/common";
import contracts from "./portfolio/contracts.json";

@Injectable()
export class ExchangeRates {
  private cached = contracts.fx;
  private refreshAt = 0;
  private pending?: Promise<typeof contracts.fx>;

  getRates() {
    if (Date.now() < this.refreshAt) return Promise.resolve(this.cached);
    this.pending ??= this.refresh().finally(() => { this.pending = undefined; });
    return this.pending;
  }

  private async refresh() {
    try {
      const result = await fetch("https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,GBP&providers=ecb", {
        signal: AbortSignal.timeout(3000),
      });
      if (!result.ok) throw new Error("FX unavailable");
      const rows = await result.json() as { date: string; quote: string; rate: number }[];
      const usd = rows.find(row => row.quote === "USD");
      const gbp = rows.find(row => row.quote === "GBP");
      if (!usd || !gbp || usd.date !== gbp.date || !/^\d{4}-\d{2}-\d{2}$/.test(usd.date)
        || ![usd.rate, gbp.rate].every(rate => Number.isFinite(rate) && rate > 0)) {
        throw new Error("Incomplete FX rates");
      }
      this.cached = { source: "ecb", date: usd.date, rates: { EUR: 1, USD: usd.rate, GBP: gbp.rate } };
      this.refreshAt = Date.now() + 3_600_000;
    } catch {
      this.cached = { ...this.cached, source: "snapshot" };
      this.refreshAt = Date.now() + 60_000;
    }
    return this.cached;
  }
}

const cents = (value: number) => Math.round(value * 100) / 100;

@Controller("api/dev")
export class DemoController {
  constructor(private readonly exchangeRates: ExchangeRates) {}

  @Get("frontend-config")
  config() { return { gitRelease: null }; }

  @Get("notifications/api/alerts")
  alerts() { return { alerts: [] }; }

  @Get("v2/data/latest-dates")
  latestDates() {
    return { items: [], last_updated: new Date(), notes: "Simulated portfolio data" };
  }

  @Get("clients")
  clients() {
    return Object.entries(contracts.clients).map(([id, { name, strategy }]) => ({ id, name, strategy }));
  }

  @Get("clients/:id/portfolio")
  async portfolio(@Param("id") id: string) {
    if (!Object.hasOwn(contracts.clients, id)) throw new HttpException({ detail: "Client not found" }, 404);
    const client = contracts.clients[id as keyof typeof contracts.clients];
    const fx = await this.exchangeRates.getRates();
    const positions = client.positions.map(position => {
      const rate = fx.rates[position.currency as keyof typeof fx.rates];
      return { ...position, market_value: cents(position.quantity * position.price / rate),
        pnl: cents(position.quantity * (position.price - position.cost_basis) / rate) };
    });
    return {
      positions,
      gross_exposure: cents(positions.reduce((total, row) => total + Math.abs(row.market_value), 0)),
      net_exposure: cents(positions.reduce((total, row) => total + row.market_value, 0)),
      pnl: cents(positions.reduce((total, row) => total + row.pnl, 0)),
      fx,
    };
  }
}
