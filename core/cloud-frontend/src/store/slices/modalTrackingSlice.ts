export interface ModalTrackingData {
  lastChecked: Record<string, string>;
}

export interface ModalTrackingState {
  modalTracking: ModalTrackingData;
}

export interface ModalTrackingActions {
  markModalAsCheckedToday: (modalKey: string) => void;
  wasModalCheckedToday: (modalKey: string) => boolean;
  shouldShowModal: (modalKey: string, hasData: boolean) => boolean;
  resetModal: (modalKey: string) => void;
  resetAllModals: () => void;
  cleanupOldModalEntries: (validModalKeys: string[]) => void;
}

export type ModalTrackingStore = ModalTrackingState & ModalTrackingActions;

const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const modalTrackingSlice = (
  set: (
    partial:
      | Partial<ModalTrackingStore>
      | ((state: ModalTrackingStore) => Partial<ModalTrackingStore>)
  ) => void,
  get: () => ModalTrackingStore
): ModalTrackingStore => ({
  modalTracking: {
    lastChecked: {},
  },

  markModalAsCheckedToday: (modalKey: string) => {
    const today = getTodayDateString();
    set((state) => ({
      modalTracking: {
        ...state.modalTracking,
        lastChecked: {
          ...(state.modalTracking.lastChecked || {}),
          [modalKey]: today,
        },
      },
    }));
  },

  wasModalCheckedToday: (modalKey: string): boolean => {
    const today = getTodayDateString();
    const { modalTracking } = get();
    if (!modalTracking.lastChecked) return false;
    return modalTracking.lastChecked[modalKey] === today;
  },

  shouldShowModal: (modalKey: string, hasData: boolean): boolean => {
    const { wasModalCheckedToday } = get();
    return hasData && !wasModalCheckedToday(modalKey);
  },

  resetModal: (modalKey: string) => {
    set((state) => {
      const newLastChecked = { ...(state.modalTracking.lastChecked || {}) };
      delete newLastChecked[modalKey];
      return {
        modalTracking: {
          ...state.modalTracking,
          lastChecked: newLastChecked,
        },
      };
    });
  },

  resetAllModals: () => {
    set(() => ({
      modalTracking: {
        lastChecked: {},
      },
    }));
  },

  cleanupOldModalEntries: (validModalKeys: string[]) => {
    const today = getTodayDateString();
    const { modalTracking } = get();

    const filterEntries = (entries: Record<string, string> = {}) =>
      Object.entries(entries)
        .filter(([key, dateString]) => {
          if (!validModalKeys.includes(key)) return false;

          const daysDiff = Math.floor(
            (new Date(today).getTime() - new Date(dateString).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return daysDiff <= 7;
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    set((state) => ({
      modalTracking: {
        ...state.modalTracking,
        lastChecked: filterEntries(modalTracking.lastChecked || {}),
      },
    }));
  },
});

export const MODAL_KEYS = {
  STALE_ESTIMATES: "stale-estimates",
  PASSED_EVENTS: "passed-events",
} as const;

export type ModalKey = (typeof MODAL_KEYS)[keyof typeof MODAL_KEYS];
