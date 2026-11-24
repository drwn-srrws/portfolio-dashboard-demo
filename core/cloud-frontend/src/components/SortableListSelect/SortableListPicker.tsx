import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/Icon/Icon";
import { Sortable } from "@components/Sortable/Sortable";
import { Selectable } from "@typings/Selectable";

import { VirtualList } from "../VirtualList";
import { Tooltip } from "../Tooltip/Tooltip";

export interface SortableListPickerProps {
  value: Selectable[];
  onChange: (value: string[]) => void;
  testId?: string;
  isEmptyState?: boolean;
}

export const SortableListPicker = ({
  value,
  onChange,
  testId,
  isEmptyState = false,
}: SortableListPickerProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeOption = useMemo(() => {
    return value.find((option) => option?.value === activeId);
  }, [value, activeId]);

  const handleDelete = useCallback(
    (optionValue: string) => {
      onChange(
        value
          .map((v) => String(v.value))
          .filter((value) => value !== optionValue)
      );
    },
    [onChange, value]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = value.findIndex(
          (v) => v.value === active.id.toString()
        );
        const newIndex = value.findIndex((v) => v.value === over.id.toString());

        onChange(
          arrayMove(value, oldIndex, newIndex).map((v) => String(v.value))
        );
      }
    },
    [onChange, value]
  );

  if (isEmptyState && value.length === 0) {
    return (
      <div className="flex items-center justify-center relative rounded-md border border-neutral-700 p-2 min-h-[156px] max-h-[156px]">
        <span className="text-base text-neutral-500">No Value Selected</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToFirstScrollableAncestor]}
    >
      <div
        className={`relative rounded-md border border-neutral-700 p-2 ${
          isEmptyState ? "min-h-[156px]" : ""
        } max-h-[156px]`}
      >
        <SortableContext
          items={value.map((option) => String(option.value))}
          strategy={verticalListSortingStrategy}
        >
          <VirtualList
            items={value}
            maxHeight={144}
            testId={`${testId}-sortable-list`}
          >
            {(option) => (
              <Sortable
                key={String(option.value)}
                id={String(option.value)}
                useDragHandle
                dragHandle={
                  <Icon
                    name="GripVertical"
                    size="lg"
                    color="#a3a3a3"
                    className="cursor-grab"
                  />
                }
              >
                <div className="flex w-full items-center justify-between rounded-md bg-transparent p-2 transition-colors duration-150">
                  {option.tooltip ? (
                    <Tooltip
                      content={option.tooltip}
                      side="right"
                      trigger={<span>{option.label}</span>}
                    />
                  ) : (
                    <span>{option.label}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(String(option.value))}
                      className="text-neutral-400"
                    >
                      <Icon color="#a3a3a3" name="X" size="lg" />
                    </button>
                  </div>
                </div>
              </Sortable>
            )}
          </VirtualList>
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeOption && (
              <Sortable
                id={String(activeOption.value)}
                useDragHandle
                dragHandle={
                  <Icon
                    name="GripVertical"
                    size="lg"
                    color="#a3a3a3"
                    className="cursor-grab"
                  />
                }
              >
                <div className="flex w-full items-center justify-between rounded-md bg-neutral-800 p-2">
                  <span>{activeOption.label}</span>
                  <Icon
                    color="#a3a3a3"
                    name="X"
                    size="lg"
                    className="text-neutral-400"
                  />
                </div>
              </Sortable>
            )}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
};
