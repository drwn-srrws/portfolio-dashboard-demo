import { useEffect, useRef, useCallback, useMemo } from "react";
import { useStore } from "@store/index";
import { Dialogs } from "@store/slices/dialogsSlice";
import { usePassedEvents } from "../dialogs/PassedEventsDialog/hooks/usePassedEvents";
import { useStaleEstimates } from "../dialogs/StaleEstimatesDialog/hooks/useStaleEstimates";
import { useOncePerDayModals, MODAL_KEYS } from "./useOncePerDayModals";

type ModalConfig = {
  dialog: Dialogs;
  modalKey: string;
  hasData: boolean;
  isLoading: boolean;
  isOpen: boolean;
};

export const useSequentialModals = ({
  disabled = false,
}: { disabled?: boolean } = {}) => {
  const { dialogs, updateDialog } = useStore();
  const { shouldShowModal, markAsCheckedToday, wasCheckedToday, cleanup } =
    useOncePerDayModals();

  const modalQueueRef = useRef<Dialogs[]>([]);
  const shownModalsRef = useRef<Set<Dialogs>>(new Set());
  const hasInitializedRef = useRef(false);

  const shouldFetchPassedEvents =
    !disabled && !wasCheckedToday(MODAL_KEYS.PASSED_EVENTS);
  const shouldFetchStaleEstimates =
    !disabled && !wasCheckedToday(MODAL_KEYS.STALE_ESTIMATES);

  const { hasPassedEvents, isLoading: isPassedEventsLoading } = usePassedEvents(
    false,
    shouldFetchPassedEvents
  );
  const { hasStaleEstimates, isLoading: isStaleEstimatesLoading } =
    useStaleEstimates(
      false,
      shouldFetchStaleEstimates && !isPassedEventsLoading
    );

  const isPassedDialogOpen = dialogs[Dialogs.openPassedEventsDialog];
  const isStaleEstimatesDialogOpen = dialogs[Dialogs.openStaleEstimatesDialog];

  const modalConfigs: ModalConfig[] = useMemo(
    () => [
      {
        dialog: Dialogs.openPassedEventsDialog,
        modalKey: MODAL_KEYS.PASSED_EVENTS,
        hasData: hasPassedEvents,
        isLoading: isPassedEventsLoading,
        isOpen: isPassedDialogOpen,
      },
      {
        dialog: Dialogs.openStaleEstimatesDialog,
        modalKey: MODAL_KEYS.STALE_ESTIMATES,
        hasData: hasStaleEstimates,
        isLoading: isStaleEstimatesLoading,
        isOpen: isStaleEstimatesDialogOpen,
      },
    ],
    [
      hasPassedEvents,
      isPassedEventsLoading,
      isPassedDialogOpen,
      hasStaleEstimates,
      isStaleEstimatesLoading,
      isStaleEstimatesDialogOpen,
    ]
  );

  const currentlyOpenModal =
    modalConfigs.find((config) => config.isOpen)?.dialog || null;
  const isAnyModalOpen = modalConfigs.some((config) => config.isOpen);

  const openNextModal = useCallback(() => {
    const nextModal = modalQueueRef.current[0];
    if (nextModal && !isAnyModalOpen) {
      updateDialog({ dialog: nextModal, status: true });
      shownModalsRef.current.add(nextModal);
      modalQueueRef.current.shift();

      const modalConfig = modalConfigs.find(
        (config) => config.dialog === nextModal
      );
      if (modalConfig) {
        markAsCheckedToday(modalConfig.modalKey);
      }
    }
  }, [isAnyModalOpen, updateDialog, modalConfigs, markAsCheckedToday]);

  const buildInitialQueue = useCallback(() => {
    cleanup(modalConfigs.map((config) => config.modalKey));

    const readyModals = modalConfigs
      .filter(
        (config) =>
          config.hasData &&
          !config.isLoading &&
          shouldShowModal(config.modalKey, config.hasData)
      )
      .map((config) => config.dialog)
      .filter((dialog) => !shownModalsRef.current.has(dialog));

    modalConfigs.forEach((config) => {
      if (!config.isLoading) {
        markAsCheckedToday(config.modalKey);
      }
    });

    modalQueueRef.current = readyModals;
    hasInitializedRef.current = true;

    if (readyModals.length > 0) {
      openNextModal();
    }
  }, [
    modalConfigs,
    openNextModal,
    shouldShowModal,
    cleanup,
    markAsCheckedToday,
  ]);

  useEffect(() => {
    if (
      !hasInitializedRef.current &&
      !isPassedEventsLoading &&
      !isStaleEstimatesLoading
    ) {
      buildInitialQueue();
      return;
    }

    if (!hasInitializedRef.current) {
      const newReadyModals = modalConfigs
        .filter(
          (config) =>
            config.hasData &&
            !config.isLoading &&
            shouldShowModal(config.modalKey, config.hasData)
        )
        .map((config) => config.dialog)
        .filter(
          (dialog) =>
            !shownModalsRef.current.has(dialog) &&
            !modalQueueRef.current.includes(dialog)
        );

      if (newReadyModals.length > 0) {
        modalQueueRef.current.push(...newReadyModals);

        if (!isAnyModalOpen) {
          openNextModal();
        }
      }
    }

    if (
      hasInitializedRef.current &&
      !isAnyModalOpen &&
      modalQueueRef.current.length > 0
    ) {
      openNextModal();
    }
  }, [
    hasPassedEvents,
    hasStaleEstimates,
    isPassedEventsLoading,
    isStaleEstimatesLoading,
    isAnyModalOpen,
    modalConfigs,
    buildInitialQueue,
    openNextModal,
    shouldShowModal,
  ]);

  return {
    hasPassedEvents,
    hasStaleEstimates,
    isPassedEventsLoading,
    isStaleEstimatesLoading,
    isAnyModalOpen,
    currentlyOpenModal,
    remainingInQueue: modalQueueRef.current.length,
    shownModals: Array.from(shownModalsRef.current),
  };
};
