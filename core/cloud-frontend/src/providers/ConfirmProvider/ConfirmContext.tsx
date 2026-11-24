import { createContext } from "react";
import { ConfirmDialogProps } from "@components/ConfirmDialog";

export interface IConfirmContext {
  confirm: (
    props: Omit<ConfirmDialogProps, "open" | "onConfirm" | "onClose">
  ) => Promise<boolean>;
}

export const ConfirmContext = createContext<IConfirmContext>({
  confirm: () => Promise.resolve(false),
});
