import { createContext } from "react";
import type { Config } from "@/config/types";
import type { GitRelease } from "@api/types";

export interface IConfigContext {
  frontendConfig: Config;
  gitRelease: GitRelease | null;
}

export const ConfigContext = createContext<IConfigContext | null>(null);
