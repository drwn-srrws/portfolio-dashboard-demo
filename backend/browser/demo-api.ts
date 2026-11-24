import { DemoController, ExchangeRates } from "../src/demo.controller";
import { PortfolioController } from "../src/portfolio/portfolio.controller";
import { PortfolioService } from "../src/portfolio/portfolio.service";
import { HttpException, register } from "./nest-shim.mjs";

const routes = [
  ...register(new DemoController(new ExchangeRates())),
  ...register(new PortfolioController(new PortfolioService())),
];

export async function request(method: string, address: string, body: unknown) {
  const url = new URL(address, location.origin);
  const path = url.pathname.split("/");

  for (const route of routes) {
    if (method !== route.method || path.length !== route.path.length) continue;
    if (!route.path.every((part, index) => part.startsWith(":") || part === path[index])) continue;

    const params = Object.fromEntries(
      route.path.flatMap((part, index) =>
        part.startsWith(":") ? [[part.slice(1), decodeURIComponent(path[index])]] : [],
      ),
    );

    try {
      return { status: 200, data: await route.run({ url, params, body }) };
    } catch (error) {
      if (error instanceof HttpException) {
        return { status: error.status, data: error.response };
      }
      throw error;
    }
  }

  return { status: 404, data: { detail: "Demo endpoint not found" } };
}
