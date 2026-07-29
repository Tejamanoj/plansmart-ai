import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTripContext } from '@/context/useTripContext';
import { aiService } from '@/services/aiService';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import {
  Sparkles,
  Loader2,
  Lightbulb,
  RotateCcw,
  Calendar,
  MapPin,
  DollarSign,
  Compass,
  ArrowRight,
  Clock,
  Sliders,
  Type,
  Check,
  Tag,
  Zap,
} from 'lucide-react';

const MAX_CHARS = 1000;

const POPULAR_DESTINATIONS = [
  'Tokyo, Japan', 'Paris, France', 'Bali, Indonesia',
  'Swiss Alps, Switzerland', 'London, UK', 'Dubai, UAE',
  'New York, USA', 'Rome, Italy',
];

const DURATION_OPTIONS = [3, 5, 7, 10, 14];

const TRAVEL_STYLES = [
  { id: 'budget',   label: 'Budget',    icon: '💰', desc: 'Hostels, street food & free spots' },
  { id: 'balanced', label: 'Balanced',  icon: '⚖️', desc: 'Mix of comfort & local dining' },
  { id: 'luxury',   label: 'Luxury',    icon: '✨', desc: '5-star stays & fine dining' },
  { id: 'adventure',label: 'Adventure', icon: '⛰️', desc: 'Hiking, sports & outdoor thrills' },
  { id: 'family',   label: 'Family',    icon: '👨‍👩‍👧', desc: 'Kid-friendly & easy pacing' },
];

