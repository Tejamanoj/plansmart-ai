import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="text-7xl font-extrabold text-sky-500/30">404</div>
      <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md">
        The destination route you are trying to reach does not exist or has been moved.
      </p>
      <Link to="/">
        <Button size="md" className="mt-2">
          <Compass className="w-4 h-4" /> Return to Home
        </Button>
      </Link>
    </div>
  );
};
