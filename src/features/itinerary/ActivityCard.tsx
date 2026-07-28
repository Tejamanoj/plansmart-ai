import React, { useState } from 'react';
import type { Activity, ActivityCategory } from '@/types/trip';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import {
  MapPin,
  Clock,
  DollarSign,
  Compass,
  Utensils,
  Trees,
  Landmark,
  Smile,
  Moon,
  Camera,
  CheckCircle2,
  Star,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Save,
  type LucideIcon
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  dayNumber: number;
  onToggleComplete: (dayNumber: number, activityId: string) => void;
  onToggleFavorite: (dayNumber: number, activityId: string) => void;
  onDeleteActivity: (dayNumber: number, activityId: string) => void;
  onSaveNotes: (dayNumber: number, activityId: string, notes: string) => void;
}

const categoryIconMap: Record<ActivityCategory, LucideIcon> = {
  sightseeing: Camera,
  food: Utensils,
  outdoor: Trees,
  culture: Landmark,
  relaxation: Smile,
  nightlife: Moon,
};

const categoryBadgeVariantMap: Record<ActivityCategory, 'info' | 'success' | 'warning' | 'purple'> = {
  sightseeing: 'info',
  food: 'warning',
  outdoor: 'success',
  culture: 'purple',
  relaxation: 'success',
  nightlife: 'purple',
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  dayNumber,
  onToggleComplete,
  onToggleFavorite,
  onDeleteActivity,
  onSaveNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>(activity.notes || '');

  const IconComponent = categoryIconMap[activity.category] || Compass;
  const badgeVariant = categoryBadgeVariantMap[activity.category] || 'info';

  const handleSaveNotesSubmit = () => {
    onSaveNotes(dayNumber, activity.id, noteText);
    setIsEditingNotes(false);
  };

  return (
    <div className="relative pl-8 sm:pl-10 group">
      {/* Vertical Timeline Connection Line */}
      <div
        className={cn(
          'absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-0.5 transition-colors duration-300',
          activity.isCompleted ? 'bg-emerald-500/40' : 'bg-slate-800 group-hover:bg-sky-500/30'
        )}
      />

      {/* Circle Marker Node (Mark Completed Toggle) */}
      <button
        onClick={() => onToggleComplete(dayNumber, activity.id)}
        title={activity.isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        className={cn(
          'absolute left-1.5 sm:left-2 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 shadow-lg cursor-pointer',
          activity.isCompleted
            ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105'
            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-sky-500 hover:text-sky-400 hover:scale-110'
        )}
      >
        {activity.isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-slate-950 font-bold" />
        ) : (
          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        )}
      </button>

      {/* Activity Card Content */}
      <Card
        className={cn(
          'glass-card transition-all duration-300 p-4 sm:p-5 space-y-3.5 border',
          activity.isCompleted
            ? 'border-emerald-500/30 bg-emerald-950/10'
            : 'border-slate-800 hover:border-slate-700/60'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Title & Slot details */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onToggleComplete(dayNumber, activity.id)}
                className="cursor-pointer"
              >
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md transition-colors',
                    activity.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-sky-500/10 text-sky-400'
                  )}
                >
                  {activity.isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {activity.timeSlot}
                </span>
              </button>

              <Badge variant={badgeVariant} className="capitalize">
                {activity.category}
              </Badge>

              {activity.isFavorite && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Star className="w-2.5 h-2.5 fill-amber-400" /> Favorite
                </span>
              )}
            </div>

            <h4
              className={cn(
                'text-base sm:text-lg font-bold transition-colors',
                activity.isCompleted
                  ? 'line-through text-slate-400'
                  : 'text-white group-hover:text-sky-300'
              )}
            >
              {activity.title}
            </h4>
          </div>

          {/* Action Tools: Favorite, Expand, Delete */}
          <div className="flex items-center gap-1.5 self-start shrink-0">
            {/* Expense Badge */}
            <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-0.5 mr-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{activity.estimatedCost > 0 ? `${activity.estimatedCost}` : 'Free'}</span>
            </div>

            {/* Favorite Toggle */}
            <button
              onClick={() => onToggleFavorite(dayNumber, activity.id)}
              title={activity.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={cn(
                'p-1.5 rounded-lg border transition-all duration-200 cursor-pointer',
                activity.isFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700'
              )}
            >
              <Star className={cn('w-4 h-4', activity.isFavorite && 'fill-amber-400')} />
            </button>

            {/* Expand / Collapse Details Toggle */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? 'Collapse details' : 'Expand details'}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200 cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Delete Activity Button */}
            <button
              onClick={() => onDeleteActivity(dayNumber, activity.id)}
              title="Delete activity"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Short Description */}
        <p className={cn('text-xs sm:text-sm leading-relaxed', activity.isCompleted ? 'text-slate-500' : 'text-slate-300')}>
          {activity.description}
        </p>

        {/* Location Display */}
        {activity.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-medium truncate">{activity.location}</span>
          </div>
        )}

        {/* Expandable Section: Notes & Full Details */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Personal Notes
              </span>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs text-sky-400 hover:underline font-medium cursor-pointer"
                >
                  {activity.notes ? 'Edit Notes' : '+ Add Note'}
                </button>
              )}
            </div>

            {/* Notes Display or Editor */}
            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write your custom notes here (e.g. bring camera, reserve tickets in advance)..."
                  rows={3}
                  className="w-full resize-none rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingNotes(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleSaveNotesSubmit}>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 italic">
                {activity.notes ? activity.notes : 'No custom notes added yet.'}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
