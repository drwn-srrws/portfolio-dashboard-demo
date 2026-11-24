import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const frontendPackage = new URL("../../core/cloud-frontend/package.json", import.meta.url);
const { build } = createRequire(frontendPackage)("esbuild");
const path = (relative) => fileURLToPath(new URL(relative, import.meta.url));

await build({
  entryPoints: [path("./demo-api.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  minify: true,
  tsconfig: path("../tsconfig.json"),
  alias: { "@nestjs/common": path("./nest-shim.mjs") },
  outfile: path("../../core/cloud-frontend/dist/demo-api.js"),
});
