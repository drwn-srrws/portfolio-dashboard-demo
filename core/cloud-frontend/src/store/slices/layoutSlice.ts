export interface LayoutState {
  isSidebarOpen: boolean;
  isHeaderVisible: boolean;
}

export interface LayoutActions {
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleHeader: () => void;
  setHeaderVisible: (isVisible: boolean) => void;
}

export type LayoutStore = LayoutState & LayoutActions;

export const layoutSlice = (
  set: (
    partial:
      | Partial<LayoutStore>
      | ((state: LayoutStore) => Partial<LayoutStore>)
  ) => void
): LayoutStore => ({
  isSidebarOpen: true,
  isHeaderVisible: true,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  setSidebarOpen: (isOpen: boolean) =>
    set({
      isSidebarOpen: isOpen,
    }),

  toggleHeader: () =>
    set((state) => ({
      isHeaderVisible: !state.isHeaderVisible,
    })),

  setHeaderVisible: (isVisible: boolean) =>
    set({
      isHeaderVisible: isVisible,
    }),
});
