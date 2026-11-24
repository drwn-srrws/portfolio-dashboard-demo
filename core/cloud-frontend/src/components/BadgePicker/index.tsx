import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Sortable } from "@components/Sortable/Sortable";
import { Selectable } from "@typings/Selectable";
import { BadgeItem } from "./components/BadgeItem";

const disableSortingStrategy = () => null;

export interface BadgePickerProps {
  value: Selectable[];
  onChange: (value: Selectable[]) => void;
}

export const BadgePicker = ({ value, onChange }: BadgePickerProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeOption = useMemo(() => {
    return value.find((option) => option?.value === activeId);
  }, [value, activeId]);

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  const handleDelete = useCallback(
    (option: Selectable) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onChange(value.filter((value) => value.value !== option.value));
    },
    [onChange, value]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      const activeIndex = value.findIndex(
        (option) => option.value === active.id
      );

      const overIndex = value.findIndex((option) => option.value === over?.id);

      if (over && active.id !== over.id) {
        onChange(arrayMove(value, activeIndex, overIndex));
      }
    },
    [onChange, value]
  );

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(`${event.active.id}`);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={value?.map((option) => String(option?.value))}
        strategy={disableSortingStrategy}
      >
        <div className="flex flex-wrap gap-2" data-testid="badge-picker">
          {value?.map((option) => (
            <Sortable key={String(option?.value)} id={String(option?.value)}>
              <BadgeItem
                key={String(option?.value)}
                label={option?.label}
                className="cursor-grab"
                onClick={handleClick}
                onDelete={handleDelete(option)}
                testId={`${option?.value}`}
              />
            </Sortable>
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay>
          {activeOption && (
            <BadgeItem
              label={activeOption.label}
              className="pointer-events-auto cursor-grabbing"
              testId={`badge-picker-drag-overlay-${activeOption?.value}`}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