const INTEREST_TAGS = [
  '🍜 Food & Dining', '🏛️ Culture & History', '🌿 Nature & Outdoors',
  '🛍️ Shopping & Markets', '🌃 Nightlife & Bars', '📸 Photography Spots',
  '🏖️ Beaches & Relaxation', '🎨 Art & Museums',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'INR', symbol: '₹' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

const EXAMPLE_PROMPTS = [
  'Plan a 5-day budget trip to Tokyo, Japan for 2 people with ₹80,000. We love street food, temples, and anime culture.',
  'Create a 3-day luxury Paris itinerary for a honeymoon couple. Budget: $3,000. Include fine dining and Seine river cruise.',
  'Suggest a 7-day family-friendly Bali vacation with kids under 10. Budget: $2,500. Focus on beaches, water parks, and wildlife.',
  'Plan a 4-day adventure trip to Swiss Alps. Budget: €2,000. Include hiking, paragliding, and scenic train rides.',
];

export const PlannerForm: React.FC = () => {
  const { saveTrip } = useTripContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'guided' | 'freeform'>('guided');
  const [destination, setDestination] = useState<string>('Tokyo, Japan');
  const [durationDays, setDurationDays] = useState<number>(5);
  const [travelStyle, setTravelStyle] = useState<string>('balanced');
  const [budgetValue, setBudgetValue] = useState<string>('1500');
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['🍜 Food & Dining', '🏛️ Culture & History']);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slowResponseNotice, setSlowResponseNotice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slowTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (location.state && (location.state as { initialPrompt?: string }).initialPrompt) {
      const initial = (location.state as { initialPrompt: string }).initialPrompt;
      setPrompt(initial);
      setActiveTab('freeform');
    }
  }, [location.state]);

  useEffect(() => {
    return () => { if (slowTimerRef.current) clearTimeout(slowTimerRef.current); };
  }, []);

  const toggleInterest = useCallback((tag: string) => {
    setSelectedInterests((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }, []);

  const finalPromptText = useMemo(() => {
    if (activeTab === 'freeform') return prompt.trim();
    const currSymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '$';
    const interestsText = selectedInterests.length > 0 ? ` Focus on: ${selectedInterests.join(', ')}.` : '';
    return `Plan a ${durationDays}-day ${travelStyle} trip to ${destination}. Estimated budget: ${currSymbol}${budgetValue} ${currency}.${interestsText}`;
  }, [activeTab, prompt, durationDays, travelStyle, destination, budgetValue, currency, selectedInterests]);

  const isValid = useMemo(() => {
    if (activeTab === 'freeform') return prompt.trim().length >= 10 && prompt.length <= MAX_CHARS;
    return destination.trim().length >= 2 && durationDays > 0;
  }, [activeTab, prompt, destination, durationDays]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!finalPromptText || finalPromptText.length < 5) {
      setError('Please enter destination or trip details before submitting.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSlowResponseNotice(false);
    slowTimerRef.current = setTimeout(() => setSlowResponseNotice(true), 6000);
    try {
      const tripPlan = await aiService.generateItinerary(finalPromptText);
      saveTrip(tripPlan);
      navigate(`/itinerary/${tripPlan.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to backend. Please verify the server is running on port 5000.';
      setError(errorMessage);
    } finally {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      setIsLoading(false);
      setSlowResponseNotice(false);
    }
  }, [finalPromptText, saveTrip, navigate]);

  const handleExampleClick = useCallback((example: string) => {
    setPrompt(example);
    setActiveTab('freeform');
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setDestination('Tokyo, Japan');
    setDurationDays(5);
    setTravelStyle('balanced');
    setBudgetValue('1500');
    setPrompt('');
    setError(null);
  }, []);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        {slowResponseNotice && (
          <div className="p-4 rounded-2xl bg-indigo-500/8 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm flex items-center gap-3 animate-fade-in-up">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0 animate-spin" />
            <span>AI is crafting your detailed itinerary — this may take a moment…</span>
          </div>
        )}
        <LoadingSkeleton type="itinerary" />
      </div>
    );
  }

  /* ── Error ── */
  if (error && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <ErrorState title="Trip Generation Failed" message={error} onRetry={() => handleSubmit()} onReset={handleClear} />
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-5">

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/4 border border-white/8 max-w-sm mx-auto">
        {[
          { id: 'guided',   icon: Sliders, label: 'Form Builder' },
          { id: 'freeform', icon: Type,    label: 'AI Prompt' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id as 'guided' | 'freeform')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-2xl border border-indigo-500/15 shadow-2xl overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {activeTab === 'guided' ? 'Build Your Trip Plan' : 'Describe Your Dream Trip'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {activeTab === 'guided'
                  ? 'Select preferences using the options below, then click Generate'
                  : 'Write a natural description and let AI do the rest'}
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
            <Zap className="w-3 h-3" />
            AI Powered
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-7">

          {/* ── GUIDED FORM ── */}
          {activeTab === 'guided' && (
            <div className="space-y-7">

              {/* 1. Destination */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span className="step-badge">1</span>
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter city or country..."
                  className="w-full rounded-xl bg-white/4 border border-white/8 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/4 transition-all"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-700 font-medium">Quick pick:</span>
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setDestination(dest)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                        destination === dest
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/35'
                          : 'bg-white/4 text-slate-500 border-white/6 hover:text-white hover:bg-white/8 hover:border-white/14'
                      }`}
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Duration */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span className="step-badge">2</span>
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Trip Duration
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {DURATION_OPTIONS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDurationDays(days)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                        durationDays === days
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/35 shadow-sm'
                          : 'bg-white/4 text-slate-500 border-white/6 hover:text-white hover:bg-white/8 hover:border-white/14'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                  <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-10 bg-transparent text-sm text-center text-white font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-600">days</span>
                  </div>
                </div>
              </div>

              {/* 3. Travel Style */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span className="step-badge">3</span>
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  Travel Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {TRAVEL_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTravelStyle(style.id)}
                      className={`p-3 rounded-xl text-left flex flex-col gap-1 transition-all cursor-pointer border ${
                        travelStyle === style.id
                          ? 'bg-purple-500/15 text-purple-200 border-purple-500/35 shadow-md'
                          : 'bg-white/4 text-slate-400 border-white/6 hover:border-white/14 hover:bg-white/8'
                      }`}
                    >
                      <div className="text-lg">{style.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-white">{style.label}</div>
                        <div className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">{style.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Budget */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span className="step-badge">4</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Budget
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center rounded-xl bg-white/4 border border-white/8 px-3.5 py-3 focus-within:border-emerald-500/40 focus-within:bg-emerald-500/4 transition-all">
                    <span className="text-sm font-bold text-emerald-400 mr-2">
                      {CURRENCIES.find((c) => c.code === currency)?.symbol}
                    </span>
                    <input
                      type="number"
                      value={budgetValue}
                      onChange={(e) => setBudgetValue(e.target.value)}
                      placeholder="1500"
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-white/4 border border-white/8 p-1 rounded-xl">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => setCurrency(curr.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currency === curr.code
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                            : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        {curr.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Interests */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span className="step-badge">5</span>
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Interests
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                            : 'bg-white/4 text-slate-500 border-white/6 hover:text-white hover:bg-white/8 hover:border-white/14'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── FREEFORM ── */}
          {activeTab === 'freeform' && (
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                id="trip-prompt"
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); if (error) setError(null); }}
                placeholder="Example: Plan a 5-day budget trip to Tokyo for 2 people. We love street food, temples, and anime culture. Budget is ₹80,000..."
                rows={6}
                maxLength={MAX_CHARS + 50}
                disabled={isLoading}
                className="w-full resize-none rounded-xl bg-white/4 border border-white/8 px-4 py-3.5 text-sm text-white leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:bg-indigo-500/4 transition-all"
              />
              <div className="flex justify-between text-xs text-slate-600 px-1">
                <span>Minimum 10 characters</span>
                <span className={prompt.length > MAX_CHARS ? 'text-rose-400' : ''}>{prompt.length} / {MAX_CHARS}</span>
              </div>
            </div>
          )}

          {/* Submit Row */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`w-full sm:flex-1 btn-primary flex items-center justify-center gap-2.5 py-4 rounded-xl text-base font-bold text-white transition-all cursor-pointer shadow-xl shadow-indigo-500/25 ${
                !isValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating AI Itinerary…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Trip Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-white/8 bg-white/4 text-sm font-medium text-slate-500 hover:text-white hover:bg-white/8 hover:border-white/16 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="glass-card rounded-2xl border border-white/6 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300">Or try one of these examples</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EXAMPLE_PROMPTS.map((example, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleExampleClick(example)}
              className="text-left p-3.5 rounded-xl bg-white/3 border border-white/6 text-xs text-slate-400 hover:bg-indigo-500/8 hover:border-indigo-500/25 hover:text-slate-200 transition-all cursor-pointer leading-relaxed"
            >
              <span className="line-clamp-2">{example}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};
