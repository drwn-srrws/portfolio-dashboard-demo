import type { Config } from "../types";

export const featureFlags: Config["featureFlags"] = {
  enableEventTrackerChatbot: {
    enabled: true,
    auth: {
      allowedRoles: ["Analyst", "External Beta User"],
    },
  },
  enableBasketExplosion: {
    enabled: true,
  },
  enableKgFeatures: {
    enabled: true,
  },
  enableNewHomepage: {
    enabled: true,
    auth: {
      allowedRoles: ["Admin"],
    },
  },
  enableTrendingTickers: {
    enabled: false,
  },
  enableIvolImpliedMove: {
    enabled: true,
    auth: {
      allowedRoles: ["Admin", "External Beta User"],
    },
  },
};
