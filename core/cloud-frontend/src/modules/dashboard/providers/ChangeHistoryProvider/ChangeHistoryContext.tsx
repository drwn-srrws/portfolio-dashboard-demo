import { createContext } from "react";
import type { ChangeHistoryConfig } from "./types";

export interface HistoryEntry<TEntity extends string = string> {
  id: string;
  timestamp: Date;
  type: "create" | "update" | "delete";
  entity: TEntity;
  title: string;
  description: string;
  data?: Record<string, unknown>;
}

export interface ChangeHistoryContextValue<
  TEntity extends string = string,
  TFlags extends Record<string, boolean> = Record<string, boolean>,
> {
  config: ChangeHistoryConfig<TEntity, TFlags>;
  history: HistoryEntry<TEntity>[];
  addHistoryEntry: (
    entry: Omit<HistoryEntry<TEntity>, "id" | "timestamp">
  ) => void;
  clearHistory: () => void;
  hasChanges: boolean;
}

export const ChangeHistoryContext = createContext<ChangeHistoryContextValue<
  string,
  Record<string, boolean>
> | null>(null);
