import React, { useState } from 'react';
import { ScheduledPost, CreatorAccount, Platform } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter,
  ArrowUpRight,
  Video,
  Play,
  Share2,
} from 'lucide-react';
import { PhonePreviewModal } from './PhonePreviewModal';

interface PostSchedulerProps {
  scheduledPosts: ScheduledPost[];
  account: CreatorAccount;
  onAddPost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
  onOpenCreateModal: () => void;
}

export const PostScheduler: React.FC<PostSchedulerProps> = ({
  scheduledPosts,
  account,
  onAddPost,
  onDeletePost,
  onOpenCreateModal,
}) => {
  const [viewMode, setViewMode] = useState<'queue' | 'calendar'>('queue');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [previewPost, setPreviewPost] = useState<ScheduledPost | null>(null);

  const filteredPosts = scheduledPosts.filter((p) => {
    if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
    return true;
  });

  const optimalCount = scheduledPosts.filter((p) => p.optimalTimeMatch).length;
  const optimalRatio = scheduledPosts.length > 0 ? Math.round((optimalCount / scheduledPosts.length) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <span>Automation Engine</span>
            <span aria-hidden="true">·</span>
            <span>Content Publishing Scheduler</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Autopilot Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Upcoming Posts & Automation Calendar
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule New Post</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Queue Health</div>
          <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
            {scheduledPosts.length} Posts Active
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Automated queue intact</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Optimal Window Match</div>
          <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            {optimalRatio}% Synchronized
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">{optimalCount} in gold engagement peak</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Next Auto-Publish</div>
          <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
            Tomorrow, 11:30 AM
          </div>
          <div className="text-[11px] text-indigo-400 font-mono mt-0.5">Instagram Reel POV Vlog</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Weekly Content Pace</div>
          <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
            4 Videos / Week
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Matches algorithmic recommendation</div>
        </div>
      </div>

      {/* Filters and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <span className="text-xs text-neutral-400">Filter Platform:</span>
          <div className="flex items-center gap-1">
            {['all', 'instagram', 'tiktok', 'youtube'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPlatform(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  filterPlatform === p
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('queue')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              viewMode === 'queue' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Queue List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              viewMode === 'calendar' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Calendar Grid
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      {viewMode === 'queue' ? (
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-3">
              <CalendarIcon className="h-8 w-8 text-neutral-500 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No posts in this queue</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Schedule your next realistic video or vlog to maintain your algorithmic publishing cadence.
              </p>
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer"
              >
                Schedule First Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 aspect-[9/16] bg-neutral-950 rounded-lg overflow-hidden shrink-0 border border-neutral-800 group">
                    <img
                      src={post.videoThumbnail || account.recentPosts[0].thumbnail}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPreviewPost(post)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Play className="h-5 w-5 fill-white text-white" />
                    </button>
                  </div>

                  {/* Post Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="capitalize font-semibold text-indigo-400">
                        {post.platform}
                      </span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="capitalize text-neutral-400">{post.type.replace('_', ' ')}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      {post.optimalTimeMatch && (
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.2 rounded">
                          ★ Peak Gold Window
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white">{post.title}</h3>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 text-[11px] font-mono text-neutral-500 pt-1">
                        {post.hashtags.slice(0, 4).join(' ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action & Scheduled Datetime */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0">
                  <div className="text-left md:text-right space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Clock className="h-3 w-3 text-indigo-400" />
                      <span>Scheduled for:</span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono">
                      {new Date(post.scheduledTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(post.scheduledTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewPost(post)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      title="Remove from queue"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-neutral-400 font-mono pb-2 border-b border-neutral-800">
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
            <div>SUN</div>
          </div>

          <div className="grid grid-cols-7 gap-2 min-h-[360px]">
            {['Oct 5', 'Oct 6 (Peak)', 'Oct 7 (Peak)', 'Oct 8', 'Oct 9 (Peak)', 'Oct 10', 'Oct 11'].map(
              (dayLabel, idx) => {
                const dayPosts = scheduledPosts.filter((p) => {
                  const pDate = new Date(p.scheduledTime);
                  return pDate.getDay() === (idx === 6 ? 0 : idx + 1);
                });

                return (
                  <div
                    key={idx}
                    className="p-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded-lg flex flex-col justify-between"
                  >
                    <div className="text-[11px] font-mono text-neutral-400 font-semibold mb-2">
                      {dayLabel}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {dayPosts.map((dp) => (
                        <div
                          key={dp.id}
                          onClick={() => setPreviewPost(dp)}
                          className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-white cursor-pointer transition-colors space-y-1"
                        >
                          <div className="font-semibold truncate">{dp.title}</div>
                          <div className="text-[10px] font-mono text-indigo-400 truncate">
                            {new Date(dp.scheduledTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={onOpenCreateModal}
                      className="mt-2 w-full py-1 text-[10px] font-medium text-neutral-500 hover:text-white hover:bg-neutral-900 rounded transition-colors text-center cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Phone Preview Modal */}
      {previewPost && (
        <PhonePreviewModal
          post={previewPost}
          account={account}
          onClose={() => setPreviewPost(null)}
        />
      )}
    </div>
  );
};
