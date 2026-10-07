import React from 'react';
import { CreatorAccount } from '../types';
import { Sparkles, Calendar, Video, Clock, BarChart3, MessageSquareText } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'video' | 'times' | 'captions' | 'scheduler';
  setActiveTab: (tab: 'analyzer' | 'video' | 'times' | 'captions' | 'scheduler') => void;
  accounts: CreatorAccount[];
  selectedAccount: CreatorAccount;
  onSelectAccount: (acc: CreatorAccount) => void;
  onOpenNewPostModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  accounts,
  selectedAccount,
  onSelectAccount,
  onOpenNewPostModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('analyzer');
            }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>Loomix Studio</span>
          </a>

          {/* Account Selector Pill (Functional segmented selector) */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-neutral-800 text-xs">
            <span className="text-neutral-400">Account:</span>
            <select
              value={selectedAccount.id}
              onChange={(e) => {
                const found = accounts.find((a) => a.id === e.target.value);
                if (found) onSelectAccount(found);
              }}
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-md px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.handle} ({acc.platform})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zone 2: Clean navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'analyzer'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Audit & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'video'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Realistic Video & Vlog</span>
          </button>

          <button
            onClick={() => setActiveTab('times')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'times'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Optimal Times</span>
          </button>

          <button
            onClick={() => setActiveTab('captions')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'captions'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            <span>Captions & Tags</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'scheduler'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Scheduler</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewPostModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>+ Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden items-center justify-around border-t border-neutral-800 bg-neutral-900/90 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'analyzer' ? 'text-indigo-400' : 'text-neutral-400'}`}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="text-[10px]">Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'video' ? 'text-indigo-400' : 'text-neutral-400'}`}
        >
          <Video className="h-4 w-4" />
          <span className="text-[10px]">Video/Vlog</span>
        </button>
        <button
          onClick={() => setActiveTab('times')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'times' ? 'text-indigo-400' : 'text-neutral-400'}`}
        >
          <Clock className="h-4 w-4" />
          <span className="text-[10px]">Timing</span>
        </button>
        <button
          onClick={() => setActiveTab('captions')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'captions' ? 'text-indigo-400' : 'text-neutral-400'}`}
        >
          <MessageSquareText className="h-4 w-4" />
          <span className="text-[10px]">Captions</span>
        </button>
        <button
          onClick={() => setActiveTab('scheduler')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'scheduler' ? 'text-indigo-400' : 'text-neutral-400'}`}
        >
          <Calendar className="h-4 w-4" />
          <span className="text-[10px]">Scheduler</span>
        </button>
      </div>
    </header>
  );
};
