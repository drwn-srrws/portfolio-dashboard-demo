import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode } from "react";

import { Icon } from "@/components/Icon/Icon";

interface SortableProps {
  id: string;
  children: ReactNode;
  useDragHandle?: boolean;
  label?: string;
  onDelete?: (id: string) => void;
  dragHandle?: ReactNode;
}

export const Sortable = ({
  id,
  children,
  useDragHandle = false,
  label,
  onDelete,
  dragHandle,
}: SortableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transition,
    transform: CSS.Translate.toString(transform),
    visibility: isDragging ? "hidden" : undefined,
  };

  if (useDragHandle && label) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between rounded-md bg-transparent p-2 transition-colors duration-150 hover:bg-neutral-800"
      >
        <div className="flex items-center gap-2">
          {dragHandle && (
            <div {...attributes} {...listeners}>
              {dragHandle}
            </div>
          )}
          <span>{label}</span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-neutral-400 hover:text-neutral-200"
          >
            <Icon color="#a3a3a3" name="X" size="lg" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md bg-transparent transition-colors duration-150 hover:bg-neutral-800"
    >
      {useDragHandle ? (
        <div className="flex items-center">
          {dragHandle && (
            <div {...attributes} {...listeners}>
              {dragHandle}
            </div>
          )}
          {children}
        </div>
      ) : (
        <div {...attributes} {...listeners}>
          {children}
        </div>
      )}
    </div>
  );
};
