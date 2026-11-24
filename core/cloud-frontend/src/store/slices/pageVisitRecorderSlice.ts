import { IconNameType } from "@/components/Icon/Icon";

export interface PageVisitRecorderItem {
  url: string;
  title: string;
  icon?: IconNameType;
  visitCount?: number;
  lastVisited?: string;
}

export interface PageVisitRecorderState {
  recentPages: PageVisitRecorderItem[];
}

export interface PageVisitRecorderActions {
  setRecentPages: (pages: PageVisitRecorderItem[]) => void;
  clearHistory: () => void;
}

export type PageVisitRecorderStore = PageVisitRecorderState &
  PageVisitRecorderActions;

export const pageVisitRecorderSlice = (
  set: (
    partial:
      | Partial<PageVisitRecorderStore>
      | ((state: PageVisitRecorderStore) => Partial<PageVisitRecorderStore>)
  ) => void
): PageVisitRecorderStore => ({
  recentPages: [],
  setRecentPages: (pages) => set({ recentPages: pages }),
  clearHistory: () => set({ recentPages: [] }),
});
