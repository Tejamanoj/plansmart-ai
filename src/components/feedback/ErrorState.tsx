import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onReset?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
  onReset,
}) => {
  return (
    <Card className="max-w-xl mx-auto text-center p-8 space-y-6 border border-rose-500/30 bg-rose-950/10 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="mx-auto w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <Button variant="glow" size="md" onClick={onRetry} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}

        {onReset && (
          <Button variant="secondary" size="md" onClick={onReset} className="w-full sm:w-auto">
            <span>Reset Inputs</span>
          </Button>
        )}

        <Link to="/" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full">
            <Compass className="w-4 h-4" />
            <span>Go Home</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
};
