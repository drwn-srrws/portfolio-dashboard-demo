import "reflect-metadata";
import { Controller, Get, Module, Res } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, type OpenAPIObject } from "@nestjs/swagger";
import type { Response } from "express";
import { resolve } from "node:path";
import { DemoController, ExchangeRates } from "./demo.controller";
import { PortfolioController } from "./portfolio/portfolio.controller";
import { PortfolioService } from "./portfolio/portfolio.service";
import contract from "./openapi.json";

const frontend = resolve(__dirname, "../../core/cloud-frontend/dist");

@Controller()
class FrontendController {
  @Get(["/", "/portfolio/:page"])
  index(@Res() response: Response) {
    response.sendFile(resolve(frontend, "index.html"));
  }
}

@Module({
  controllers: [DemoController, PortfolioController, FrontendController],
  providers: [ExchangeRates, PortfolioService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(frontend, { index: false });
  // Keep the existing API descriptions and schemas used by the generated React clients.
  SwaggerModule.setup("docs", app, contract as OpenAPIObject, { jsonDocumentUrl: "/openapi.json" });
  await app.listen(Number(process.env.PORT ?? 8000), process.env.HOST ?? "127.0.0.1");
}

void bootstrap();
