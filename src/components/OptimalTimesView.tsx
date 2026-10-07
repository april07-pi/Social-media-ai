import React, { useState } from 'react';
import { CreatorAccount, Platform } from '../types';
import {
  Clock,
  Flame,
  Calendar,
  Zap,
  TrendingUp,
  Globe,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface OptimalTimesViewProps {
  account: CreatorAccount;
  onSelectSlotToSchedule: (day: string, hour: number) => void;
}

export const OptimalTimesView: React.FC<OptimalTimesViewProps> = ({
  account,
  onSelectSlotToSchedule,
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Selected cell for inspector
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(1); // Tuesday
  const [selectedHour, setSelectedHour] = useState<number>(11); // 11:00 AM

  const heatmap = account.heatmapData || [];

  const getIntensityColor = (val: number) => {
    if (val >= 85) return 'bg-indigo-500 text-white';
    if (val >= 70) return 'bg-indigo-600/80 text-white';
    if (val >= 55) return 'bg-indigo-800/70 text-neutral-200';
    if (val >= 40) return 'bg-indigo-950/70 text-neutral-400';
    if (val >= 25) return 'bg-neutral-900 text-neutral-500';
    return 'bg-neutral-950 text-neutral-600';
  };

  const selectedIntensity = heatmap[selectedDayIdx]?.[selectedHour] || 75;

  const getWindowRating = (val: number) => {
    if (val >= 85) return { label: 'Peak Gold Window', color: 'text-amber-400' };
    if (val >= 65) return { label: 'High Momentum', color: 'text-emerald-400' };
    if (val >= 45) return { label: 'Moderate Engagement', color: 'text-indigo-400' };
    return { label: 'Off-Peak Hours', color: 'text-neutral-400' };
  };

  const rating = getWindowRating(selectedIntensity);

  // Platform specific gold windows
  const platformGoldWindows = [
    {
      platform: 'Instagram Reels',
      window: 'Tuesdays 11:30 AM & Thursdays 7:45 PM',
      impact: '+48% Algorithmic Reach',
      bestFormat: 'Realistic First-Person Vlog (30-45s)',
      reasoning: 'Matches midday lunch scroll and post-work relaxation timezones in EST/PST.',
    },
    {
      platform: 'TikTok',
      window: 'Wednesdays 8:30 PM & Fridays 9:00 PM',
      impact: '1.5x Viral For You Page Lift',
      bestFormat: 'Fast Kinetic Cutdowns with Direct Hook',
      reasoning: 'Highest user comment velocity and immediate share clustering window.',
    },
    {
      platform: 'YouTube Shorts',
      window: 'Sundays 2:00 PM & Wednesdays 5:15 PM',
      impact: '+62% Average Completion Rate',
      bestFormat: 'Micro-Documentary & Step-by-Step Breakdown',
      reasoning: 'Audience engages longer during weekend afternoon leisure periods.',
    },
    {
      platform: 'X (Twitter)',
      window: 'Mondays 8:45 AM & Thursdays 12:30 PM',
      impact: '+34% Quote-Post & Retweet Velocity',
      bestFormat: 'Video Clip + Provocative 1-Sentence Take',
      reasoning: 'Professional break times and morning industry commute discussions.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <span>Social Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Audience Engagement Trends</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Heatmap Matrix</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Optimal Posting Times & Engagement Trends
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-neutral-300">Live Status:</span>
          <span className="text-emerald-400 font-semibold">
            Next Gold Window in 42 mins (11:30 AM)
          </span>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>7-Day x 24-Hour Audience Activity Matrix</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Calculated from {account.followers.toLocaleString()} followers across your primary timezones
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Low</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-4 rounded-sm bg-neutral-950 border border-neutral-800" />
              <span className="h-3 w-4 rounded-sm bg-indigo-950" />
              <span className="h-3 w-4 rounded-sm bg-indigo-800" />
              <span className="h-3 w-4 rounded-sm bg-indigo-600" />
              <span className="h-3 w-4 rounded-sm bg-indigo-500" />
            </div>
            <span>Peak (Gold)</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] space-y-1.5">
            {/* Hours Header Row */}
            <div className="grid grid-cols-[60px_repeat(24,_1fr)] gap-1 text-[10px] text-neutral-500 font-mono text-center">
              <div className="text-left font-medium">DAY</div>
              {hours.map((h) => (
                <div key={h} className="truncate">
                  {h % 3 === 0 ? `${h}h` : ''}
                </div>
              ))}
            </div>

            {/* Days Rows */}
            {days.map((day, dIdx) => (
              <div
                key={day}
                className="grid grid-cols-[60px_repeat(24,_1fr)] gap-1 items-center"
              >
                <div className="text-xs font-semibold text-neutral-400 font-mono">{day}</div>
                {hours.map((hour) => {
                  const val = heatmap[dIdx]?.[hour] || 20;
                  const isSelected = selectedDayIdx === dIdx && selectedHour === hour;

                  return (
                    <button
                      key={hour}
                      onClick={() => {
                        setSelectedDayIdx(dIdx);
                        setSelectedHour(hour);
                      }}
                      title={`${fullDays[dIdx]} ${hour}:00 - Activity Index: ${val}%`}
                      className={`h-7 rounded transition-all cursor-pointer relative group flex items-center justify-center ${getIntensityColor(
                        val
                      )} ${
                        isSelected
                          ? 'ring-2 ring-white scale-110 z-10 shadow-lg'
                          : 'hover:scale-105 hover:z-10'
                      }`}
                    >
                      {val >= 90 && (
                        <span className="h-1 w-1 rounded-full bg-amber-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Slot Inspector Panel */}
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono">SELECTED WINDOW:</span>
              <span className="text-sm font-bold text-white font-mono">
                {fullDays[selectedDayIdx]} at {selectedHour}:00 (
                {selectedHour >= 12 ? `${selectedHour === 12 ? 12 : selectedHour - 12}:00 PM` : `${selectedHour === 0 ? 12 : selectedHour}:00 AM`}
                )
              </span>
              <span className={`text-xs font-bold font-mono ${rating.color}`}>
                [{rating.label}]
              </span>
            </div>

            <p className="text-xs text-neutral-300">
              Estimated active audience: <strong className="text-white font-mono tabular-nums">{Math.floor((account.followers * selectedIntensity) / 100).toLocaleString()}</strong> followers online · Algorithmic velocity index: <strong className="text-indigo-400 font-mono tabular-nums">{selectedIntensity}/100</strong>
            </p>
          </div>

          <button
            onClick={() => onSelectSlotToSchedule(fullDays[selectedDayIdx], selectedHour)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule Post For This Time</span>
          </button>
        </div>
      </div>

      {/* Platform-Specific Gold Windows */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Algorithmic "Gold Windows" by Platform</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Verified publishing timeframes that maximize initial 60-minute reach velocity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platformGoldWindows.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{item.platform}</h4>
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  {item.impact}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-neutral-400">Primary Timing:</span>{' '}
                  <span className="font-semibold text-neutral-200 font-mono">{item.window}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Recommended Format:</span>{' '}
                  <span className="text-indigo-300 font-medium">{item.bestFormat}</span>
                </div>
                <p className="text-neutral-400 text-[11px] pt-1 border-t border-neutral-800/80">
                  {item.reasoning}
                </p>
              </div>

              <button
                onClick={() => onSelectSlotToSchedule('Tuesday', 11)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <span>Use This Timing in Scheduler</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
