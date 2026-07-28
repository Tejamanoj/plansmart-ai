import React from 'react';
import type { Activity, ActivityCategory } from '@/types/trip';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
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
  type LucideIcon
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
}

// Map categories to modern icons
const categoryIconMap: Record<ActivityCategory, LucideIcon> = {
  sightseeing: Camera,
  food: Utensils,
  outdoor: Trees,
  culture: Landmark,
  relaxation: Smile,
  nightlife: Moon,
};

// Map categories to color badge variants
const categoryBadgeVariantMap: Record<ActivityCategory, 'info' | 'success' | 'warning' | 'purple'> = {
  sightseeing: 'info',
  food: 'warning',
  outdoor: 'success',
  culture: 'purple',
  relaxation: 'success',
  nightlife: 'purple',
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const IconComponent = categoryIconMap[activity.category] || Compass;
  const badgeVariant = categoryBadgeVariantMap[activity.category] || 'info';

  return (
    <div className="relative pl-8 sm:pl-10 group">
      {/* Vertical Timeline Connection Line */}
      <div className="absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-0.5 bg-slate-800 group-last:bottom-1/2 group-hover:bg-sky-500/30 transition-colors duration-300" />

      {/* Circle Marker Node */}
      <div className="absolute left-1.5 sm:left-2 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-sky-500 group-hover:text-sky-400 group-hover:scale-110 transition-all duration-300 z-10 shadow-lg">
        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      {/* Activity Content Card */}
      <Card className="glass-card hover:border-slate-700/60 transition-all duration-300 p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          {/* Title & Slot details */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" /> {activity.timeSlot}
              </span>
              <Badge variant={badgeVariant} className="capitalize">
                {activity.category}
              </Badge>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              {activity.title}
            </h4>
          </div>

          {/* Cost Badge */}
          <div className="self-start px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-0.5 shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{activity.estimatedCost > 0 ? `${activity.estimatedCost} est.` : 'Free'}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {activity.description}
        </p>

        {/* Location Display */}
        {activity.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-medium">{activity.location}</span>
          </div>
        )}
      </Card>
    </div>
  );
};
