import React, { useState } from 'react';
import { ScheduledPost, CreatorAccount, Platform } from '../types';
import {
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';

interface PhonePreviewModalProps {
  post: ScheduledPost;
  account: CreatorAccount;
  onClose: () => void;
}

export const PhonePreviewModal: React.FC<PhonePreviewModalProps> = ({
  post,
  account,
  onClose,
}) => {
  const [platform, setPlatform] = useState<Platform>(post.platform);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg">
            <button
              onClick={() => setPlatform('instagram')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                platform === 'instagram'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Instagram Reel
            </button>
            <button
              onClick={() => setPlatform('tiktok')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                platform === 'tiktok'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              TikTok
            </button>
            <button
              onClick={() => setPlatform('youtube')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                platform === 'youtube'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              YouTube Shorts
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Realistic Mobile Viewport */}
        <div className="p-4 flex-1 flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-3xl overflow-hidden border-4 border-neutral-800 shadow-2xl">
            {/* Camera Frame */}
            <img
              src={post.videoThumbnail || account.recentPosts[0].thumbnail}
              alt={post.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Phone Indicators */}
            <div className="absolute top-2 inset-x-4 flex items-center justify-between text-[10px] text-white/80 font-mono z-20 pointer-events-none">
              <span>9:41</span>
              <div className="h-3 w-16 bg-neutral-900 rounded-full" />
              <span>5G 100%</span>
            </div>

            {/* Click to play/pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
            >
              {!isPlaying && (
                <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center text-neutral-950 shadow-lg">
                  <Play className="h-5 w-5 fill-neutral-950 translate-x-0.5" />
                </div>
              )}
            </button>

            {/* Right Side Social Actions Column */}
            <div className="absolute right-2.5 bottom-16 z-20 flex flex-col items-center gap-3.5 text-white">
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                  <Heart className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono">14.2k</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <div className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono">842</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <div className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                  <Bookmark className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono">3.8k</span>
              </div>

              <div className="flex flex-col items-center gap-0.5">
                <div className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                  <Share2 className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono">Share</span>
              </div>

              {/* Rotating Audio Disc */}
              <div className={`h-7 w-7 rounded-full bg-neutral-900 border-2 border-white/60 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                <Music className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Bottom Left Creator & Caption Overlay */}
            <div className="absolute left-3 right-14 bottom-4 z-20 space-y-1.5 pointer-events-none">
              <div className="flex items-center gap-2">
                <img
                  src={account.avatarUrl}
                  alt={account.displayName}
                  referrerPolicy="no-referrer"
                  className="h-6 w-6 rounded-full border border-white"
                />
                <span className="text-xs font-bold text-white shadow-sm flex items-center gap-1">
                  {account.handle}
                  <CheckCircle2 className="h-3 w-3 text-blue-400 fill-blue-400/20" />
                </span>
                <button className="px-2 py-0.5 text-[10px] font-semibold text-white bg-indigo-600 rounded-full">
                  Follow
                </button>
              </div>

              <p className="text-[11px] text-white/95 leading-snug line-clamp-3 font-normal drop-shadow">
                {post.caption}
              </p>

              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 text-[10px] text-indigo-300 font-mono">
                  {post.hashtags.slice(0, 3).join(' ')}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-mono pt-0.5">
                <Music className="h-2.5 w-2.5" />
                <span className="truncate">Original Audio · {account.displayName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Scheduled for: <strong className="text-white font-mono">{new Date(post.scheduledTime).toLocaleString()}</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
