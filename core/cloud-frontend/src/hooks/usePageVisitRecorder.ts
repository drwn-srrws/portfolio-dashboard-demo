import { useMemo, useCallback } from "react";
import { useConfig } from "../providers/ConfigProvider";
import { useStore } from "@/store";
import type { PageVisitRecorderItem } from "@/store/slices/pageVisitRecorderSlice";
import { IconNameType } from "@/components/Icon/Icon";

const MAX_RECENT_PAGES = 40;

export interface UsePageVisitRecorderResult {
  recentPages: PageVisitRecorderItem[];
  defaultPages: PageVisitRecorderItem[];
  trackablePages: { url: string; title: string; icon?: IconNameType }[];
  recordPageVisit: (
    page: Pick<PageVisitRecorderItem, "url" | "title" | "icon">
  ) => void;
  clearHistory: () => void;
}

const updateRecentPages = (
  prevPages: PageVisitRecorderItem[],
  newPage: Pick<PageVisitRecorderItem, "url" | "title" | "icon">
): PageVisitRecorderItem[] => {
  const now = new Date().toISOString();
  const existingIndex = prevPages.findIndex((p) => p.url.includes(newPage.url));
  const isPageExisting = existingIndex !== -1;

  if (isPageExisting) {
    return prevPages.map((p, index) => {
      if (index === existingIndex) {
        return {
          ...p,
          visitCount: (p.visitCount || 0) + 1,
          lastVisited: now,
        };
      }
      return p;
    });
  }

  const newPageItem: PageVisitRecorderItem = {
    ...newPage,
    lastVisited: now,
    visitCount: 1,
  };

  return [...prevPages, newPageItem].slice(-MAX_RECENT_PAGES);
};

export const usePageVisitRecorder = (): UsePageVisitRecorderResult => {
  const { navItems, defaultRecentlyViewedPages } = useConfig();
  const { recentPages, setRecentPages, clearHistory } = useStore();

  const trackablePages = useMemo(() => {
    return navItems.flatMap((group) =>
      (group.children || []).map((item) => ({
        url: item?.url,
        title: item?.metadata?.title || item?.text,
        icon: item?.icon,
      }))
    );
  }, [navItems]);

  const recordPageVisit = useCallback(
    (page: Pick<PageVisitRecorderItem, "url" | "title" | "icon">) => {
      setRecentPages(updateRecentPages(recentPages, page));
    },
    [recentPages, setRecentPages]
  );

  return {
    trackablePages,
    recentPages,
    defaultPages: defaultRecentlyViewedPages,
    recordPageVisit,
    clearHistory,
  };
};
