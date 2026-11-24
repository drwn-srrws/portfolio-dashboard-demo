export enum Dialogs {
  saveScreenDialog = "saveScreenDialog",
  openScreenDialog = "openScreenDialog",
  editSecurityDialog = "editSecurityDialog",
  editSecurity2Dialog = "editSecurity2Dialog",
  securityDialog = "securityDialog",
  companyDialog = "companyDialog",
  coverageDialog = "coverageDialog",
  instrumentGroupDialog = "instrumentGroupDialog",
  eventDialog = "eventDialog",
  openPassedEventsDialog = "openPassedEventsDialog",
  openStaleEstimatesDialog = "openStaleEstimatesDialog",
  openEventDetailDialog = "openEventDetailDialog",
  createEstimateDialog = "createEstimateDialog",
  openPendingChangesDialog = "openPendingChangesDialog",
}

export interface UpdateDialogProps {
  dialog: `${Dialogs}`;
  status: boolean;
  prefilled?: unknown;
}

export interface DialogsState {
  dialogs: {
    [key in Dialogs]: boolean;
  };
  prefilled: unknown;
}

export interface DialogsActions {
  updateDialog: ({ dialog, status, prefilled }: UpdateDialogProps) => void;
  closeAllDialogs: () => void;
}

export type DialogsStore = DialogsState & DialogsActions;

export const dialogsSlice = (
  set: (
    partial:
      | Partial<DialogsStore>
      | ((state: DialogsStore) => Partial<DialogsStore>)
  ) => void,
  get: () => DialogsStore
): DialogsStore => ({
  dialogs: {
    [Dialogs.saveScreenDialog]: false,
    [Dialogs.openScreenDialog]: false,
    [Dialogs.editSecurityDialog]: false,
    [Dialogs.editSecurity2Dialog]: false,
    [Dialogs.securityDialog]: false,
    [Dialogs.companyDialog]: false,
    [Dialogs.coverageDialog]: false,
    [Dialogs.instrumentGroupDialog]: false,
    [Dialogs.eventDialog]: false,
    [Dialogs.openPassedEventsDialog]: false,
    [Dialogs.openStaleEstimatesDialog]: false,
    [Dialogs.openEventDetailDialog]: false,
    [Dialogs.createEstimateDialog]: false,
    [Dialogs.openPendingChangesDialog]: false,
  },
  prefilled: {},
  updateDialog: ({ dialog, status, prefilled }: UpdateDialogProps) =>
    set({ dialogs: { ...get().dialogs, [dialog]: status }, prefilled }),
  closeAllDialogs: () =>
    set({
      dialogs: Object.keys(get().dialogs).reduce(
        (acc: { [key in Dialogs]: boolean }, key) => ({ ...acc, [key]: false }),
        {} as { [key in Dialogs]: boolean }
      ),
    }),
});
