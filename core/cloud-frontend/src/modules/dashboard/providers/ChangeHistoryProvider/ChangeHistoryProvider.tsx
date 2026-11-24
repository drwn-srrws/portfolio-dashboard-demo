import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChangeHistoryContext,
  ChangeHistoryContextValue,
  HistoryEntry,
} from "./ChangeHistoryContext";
import type { ChangeHistoryConfig } from "./types";
import { toast } from "@/components/ui/use-toast";

interface ChangeHistoryProviderProps {
  children: React.ReactNode;
  config: ChangeHistoryConfig<string, Record<string, boolean>>;
  localStorageKey: string;
}

const EXPIRATION_HOURS = 24;
const EXPIRATION_MS = EXPIRATION_HOURS * 60 * 60 * 1000;

interface StoredHistory {
  data: HistoryEntry<string>[];
  expiresAt: number;
}

export const ChangeHistoryProvider = ({
  children,
  config,
  localStorageKey,
}: ChangeHistoryProviderProps) => {
  const [history, setHistory] = useState<HistoryEntry<string>[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);

    if (!stored) return;

    try {
      const parsed: StoredHistory = JSON.parse(stored);
      const now = Date.now();

      if (now > parsed.expiresAt) {
        localStorage.removeItem(localStorageKey);
        return;
      }

      setHistory(parsed.data || []);
    } catch (error) {
      toast({
        title: "Failed to parse change history",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      localStorage.removeItem(localStorageKey);
    }
  }, [setHistory, localStorageKey]);

  useEffect(() => {
    if (history.length === 0) return;

    const stored: StoredHistory = {
      data: history,
      expiresAt: Date.now() + EXPIRATION_MS,
    };

    localStorage.setItem(localStorageKey, JSON.stringify(stored));
  }, [history, localStorageKey]);

  const addHistoryEntry = useCallback(
    (entry: Omit<HistoryEntry<string>, "id" | "timestamp">) => {
      const newEntry: HistoryEntry<string> = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, newEntry]);
    },
    []
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(localStorageKey);
    setHistory([]);
  }, [localStorageKey]);

  const hasChanges = useMemo(() => history.length > 0, [history.length]);

  const value: ChangeHistoryContextValue<
    string,
    Record<string, boolean>
  > = useMemo(
    () => ({
      config,
      history,
      addHistoryEntry,
      clearHistory,
      hasChanges,
    }),
    [config, history, addHistoryEntry, clearHistory, hasChanges]
  );

  return (
    <ChangeHistoryContext.Provider value={value}>
      {children}
    </ChangeHistoryContext.Provider>
  );
};
