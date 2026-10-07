import React, { useState } from 'react';
import { CaptionOption, HashtagIntelligence, Platform, CreatorAccount } from '../types';
import {
  MessageSquareText,
  Sparkles,
  Hash,
  Copy,
  Check,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

interface CaptionStudioProps {
  account: CreatorAccount;
  onSendToScheduler: (captionText: string, tags: string[]) => void;
  initialTopic?: string;
}

export const CaptionStudio: React.FC<CaptionStudioProps> = ({
  account,
  onSendToScheduler,
  initialTopic = '',
}) => {
  const [topic, setTopic] = useState(
    initialTopic || 'Morning Routine: What 5 AM Actually Feels Like in Tokyo'
  );
  const [targetPlatform, setTargetPlatform] = useState<Platform>(account.platform);
  const [goal, setGoal] = useState('engagement');
  const [vibe, setVibe] = useState('storytelling');
  const [isGenerating, setIsGenerating] = useState(false);

  // Pre-configured default high quality captions
  const [captions, setCaptions] = useState<CaptionOption[]>([
    {
      id: 'cap-1',
      styleName: 'Vlog Storytelling & Vulnerability',
      headline: 'I spent 3 years waking up at 5 AM thinking it would fix my life.',
      body: `Everyone tells you that discipline is about forcing yourself into uncomfortable routines.\n\nHere is what nobody mentions: forcing a rhythm that contradicts your biology only produces shallow focus and exhaustion.\n\nLast month I finally stripped my morning down to just 3 essential rules:\n1. 90 minutes of zero digital input\n2. First project milestone written on physical paper\n3. Warm matcha by an open window before touching a screen\n\nResult? Finished 2 client edits that had been stalled for weeks.`,
      callToAction: 'Save this post for tomorrow morning and drop your biggest morning struggle below. 👇',
      characterCount: 564,
      toneScore: 'High Resonance & Saves',
    },
    {
      id: 'cap-2',
      styleName: 'Viral Hook & Rapid Retention',
      headline: 'The brutal truth about modern creator burnout:',
      body: `You are not suffering from a lack of creativity.\n\nYou are suffering from an overload of external inputs.\n\nWhen your brain consumes 400 micro-videos before breakfast, your cognitive RAM is 100% full before you even open your editing timeline.\n\nProtect your quiet hours. They are where your actual voice lives.`,
      callToAction: 'Share this with a fellow creator who needs a reset today. ↗',
      characterCount: 398,
      toneScore: 'Max Shareability',
    },
    {
      id: 'cap-3',
      styleName: 'Tactical Step-by-Step Breakdown',
      headline: 'The 3-Block Focus Architecture (2026 Edition)',
      body: `Step 1: The Zero-Input Buffer (first 90 mins)\nNo email, no feeds, no news. Protect your baseline dopamine.\n\nStep 2: Single-Task Anchor\nOne deep creative milestone completed before opening Slack or messaging apps.\n\nStep 3: Intentional Decompression\n20-minute outdoor walk without audio stimulation to allow subconscious processing.`,
      callToAction: 'Bookmark this framework so you have it ready for tomorrow. 🔖',
      characterCount: 432,
      toneScore: 'High Bookmark Rate',
    },
  ]);

  const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(0);
  const [editableBody, setEditableBody] = useState(captions[0].body);
  const [editableHeadline, setEditableHeadline] = useState(captions[0].headline);
  const [editableCta, setEditableCta] = useState(captions[0].callToAction);

  const [hashtagIntel, setHashtagIntel] = useState<HashtagIntelligence>({
    highReach: ['#creatorlife', '#filmmaking', '#contentcreator', '#storytelling'],
    nicheTargeted: ['#vlogaesthetic', '#creativeworkflow', '#minimalistlifestyle', '#tokyocreator'],
    ultraSpecific: ['#studiosetupinspo', '#quietmornings', '#vlogdiary2026'],
    recommendationNote:
      'Combine 2 high-reach with 4 niche and 2 ultra-specific tags for optimal algorithmic indexing on vertical feeds.',
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([
    '#vlogaesthetic',
    '#creatorworkflow',
    '#minimalistlifestyle',
    '#storytelling',
  ]);

  const [hasCopied, setHasCopied] = useState(false);
  const [hasCopiedTags, setHasCopiedTags] = useState(false);

  // Platform character limits
  const platformLimits: Record<Platform, number> = {
    instagram: 2200,
    tiktok: 2200,
    youtube: 5000,
    x: 280,
    linkedin: 3000,
  };

  const currentLimit = platformLimits[targetPlatform] || 2200;
  const fullCaption = `${editableHeadline}\n\n${editableBody}\n\n${editableCta}\n\n${selectedTags.join(' ')}`;
  const totalLength = fullCaption.length;

  const handleSelectVariation = (idx: number) => {
    setSelectedCaptionIndex(idx);
    const chosen = captions[idx];
    setEditableHeadline(chosen.headline);
    setEditableBody(chosen.body);
    setEditableCta(chosen.callToAction);
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddAllTags = () => {
    const all = Array.from(
      new Set([
        ...selectedTags,
        ...hashtagIntel.highReach,
        ...hashtagIntel.nicheTargeted,
        ...hashtagIntel.ultraSpecific,
      ])
    );
    setSelectedTags(all);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform: targetPlatform,
          niche: account.niche,
          goal,
          vibe,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        if (resData.data.captions && resData.data.captions.length > 0) {
          setCaptions(resData.data.captions);
          setSelectedCaptionIndex(0);
          setEditableHeadline(resData.data.captions[0].headline);
          setEditableBody(resData.data.captions[0].body);
          setEditableCta(resData.data.captions[0].callToAction);
        }
        if (resData.data.hashtagIntelligence) {
          setHashtagIntel(resData.data.hashtagIntelligence);
        }
      }
    } catch (err) {
      console.error('Caption generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(fullCaption);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleCopyAllTags = () => {
    navigator.clipboard.writeText(selectedTags.join(' '));
    setHasCopiedTags(true);
    setTimeout(() => setHasCopiedTags(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <span>Content Engine</span>
            <span aria-hidden="true">·</span>
            <span>Captions & Hashtag Growth</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">Algorithmic Copywriter</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Caption Studio & Strategic Hashtags
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCaption}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{hasCopied ? 'Copied Full Post' : 'Copy Full Post'}</span>
          </button>

          <button
            onClick={() => onSendToScheduler(fullCaption, selectedTags)}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Send to Scheduler</span>
          </button>
        </div>
      </div>

      {/* Generator Control Bar */}
      <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Post Concept & Topic Narrative
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The morning routine that eliminated creative burnout..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-sm cursor-pointer whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Writing Viral Captions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Captions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Target Platform</label>
            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value as Platform)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="x">X (Twitter)</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Primary Growth Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="engagement">Maximize Meaningful Comments</option>
              <option value="saves_bookmarks">High Bookmark / Save Velocity</option>
              <option value="shares">Direct Share & Repost Spread</option>
              <option value="profile_visits">Profile Traffic & Conversion</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Copywriting Style</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="storytelling">Vlog Storytelling & Personal Diary</option>
              <option value="hook">Punchy Viral Hook & Curiosity Gap</option>
              <option value="tactical">Educational & Step-by-Step</option>
              <option value="casual">Casual & Community Question</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport: Caption Variations & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Caption Variations (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Caption Formulas ({captions.length})
            </h3>
            <span className="text-[11px] text-neutral-400">Select to customize</span>
          </div>

          <div className="space-y-3">
            {captions.map((cap, idx) => {
              const isSelected = selectedCaptionIndex === idx;
              return (
                <div
                  key={cap.id || idx}
                  onClick={() => handleSelectVariation(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white">{cap.styleName}</span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {cap.toneScore}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 font-medium line-clamp-2">
                    {cap.headline}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>~{Math.round(cap.characterCount / 5)} words</span>
                    <span>{cap.characterCount} chars</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Interactive Editor & Hashtag Engine (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Editable Caption Box */}
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Live Post Editor</h3>
              </div>

              {/* Platform Character Meter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">
                  {totalLength} / {currentLimit} chars
                </span>
                <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      totalLength > currentLimit
                        ? 'bg-rose-500'
                        : totalLength > currentLimit * 0.85
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalLength / currentLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Hook Line Editor */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1 font-mono">
                  OPENING HOOK LINE (SCROLL-STOPPER)
                </label>
                <input
                  type="text"
                  value={editableHeadline}
                  onChange={(e) => setEditableHeadline(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Body Copy */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1 font-mono">
                  CAPTION NARRATIVE BODY
                </label>
                <textarea
                  rows={8}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 leading-relaxed focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              {/* Call to Action */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1 font-mono">
                  CALL TO ACTION (CTA)
                </label>
                <input
                  type="text"
                  value={editableCta}
                  onChange={(e) => setEditableCta(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Selected Hashtags preview inside editor */}
            <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-neutral-400">
                  ATTACHED HASHTAGS ({selectedTags.length})
                </span>
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-[10px] text-neutral-500 hover:text-neutral-300"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedTags.length === 0 ? (
                  <span className="text-xs text-neutral-500 italic">No hashtags selected. Click below to add.</span>
                ) : (
                  selectedTags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:bg-rose-950/60 hover:border-rose-800 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Click to remove"
                    >
                      {tag} ×
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Hashtag Intelligence Matrix */}
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  Growth Hashtag Recommendations
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAllTags}
                  className="text-xs px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                >
                  {hasCopiedTags ? 'Copied Tags' : 'Copy All Tags'}
                </button>
                <button
                  onClick={handleAddAllTags}
                  className="text-xs px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium cursor-pointer"
                >
                  + Add All to Post
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-400">
              {hashtagIntel.recommendationNote}
            </p>

            {/* 3 Reach Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* High reach */}
              <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg space-y-2">
                <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span>High Reach</span>
                  <span className="text-[10px] text-neutral-500 font-mono">&gt;1M posts</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hashtagIntel.highReach.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche targeted */}
              <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg space-y-2">
                <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Niche Community</span>
                  <span className="text-[10px] text-neutral-500 font-mono">100k - 500k</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hashtagIntel.nicheTargeted.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ultra specific */}
              <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg space-y-2">
                <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Ultra-Specific</span>
                  <span className="text-[10px] text-neutral-500 font-mono">&lt;50k fast rank</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hashtagIntel.ultraSpecific.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-xs px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
