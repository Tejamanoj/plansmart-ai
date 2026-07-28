import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useTripContext } from '@/context/useTripContext';
import { aiService } from '@/services/aiService';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import type { TripItinerary } from '@/types/trip';
import {
  Sparkles,
  Send,
  Loader2,
  Lightbulb,
  RotateCcw,
  CheckCircle,
  Calendar,
  MapPin,
  DollarSign,
  Compass,
  ArrowRight,
  Clock
} from 'lucide-react';

/** Maximum character limit for the trip prompt textarea */
const MAX_CHARS = 1000;

/** Placeholder example prompts users can click to auto-fill the textarea */
const EXAMPLE_PROMPTS = [
  'Plan a 5-day budget trip to Tokyo, Japan for 2 people with ₹80,000. We love street food, temples, and anime culture.',
  'Create a 3-day luxury Paris itinerary for a honeymoon couple. Budget: $3,000. Include fine dining and Seine river cruise.',
  'Suggest a 7-day family-friendly Bali vacation with kids under 10. Budget: $2,500. Focus on beaches, water parks, and wildlife.',
  'Plan a 4-day adventure trip to Swiss Alps. Budget: €2,000. Include hiking, paragliding, and scenic train rides.',
];

/**
 * PlannerForm — Trip Planning Form Component
 */
export const PlannerForm: React.FC = () => {
  const { saveTrip } = useTripContext();

  // ── State ──────────────────────────────────────────────────────────
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slowResponseNotice, setSlowResponseNotice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [generatedTrip, setGeneratedTrip] = useState<TripItinerary | null>(null);

  // ── Refs ───────────────────────────────────────────────────────────
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Derived / Memoised Values ──────────────────────────────────────
  const charCount = useMemo(() => prompt.length, [prompt]);

  const isValid = useMemo(
    () => prompt.trim().length >= 10 && prompt.length <= MAX_CHARS,
    [prompt]
  );

  const counterColor = useMemo(() => {
    if (charCount > MAX_CHARS) return 'text-rose-400';
    if (charCount > MAX_CHARS * 0.85) return 'text-amber-400';
    return 'text-slate-400';
  }, [charCount]);

  // ── Effects ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!generatedTrip && !isLoading && !error) {
      textareaRef.current?.focus();
    }
  }, [generatedTrip, isLoading, error]);

  // Clean up slow response timer
  useEffect(() => {
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────

  /** Validates input and triggers backend generate request with resilience & retry handling */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setHasSubmitted(true);

      // Validation check
      if (!prompt.trim()) {
        setError('Please describe your trip before generating a plan.');
        return;
      }
      if (prompt.trim().length < 10) {
        setError('Your description is too short. Add more detail (min 10 characters).');
        return;
      }
      if (prompt.length > MAX_CHARS) {
        setError(`Prompt exceeds the ${MAX_CHARS} character limit.`);
        return;
      }

      setError(null);
      setIsLoading(true);
      setSlowResponseNotice(false);
      setGeneratedTrip(null);

      // Slow response timer notice (triggers if response takes > 6 seconds)
      slowTimerRef.current = setTimeout(() => {
        setSlowResponseNotice(true);
      }, 6000);

      try {
        // Send request to server endpoint via API Service
        const tripPlan = await aiService.generateItinerary(prompt);
        
        // Save to LocalStorage context for persistence
        saveTrip(tripPlan);
        setGeneratedTrip(tripPlan);
      } catch (err: unknown) {
        console.error('API integration failure:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to the backend server. Please verify the server is running on port 5000.';
        setError(errorMessage);
      } finally {
        if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
        setIsLoading(false);
        setSlowResponseNotice(false);
      }
    },
    [prompt, saveTrip]
  );

  /** Fill the textarea with an example prompt */
  const handleExampleClick = useCallback((example: string) => {
    setPrompt(example);
    setError(null);
    setHasSubmitted(false);
    setGeneratedTrip(null);
    textareaRef.current?.focus();
  }, []);

  /** Reset the form to its initial state */
  const handleClear = useCallback(() => {
    setPrompt('');
    setError(null);
    setHasSubmitted(false);
    setGeneratedTrip(null);
    textareaRef.current?.focus();
  }, []);

  // ── Render 1: Error State with Retry Button ─────────────────────────
  if (error && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <ErrorState
          title="Trip Generation Failed"
          message={error}
          onRetry={() => handleSubmit()}
          onReset={handleClear}
        />
      </div>
    );
  }

  // ── Render 2: Loading State with Skeleton & Slow Notice ────────────
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {slowResponseNotice && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
              <span>Generative AI is crafting your detailed itinerary... (taking slightly longer than usual)</span>
            </div>
            <Badge variant="warning" className="shrink-0">Processing</Badge>
          </div>
        )}
        <LoadingSkeleton type="itinerary" />
      </div>
    );
  }

  // ── Render 3: Successful Generation Confirmation Card ────────────────
  if (generatedTrip) {
    const totalActivities = generatedTrip.days.reduce(
      (sum, day) => sum + day.activities.length,
      0
    );

    return (
      <Card className="max-w-2xl mx-auto space-y-6 border border-emerald-500/25 bg-emerald-950/10 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Trip Generated Successfully!</h2>
            <p className="text-sm text-slate-400 max-w-md">
              PlanSmart AI created a tailored travel itinerary based on your preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Destination</span>
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400" /> {generatedTrip.destination}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Duration & Style</span>
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" /> {generatedTrip.durationDays} Days • {generatedTrip.travelStyle}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Expenses</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> {generatedTrip.totalBudget} {generatedTrip.currency}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Planned Schedule</span>
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" /> {totalActivities} curated activities
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to={`/itinerary/${generatedTrip.id}`} className="flex-1">
            <Button variant="glow" size="lg" className="w-full">
              <span>View Full Itinerary Details</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={handleClear}>
            Plan Another Trip
          </Button>
        </div>
      </Card>
    );
  }

  // ── Render 4: Form Input ───────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {/* ── Main Input Card ─────────────────────────────────────── */}
      <Card className="space-y-5 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Describe Your Dream Trip</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tell the AI where, when, and how you want to travel</p>
            </div>
          </div>
          <Badge variant="info">AI Powered</Badge>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            id="trip-prompt"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Example: Plan a 5-day budget trip to Tokyo for 2 people. We love street food, temples, and anime culture. Budget is ₹80,000..."
            rows={7}
            maxLength={MAX_CHARS + 50}
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby="prompt-error"
            className="w-full resize-none rounded-xl bg-slate-900/80 border border-slate-700/80 px-4 py-3.5 text-slate-100 text-sm leading-relaxed placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-xs text-slate-500">
              {prompt.trim().length < 10 && hasSubmitted && (
                <span className="text-amber-400">Minimum 10 characters required</span>
              )}
            </div>
            <span className={`text-xs font-mono font-medium tabular-nums ${counterColor}`}>
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <Button
            type="submit"
            variant="glow"
            size="lg"
            disabled={isLoading || !isValid}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Itinerary…</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Generate Trip Plan</span>
              </>
            )}
          </Button>

          {prompt.length > 0 && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleClear}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </Card>

      {/* ── Example Prompts Card ────────────────────────────────── */}
      <Card className="space-y-4 border border-slate-800/60">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">Need inspiration? Try an example</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_PROMPTS.map((example, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleExampleClick(example)}
              className="text-left p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed hover:bg-slate-800/80 hover:border-sky-500/30 hover:text-slate-100 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="line-clamp-2">{example}</span>
            </button>
          ))}
        </div>
      </Card>
    </form>
  );
};
