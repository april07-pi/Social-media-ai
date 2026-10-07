import React, { useState } from 'react';
import { ScheduledPost, CreatorAccount, Platform } from '../types';
import { IMAGES } from '../data/mockData';
import { X, Sparkles, Clock, Calendar, Check, Film } from 'lucide-react';

interface CreatePostModalProps {
  account: CreatorAccount;
  initialCaption?: string;
  initialTags?: string[];
  initialTitle?: string;
  initialThumbnail?: string;
  onSave: (post: ScheduledPost) => void;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  account,
  initialCaption = '',
  initialTags = [],
  initialTitle = '',
  initialThumbnail = '',
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(
    initialTitle || 'The 90-Minute Focus Window: Morning Vlog'
  );
  const [platform, setPlatform] = useState<Platform>(account.platform);
  const [type, setType] = useState<'video_vlog' | 'reel' | 'short' | 'post'>('video_vlog');
  const [caption, setCaption] = useState(
    initialCaption ||
      `Stop forcing 5 AM wakeups. Here is the single morning rule that actually doubled my creative output without burnout.\n\nDrop a comment if you are trying this tomorrow! ☕`
  );
  const [hashtagsStr, setHashtagsStr] = useState(
    initialTags.length > 0
      ? initialTags.join(' ')
      : '#vlogaesthetic #creatorworkflow #mindfulliving #productivityhacks'
  );

  // Set default scheduled time to tomorrow at 11:30 AM (Peak Gold Window)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(11, 30, 0, 0);

  // Format to YYYY-MM-DDTHH:mm for datetime-local
  const formatForInput = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [scheduledDateTime, setScheduledDateTime] = useState(formatForInput(tomorrow));
  const [isOptimal, setIsOptimal] = useState(true);
  const [selectedThumbnail, setSelectedThumbnail] = useState(
    initialThumbnail || IMAGES.tokyoVlog
  );

  const availableThumbnails = [
    { label: 'Tokyo Vlog Dawn', url: IMAGES.tokyoVlog },
    { label: 'Studio Desk Setup', url: IMAGES.deskSetup },
    { label: 'Golden Hour Coastal', url: IMAGES.outdoorGolden },
  ];

  const handleApplyOptimalWindow = () => {
    // Next Tuesday/Thursday 11:30 AM
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(11, 30, 0, 0);
    setScheduledDateTime(formatForInput(nextDate));
    setIsOptimal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = hashtagsStr
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.startsWith('#'));

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      title,
      platform,
      type,
      scheduledTime: new Date(scheduledDateTime).toISOString(),
      status: 'scheduled',
      caption,
      hashtags: tags,
      videoThumbnail: selectedThumbnail,
      optimalTimeMatch: isOptimal,
      engagementPotential: isOptimal ? 96 : 82,
    };

    onSave(newPost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h2 className="text-base font-bold text-white">Schedule New Video Post</h2>
            <p className="text-xs text-neutral-400">Automate publishing across your creator channels</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Post Title / Working Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Target Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="instagram">Instagram Reel</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube Short</option>
                <option value="x">X (Twitter)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Content Format</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="video_vlog">Realistic POV Vlog</option>
                <option value="reel">Direct Talking Head Reel</option>
                <option value="short">Micro-Documentary Short</option>
                <option value="post">Standard Post</option>
              </select>
            </div>
          </div>

          {/* Video Thumbnail Choice */}
          <div>
            <label className="block text-neutral-400 mb-1.5 font-medium">
              Realistic Video Frame / Cover
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableThumbnails.map((thumb) => (
                <div
                  key={thumb.url}
                  onClick={() => setSelectedThumbnail(thumb.url)}
                  className={`relative aspect-[9/16] rounded-lg overflow-hidden border cursor-pointer group ${
                    selectedThumbnail === thumb.url
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-neutral-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumb.url}
                    alt={thumb.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[10px] text-center text-white truncate">
                    {thumb.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Caption Copy</label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Hashtags (Space Separated)</label>
            <input
              type="text"
              value={hashtagsStr}
              onChange={(e) => setHashtagsStr(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Scheduled Datetime with Optimal Time button */}
          <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                <span>Scheduled Publishing Time</span>
              </label>

              <button
                type="button"
                onClick={handleApplyOptimalWindow}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Apply Next Gold Window (11:30 AM)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => {
                  setScheduledDateTime(e.target.value);
                  setIsOptimal(false);
                }}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
              />

              {isOptimal && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded whitespace-nowrap">
                  ★ Gold Window
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
            >
              Confirm & Automate Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
