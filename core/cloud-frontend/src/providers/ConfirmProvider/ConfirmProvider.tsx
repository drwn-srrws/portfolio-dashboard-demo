import { ReactNode, useCallback, useRef, useState } from "react";
import { ConfirmDialog, ConfirmDialogProps } from "@components/ConfirmDialog";
import { ConfirmContext } from "./ConfirmContext";

export interface ConfirmProviderProps {
  children: ReactNode;
}

export type ConfirmDetails = Omit<
  ConfirmDialogProps,
  "open" | "onConfirm" | "onClose"
>;

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const promiseResolveRef = useRef<((value: boolean) => void) | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [confirmProps, setConfirmProps] = useState<Omit<
    ConfirmDialogProps,
    "open" | "onConfirm" | "onClose"
  > | null>(null);

  const confirm = useCallback((props: ConfirmDetails) => {
    setIsOpen(true);
    setConfirmProps(props);

    return new Promise<boolean>((resolve) => {
      promiseResolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (promiseResolveRef.current) {
      promiseResolveRef.current(true);
    }

    setIsOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (promiseResolveRef.current) {
      promiseResolveRef.current(false);
    }

    setIsOpen(false);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmProps && (
        <ConfirmDialog
          {...confirmProps}
          open={isOpen}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};
