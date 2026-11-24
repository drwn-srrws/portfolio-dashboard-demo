import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmButtonText: string;
  disableOverlay?: boolean;
  anchor?: { horizontal: "left" | "right"; vertical: "top" | "bottom" };
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmButtonText,
  disableOverlay,
  anchor,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Dialog
    open={open}
    data-testid="delete-dashboard-dialog"
    onOpenChange={onClose}
  >
    <DialogContent
      disableOverlay={disableOverlay}
      anchor={anchor}
      className="gap-6 border border-solid border-neutral-700 bg-[var(--neutral-900)] sm:max-w-sm"
    >
      <DialogHeader className="gap-2">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="sm:justify-between">
        <DialogClose asChild data-testid="delete-dashboard-dialog-close-button">
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button
          variant="secondary"
          onClick={onConfirm}
          data-testid="confirm-dialog-confirm-button"
        >
          {confirmButtonText}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
