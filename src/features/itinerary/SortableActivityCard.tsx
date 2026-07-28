import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActivityCard } from './ActivityCard';
import type { Activity } from '@/types/trip';
import { GripVertical } from 'lucide-react';

interface SortableActivityCardProps {
  activity: Activity;
  dayNumber: number;
  onToggleComplete: (dayNumber: number, activityId: string) => void;
  onToggleFavorite: (dayNumber: number, activityId: string) => void;
  onDeleteActivity: (dayNumber: number, activityId: string) => void;
  onSaveNotes: (dayNumber: number, activityId: string, notes: string) => void;
}

/**
 * SortableActivityCard — wraps ActivityCard with dnd-kit useSortable hook.
 *
 * useSortable provides:
 *  - attributes  : ARIA attributes for screen-reader accessibility (role, aria-pressed, aria-roledescription)
 *  - listeners   : pointer + keyboard event handlers that activate drag
 *  - setNodeRef  : ref callback that registers the DOM node with the DragDropContext
 *  - transform   : CSS translate X/Y applied during drag to move the element
 *  - transition  : smooth CSS transition on drop (null while dragging for performance)
 *  - isDragging  : boolean flag for visual feedback during active drag
 */
export const SortableActivityCard: React.FC<SortableActivityCardProps> = ({
  activity,
  dayNumber,
  onToggleComplete,
  onToggleFavorite,
  onDeleteActivity,
  onSaveNotes,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle — positioned absolutely so it doesn't interfere with card layout */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder activity"
        title="Drag to reorder"
        className="absolute -left-7 top-6 z-20 p-1 rounded-md text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 transition-colors cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <ActivityCard
        activity={activity}
        dayNumber={dayNumber}
        onToggleComplete={onToggleComplete}
        onToggleFavorite={onToggleFavorite}
        onDeleteActivity={onDeleteActivity}
        onSaveNotes={onSaveNotes}
      />
    </div>
  );
};
