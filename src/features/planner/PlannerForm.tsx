import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  Lightbulb,
  RotateCcw,
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
 * PlannerForm — Trip Planning Form Component (Milestone 3)
 *
 * React Hooks used:
 * ─────────────────
 * • useState    — Manages local form state: prompt text, loading flag, error message, and submitted flag.
 * • useCallback — Memoises event handler functions (handleSubmit, handleExampleClick, handleClear)
 *                 so they are not recreated on every render. Improves performance and satisfies
 *                 dependency arrays of child components or effects.
 * • useMemo     — Derives computed values (character count, whether input is valid, counter color)
 *                 without recalculating on every render — only when `prompt` changes.
 * • useRef      — Holds a mutable reference to the <textarea> DOM node so we can programmatically
 *                 call `.focus()` after clearing or clicking an example prompt.
 * • useEffect   — Auto-focuses the textarea when the component first mounts, giving the user an
 *                 immediate typing target.
 */
export const PlannerForm: React.FC = () => {
  // ── State ──────────────────────────────────────────────────────────
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // ── Refs ───────────────────────────────────────────────────────────
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    // Auto-focus the textarea when the component mounts
    textareaRef.current?.focus();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────

  /** Validates input and simulates a loading state (no backend yet) */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setHasSubmitted(true);

      // Validation: empty / too short
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

      // Clear any previous error and start simulated loading
      setError(null);
      setIsLoading(true);

      // Simulate network delay — backend not connected yet
      setTimeout(() => {
        setIsLoading(false);
        // Future milestone: send `prompt` to the AI service here
        alert('✅ AI generation will be wired in the next milestone.\n\nYour prompt:\n' + prompt);
      }, 2000);
    },
    [prompt]
  );

  /** Fill the textarea with an example prompt */
  const handleExampleClick = useCallback((example: string) => {
    setPrompt(example);
    setError(null);
    setHasSubmitted(false);
    textareaRef.current?.focus();
  }, []);

  /** Reset the form to its initial state */
  const handleClear = useCallback(() => {
    setPrompt('');
    setError(null);
    setHasSubmitted(false);
    textareaRef.current?.focus();
  }, []);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {/* ── Main Input Card ─────────────────────────────────────── */}
      <Card className="space-y-5 border border-slate-800">
        {/* Card Header */}
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

        {/* Textarea */}
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
            maxLength={MAX_CHARS + 50} // allow typing slightly past so counter turns red
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby="prompt-error"
            className={`w-full resize-none rounded-xl bg-slate-900/80 border px-4 py-3.5 text-slate-100 text-sm leading-relaxed placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? 'border-rose-500/60 focus:ring-rose-500/40'
                : 'border-slate-700/80 focus:ring-sky-500/40 focus:border-sky-500/50'
            }`}
          />

          {/* Character Counter */}
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

        {/* Validation Error Message */}
        {error && (
          <div
            id="prompt-error"
            role="alert"
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons Row */}
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
