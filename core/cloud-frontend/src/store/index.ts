import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dialogsSlice, DialogsStore } from "./slices/dialogsSlice";
import { layoutSlice, LayoutStore } from "./slices/layoutSlice";
import {
  pageVisitRecorderSlice,
  PageVisitRecorderStore,
} from "./slices/pageVisitRecorderSlice";
import {
  modalTrackingSlice,
  ModalTrackingStore,
} from "./slices/modalTrackingSlice";

export const useStore = create<
  DialogsStore & LayoutStore & PageVisitRecorderStore & ModalTrackingStore
>()(
  persist(
    (set, get) => ({
      ...dialogsSlice(set, get),
      ...layoutSlice(set),
      ...pageVisitRecorderSlice(set),
      ...modalTrackingSlice(set, get),
    }),
    {
      name: "storage",
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        isHeaderVisible: state.isHeaderVisible,
        recentPages: state.recentPages,
        modalTracking: state.modalTracking,
      }),
    }
  )
);
