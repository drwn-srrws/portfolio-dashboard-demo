import { useMemo } from "react";
import { FeatureDialogConfig } from "@/config/types";

const STORAGE_KEY = "viewedFeatureDialogs";

interface DialogStorageData {
  viewedDialogs: Record<string, boolean>;
}

export const useDialogStorage = (featureDialogs: FeatureDialogConfig[]) => {
  return useMemo(() => {
    const get = (): DialogStorageData => {
      try {
        return JSON.parse(
          localStorage.getItem(STORAGE_KEY) || '{"viewedDialogs":{}}'
        );
      } catch {
        return { viewedDialogs: {} };
      }
    };

    const save = (viewedDialogs: Record<string, boolean>): void => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ viewedDialogs }));
    };

    const cleanup = (): DialogStorageData => {
      if (!featureDialogs.length) return { viewedDialogs: {} };

      const currentKeys = featureDialogs.map((dialog) => dialog.key);
      const { viewedDialogs } = get();
      const filtered = Object.entries(viewedDialogs)
        .filter(([key]) => currentKeys.includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      save(filtered);
      return { viewedDialogs: filtered };
    };

    const markAsViewed = (dialogKey: string): void => {
      const { viewedDialogs } = get();
      save({ ...viewedDialogs, [dialogKey]: true });
    };

    const isViewed = (dialogKey: string): boolean => {
      const { viewedDialogs } = get();
      return !!viewedDialogs[dialogKey];
    };

    return {
      get,
      save,
      cleanup,
      markAsViewed,
      isViewed,
    };
  }, [featureDialogs]);
};
