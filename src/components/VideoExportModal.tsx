import React, { useState } from 'react';
import { VlogVideoScript, CreatorAccount } from '../types';
import { renderAndDownloadVlogVideo, RenderOptions, RenderResult } from '../utils/videoRenderer';
import {
  X,
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  Calendar,
} from 'lucide-react';

interface VideoExportModalProps {
  script: VlogVideoScript;
  account: CreatorAccount;
  onClose: () => void;
  onSendToScheduler: (script: VlogVideoScript) => void;
}

export const VideoExportModal: React.FC<VideoExportModalProps> = ({
  script,
  account,
  onClose,
  onSendToScheduler,
}) => {
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [burnSubtitles, setBurnSubtitles] = useState(true);

  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [renderResult, setRenderResult] = useState<RenderResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartRender = async () => {
    setIsRendering(true);
    setRenderProgress(0);
    setErrorMessage(null);
    setStatusText('Initializing video pipeline...');

    try {
      const options: RenderOptions = {
        resolution,
        aspectRatio,
        includeAudio,
        burnSubtitles,
      };

      const result = await renderAndDownloadVlogVideo(
        script,
        account,
        options,
        (percent, text) => {
          setRenderProgress(percent);
          setStatusText(text);
        }
      );

      setRenderResult(result);
    } catch (err: any) {
      console.error('Video export error:', err);
      setErrorMessage(err.message || 'Failed to export video file');
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadAgain = () => {
    if (!renderResult) return;
    const a = document.createElement('a');
    a.href = renderResult.url;
    a.download = renderResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export & Download Video</h2>
              <p className="text-xs text-neutral-400">
                Render realistic vlog video file ready for Instagram, TikTok, or YouTube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRendering}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Target Video Summary */}
          <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-3">
            <div className="w-12 aspect-[9/16] rounded-md overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
              <img
                src={script.scenes[0]?.imagePreview || account.recentPosts[0]?.thumbnail}
                alt={script.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="text-white font-bold text-xs truncate">{script.title}</div>
              <div className="text-neutral-400 text-[11px]">
                {script.scenes.length} Scenes · {script.style}
              </div>
            </div>
          </div>

          {!renderResult && !isRendering && (
            <div className="space-y-4">
              {/* Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Export Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="1080p">1080p Full HD (Crisp Quality)</option>
                    <option value="720p">720p Fast HD (Quick Export)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="9:16">9:16 Vertical (Reels / TikTok / Shorts)</option>
                    <option value="16:9">16:9 Landscape (YouTube / Desktop)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center justify-between p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-lg cursor-pointer hover:border-neutral-700">
                  <div>
                    <div className="text-white font-medium">Burn-in Kinetic Subtitles</div>
                    <div className="text-neutral-500 text-[11px]">
                      Embeds high-retention text overlays & dialogue
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={burnSubtitles}
                    onChange={(e) => setBurnSubtitles(e.target.checked)}
                    className="h-4 w-4 accent-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-lg cursor-pointer hover:border-neutral-700">
                  <div>
                    <div className="text-white font-medium">Include Ambient Lo-Fi Audio</div>
                    <div className="text-neutral-500 text-[11px]">
                      Synthesizes a matching studio background soundtrack
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeAudio}
                    onChange={(e) => setIncludeAudio(e.target.checked)}
                    className="h-4 w-4 accent-indigo-600 rounded"
                  />
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Rendering Progress View */}
          {isRendering && (
            <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4 text-center">
              <div className="h-10 w-10 mx-auto rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center animate-pulse">
                <Film className="h-5 w-5 animate-spin" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">Rendering HD Video File</h3>
                <p className="text-xs text-neutral-400 mt-1">{statusText}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>

              <div className="text-xs font-mono text-neutral-400">
                {renderProgress}% Completed · Encoding at 30 FPS
              </div>
            </div>
          )}

          {/* Render Result Preview & Actions */}
          {renderResult && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-900/60 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="text-white font-bold">Video Successfully Rendered & Downloaded!</div>
                  <div className="text-emerald-400 font-mono text-[11px]">
                    Saved to your Downloads folder: {renderResult.filename}
                  </div>
                </div>
              </div>

              {/* In-Modal Video Player to check the file */}
              <div className="bg-black rounded-xl overflow-hidden border border-neutral-800 aspect-[9/16] max-w-[240px] mx-auto shadow-xl">
                <video
                  src={renderResult.url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={handleDownloadAgain}
                  className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Again</span>
                </button>

                <button
                  onClick={() => {
                    onSendToScheduler(script);
                    onClose();
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Schedule This Video</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!renderResult && (
          <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={onClose}
              disabled={isRendering}
              className="text-neutral-400 hover:text-white cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleStartRender}
              disabled={isRendering}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isRendering ? 'Rendering...' : 'Render & Download MP4'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
