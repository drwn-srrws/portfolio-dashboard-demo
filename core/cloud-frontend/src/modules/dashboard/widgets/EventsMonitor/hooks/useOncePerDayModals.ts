import { useStore } from "@store/index";
import { useCallback } from "react";

export const useOncePerDayModals = () => {
  const {
    markModalAsCheckedToday,
    wasModalCheckedToday,
    shouldShowModal: shouldShowModalFromStore,
    resetModal,
    resetAllModals,
    cleanupOldModalEntries,
    modalTracking,
  } = useStore();

  const markAsCheckedToday = useCallback(
    (modalKey: string) => {
      markModalAsCheckedToday(modalKey);
    },
    [markModalAsCheckedToday]
  );

  const wasCheckedToday = useCallback(
    (modalKey: string): boolean => {
      return wasModalCheckedToday(modalKey);
    },
    [wasModalCheckedToday]
  );

  const shouldShowModal = useCallback(
    (modalKey: string, hasData: boolean): boolean => {
      return shouldShowModalFromStore(modalKey, hasData);
    },
    [shouldShowModalFromStore]
  );

  const cleanup = useCallback(
    (validModalKeys: string[]): void => {
      cleanupOldModalEntries(validModalKeys);
    },
    [cleanupOldModalEntries]
  );

  const resetModalCallback = useCallback(
    (modalKey: string): void => {
      resetModal(modalKey);
    },
    [resetModal]
  );

  const resetAllModalsCallback = useCallback((): void => {
    resetAllModals();
  }, [resetAllModals]);

  const get = useCallback(() => {
    return modalTracking;
  }, [modalTracking]);

  return {
    markAsCheckedToday,
    wasCheckedToday,
    shouldShowModal,
    cleanup,
    resetModal: resetModalCallback,
    resetAllModals: resetAllModalsCallback,
    get,
  };
};

export { MODAL_KEYS, type ModalKey } from "@store/slices/modalTrackingSlice";
