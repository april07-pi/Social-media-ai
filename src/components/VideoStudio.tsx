import React, { useState, useEffect, useRef } from 'react';
import { VlogVideoScript, CreatorAccount, Platform } from '../types';
import { INITIAL_VLOG_SCRIPT, IMAGES } from '../data/mockData';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Send,
  Calendar,
  Layers,
  Camera,
  Music,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  Copy,
  ArrowRight,
  RefreshCw,
  Sliders,
  Film,
  Download,
} from 'lucide-react';
import { VideoExportModal } from './VideoExportModal';

interface VideoStudioProps {
  account: CreatorAccount;
  onSendToScheduler: (script: VlogVideoScript) => void;
  onSendToCaptions: (topic: string) => void;
  initialTopic?: string;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  account,
  onSendToScheduler,
  onSendToCaptions,
  initialTopic = '',
}) => {
  const [topic, setTopic] = useState(
    initialTopic || 'Morning Routine: What 5 AM Actually Feels Like in Tokyo'
  );
  const [style, setStyle] = useState('cinematic_vlog');
  const [duration, setDuration] = useState('45s');
  const [tone, setTone] = useState('authentic_raw');
  const [targetPlatform, setTargetPlatform] = useState<Platform>(account.platform);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeScript, setActiveScript] = useState<VlogVideoScript>(INITIAL_VLOG_SCRIPT);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasCopiedScript, setHasCopiedScript] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');

  // Animation frame ref for simulated playback
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const totalDuration = activeScript.scenes.reduce((acc, sc) => acc + sc.durationSec, 0) || 45;

  // Track playback time
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const updateTimer = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0; // loop back
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(updateTimer);
      };

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Update current scene index based on playback time
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < activeScript.scenes.length; i++) {
      accumulated += activeScript.scenes[i].durationSec;
      if (currentTime <= accumulated) {
        setCurrentSceneIndex(i);
        break;
      }
    }
  }, [currentTime, activeScript.scenes]);

  const currentScene = activeScript.scenes[currentSceneIndex] || activeScript.scenes[0];

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-vlog-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: topic,
          style,
          targetPlatform,
          duration,
          tone,
          niche: account.niche,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        // Attach realistic visual assets to generated scenes
        const imagePool = [IMAGES.tokyoVlog, IMAGES.deskSetup, IMAGES.outdoorGolden];
        const enrichedScenes = resData.data.scenes.map((sc: any, idx: number) => ({
          ...sc,
          imagePreview: imagePool[idx % imagePool.length],
        }));

        setActiveScript({
          ...resData.data,
          id: `vlog-${Date.now()}`,
          scenes: enrichedScenes,
          createdAt: new Date().toISOString(),
        });
        setCurrentTime(0);
        setCurrentSceneIndex(0);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Failed to generate vlog:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScriptMarkdown = () => {
    const text = `# ${activeScript.title}
Platform: ${activeScript.targetPlatform} | Duration: ${activeScript.estimatedDuration || duration} | Style: ${activeScript.style}

## Hook
- Visual: ${activeScript.hook.visualCue}
- Spoken Audio: "${activeScript.hook.spokenAudio}"
- Text: "${activeScript.hook.text}"

## Scenes
${activeScript.scenes
  .map(
    (s, idx) => `
### Scene ${idx + 1}: ${s.framing} (${s.timestamp})
- Camera Movement: ${s.cameraMovement}
- Visual: ${s.visualDescription}
- Spoken Voiceover: "${s.scriptVoiceover}"
- On-Screen Text: ${s.onScreenText}
- Sound Design: ${s.soundDesignAndMusic}
- Pacing: ${s.pacingNote}
`
  )
  .join('\n')}

Soundtrack: ${activeScript.soundtrackRecommendation}
Color LUT: ${activeScript.colorGradingNotes}
`;

    navigator.clipboard.writeText(text);
    setHasCopiedScript(true);
    setTimeout(() => setHasCopiedScript(false), 2000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const presetTopics = [
    'Morning Routine: What 5 AM Actually Feels Like in Tokyo',
    'Minimalist Desk Setup: Everything I Stripped Away',
    'Why I Walk 10,000 Steps Without Headphones Every Day',
    'Behind The Scenes: How I Edit 3 Viral Videos in 2 Hours',
    'The 3 Non-Negotiable Rules of Creative Longevity',
  ];

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <span>Content Engine</span>
            <span aria-hidden="true">·</span>
            <span>Realistic Video & Vlog Studio</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">Gemini 3.8 Video Director</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Realistic Video & Vlog Production Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSendToCaptions(activeScript.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <span>Generate Captions</span>
            <ArrowRight className="h-3 w-3" />
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Video (.mp4)</span>
          </button>

          <button
            onClick={() => onSendToScheduler(activeScript)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Send to Scheduler</span>
          </button>
        </div>
      </div>

      {/* Generation Control Panel */}
      <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Vlog / Video Concept & Narrative Hook
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. A realistic behind-the-scenes look at my creative routine in Tokyo..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerateScript}
              disabled={isGenerating || !topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-sm cursor-pointer whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Directing Video Script...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Realistic Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Concept Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-500 text-[11px] whitespace-nowrap">Suggested:</span>
          {presetTopics.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setTopic(p)}
              className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 whitespace-nowrap transition-colors cursor-pointer text-[11px]"
            >
              {p.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Video Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="cinematic_vlog">Cinematic Realistic Vlog</option>
              <option value="talking_head">Direct Dialogue & Sincerity</option>
              <option value="fast_paced_reel">Fast Dynamic Reel</option>
              <option value="aesthetic_diary">Aesthetic Micro-Diary</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Target Platform</label>
            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value as Platform)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="instagram">Instagram Reels (9:16)</option>
              <option value="tiktok">TikTok (9:16)</option>
              <option value="youtube">YouTube Shorts (9:16)</option>
              <option value="x">X / Twitter Video</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Target Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="30s">30 Seconds (Max Retention)</option>
              <option value="45s">45 Seconds (Sweet Spot)</option>
              <option value="60s">60 Seconds (Deep Breakdown)</option>
              <option value="90s">90 Seconds (Vlog Story)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Audio & Speech Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="authentic_raw">Authentic & Raw POV</option>
              <option value="reflective_deep">Reflective & Mindful</option>
              <option value="high_energy">Punchy & High Energy</option>
              <option value="educational_witty">Educational & Conversational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport: Video Preview & Storyboard Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Realistic Video Player Simulation (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Realistic Video Simulation</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAspectRatio(aspectRatio === '9:16' ? '16:9' : '9:16')}
                className="text-xs px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer font-mono"
              >
                {aspectRatio}
              </button>
            </div>
          </div>

          {/* Video Player Device Mockup */}
          <div
            className={`relative mx-auto bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl transition-all ${
              aspectRatio === '9:16' ? 'w-full max-w-[340px] aspect-[9/16]' : 'w-full aspect-[16/9]'
            }`}
          >
            {/* Visual Frame */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={currentScene?.imagePreview || IMAGES.tokyoVlog}
                alt={currentScene?.visualDescription}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
            </div>

            {/* Top Bar inside Player */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 z-20">
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-[10px]">
                  SCENE {currentSceneIndex + 1}/{activeScript.scenes.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white/80 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Center Dynamic Subtitle / Kinetic Caption Overlay */}
            <div className="absolute inset-x-4 bottom-24 z-20 text-center flex flex-col items-center justify-end pointer-events-none">
              {currentScene?.onScreenText && (
                <div className="mb-2 px-3 py-1 rounded bg-black/80 backdrop-blur-md text-amber-300 font-bold text-xs tracking-wide shadow-lg border border-amber-400/20">
                  {currentScene.onScreenText}
                </div>
              )}

              {/* Dynamic Spoken Voiceover Simulation */}
              <div className="bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 max-w-[280px]">
                <p className="text-[12px] text-white/95 leading-snug font-medium italic">
                  "{currentScene?.scriptVoiceover}"
                </p>
              </div>
            </div>

            {/* Bottom Meta & Social Overlay inside video frame */}
            <div className="absolute bottom-3 left-3 right-3 z-20 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/80">
                <div className="flex items-center gap-1.5">
                  <img
                    src={account.avatarUrl}
                    alt={account.displayName}
                    referrerPolicy="no-referrer"
                    className="h-5 w-5 rounded-full border border-white/40"
                  />
                  <span className="font-semibold text-white text-[11px]">{account.handle}</span>
                </div>
                <span className="text-[10px] text-neutral-300 font-mono">
                  {formatSeconds(currentTime)} / {formatSeconds(totalDuration)}
                </span>
              </div>

              {/* Interactive Scrubber Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setCurrentTime(ratio * totalDuration);
                }}
                className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative overflow-hidden group"
              >
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>

            {/* Big Play / Pause Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors z-10 cursor-pointer"
            >
              {!isPlaying && (
                <div className="h-14 w-14 rounded-full bg-white/90 text-neutral-950 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                  <Play className="h-6 w-6 fill-neutral-950 translate-x-0.5" />
                </div>
              )}
            </button>
          </div>

          {/* Quick Playback Controller */}
          <div className="flex items-center justify-center gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl">
            <button
              onClick={() => {
                setCurrentTime(0);
                setCurrentSceneIndex(0);
              }}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="Reset to 0:00"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-white" />
                  <span>Pause Preview</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Play Simulation</span>
                </>
              )}
            </button>

            {/* Simulated Audio Waveform Bar */}
            <div className="flex items-center gap-1 px-3">
              {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85].map((h, i) => (
                <span
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-indigo-400' : 'bg-neutral-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(8, (h * (Math.sin(currentTime * 5 + i) + 1.2)) / 4)}px` : '8px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quick Render & Download Video button directly beneath player */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Render & Download Ready-to-Post Video (.mp4)</span>
          </button>
        </div>

        {/* Right: Scene-by-Scene Director Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Script Overview Card */}
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                  Script & Director's Breakdown
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{activeScript.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyScriptMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                >
                  {hasCopiedScript ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{hasCopiedScript ? 'Copied Markdown' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            {/* Hook Audit Box */}
            <div className="p-3.5 bg-neutral-950 border border-indigo-900/40 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>The 3-Second Retention Hook</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Hook Score: {activeScript.hookScore || 95}/100
                </span>
              </div>
              <p className="text-xs text-neutral-200 font-medium">"{activeScript.hook.spokenAudio}"</p>
              <div className="text-[11px] text-neutral-400">
                <span className="text-neutral-500 font-mono">DIRECTOR CUE:</span> {activeScript.hook.visualCue}
              </div>
            </div>

            {/* Soundtrack & Color Grading metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                  <Music className="h-3 w-3 text-indigo-400" />
                  <span>Recommended Soundtrack</span>
                </div>
                <div className="text-neutral-200 font-medium text-[11px]">
                  {activeScript.soundtrackRecommendation}
                </div>
              </div>

              <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                  <Sliders className="h-3 w-3 text-emerald-400" />
                  <span>Color LUT & Pacing</span>
                </div>
                <div className="text-neutral-200 font-medium text-[11px]">
                  {activeScript.colorGradingNotes}
                </div>
              </div>
            </div>
          </div>

          {/* Scene Timeline List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Scene-By-Scene Timeline ({activeScript.scenes.length} Scenes)
              </h3>
              <span className="text-xs text-neutral-400">Click any scene to preview in player</span>
            </div>

            <div className="space-y-3">
              {activeScript.scenes.map((scene, idx) => {
                const isActive = currentSceneIndex === idx;
                return (
                  <div
                    key={scene.id || idx}
                    onClick={() => {
                      // Calculate offset time
                      let offset = 0;
                      for (let i = 0; i < idx; i++) {
                        offset += activeScript.scenes[i].durationSec;
                      }
                      setCurrentTime(offset + 0.1);
                      setCurrentSceneIndex(idx);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-950/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                        : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isActive ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          SCENE {idx + 1}
                        </span>
                        <span className="font-semibold text-white">{scene.framing}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-neutral-400 text-[11px]">
                        <span>{scene.timestamp}</span>
                        <span>({scene.durationSec}s)</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Spoken script */}
                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 font-mono block mb-0.5">
                          SPOKEN DIALOGUE / VOICEOVER:
                        </span>
                        <p className="text-neutral-200 font-medium leading-relaxed">
                          "{scene.scriptVoiceover}"
                        </p>
                      </div>

                      {/* Visual & camera cue */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-neutral-500 font-mono">CAMERA MOTION:</span>{' '}
                          <span className="text-neutral-300">{scene.cameraMovement}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-mono">ON-SCREEN TEXT:</span>{' '}
                          <span className="text-amber-300">{scene.onScreenText || 'None'}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60 flex items-center justify-between">
                        <span>
                          <strong className="text-neutral-500 font-mono">SOUND DESIGN:</strong>{' '}
                          {scene.soundDesignAndMusic}
                        </span>
                        <span className="text-neutral-400 font-mono text-[10px]">
                          {scene.pacingNote}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Video Export & Download Modal */}
      {isExportModalOpen && (
        <VideoExportModal
          script={activeScript}
          account={account}
          onClose={() => setIsExportModalOpen(false)}
          onSendToScheduler={onSendToScheduler}
        />
      )}
    </div>
  );
};
