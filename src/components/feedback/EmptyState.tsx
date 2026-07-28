import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Compass, Sparkles, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Compass,
  title,
  description,
  actionText,
  actionPath,
  onAction,
}) => {
  return (
    <Card className="text-center py-14 px-6 max-w-xl mx-auto space-y-5 border border-slate-800">
      <div className="mx-auto w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {(actionText && (actionPath || onAction)) && (
        <div className="pt-2 flex justify-center">
          {actionPath ? (
            <Link to={actionPath}>
              <Button variant="glow" size="md">
                <Sparkles className="w-4 h-4" />
                <span>{actionText}</span>
              </Button>
            </Link>
          ) : (
            <Button variant="glow" size="md" onClick={onAction}>
              <Sparkles className="w-4 h-4" />
              <span>{actionText}</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
