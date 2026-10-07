import React, { useState, useEffect } from 'react';
import { CreatorAccount, ScheduledPost, VlogVideoScript } from './types';
import { MOCK_ACCOUNTS, INITIAL_SCHEDULED_POSTS, IMAGES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { AccountAnalyzer } from './components/AccountAnalyzer';
import { VideoStudio } from './components/VideoStudio';
import { OptimalTimesView } from './components/OptimalTimesView';
import { CaptionStudio } from './components/CaptionStudio';
import { PostScheduler } from './components/PostScheduler';
import { CreatePostModal } from './components/CreatePostModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'analyzer' | 'video' | 'times' | 'captions' | 'scheduler'
  >('analyzer');

  // Load from localStorage or mockData
  const [accounts, setAccounts] = useState<CreatorAccount[]>(() => {
    try {
      const saved = localStorage.getItem('loomix_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading saved accounts');
    }
    return MOCK_ACCOUNTS;
  });

  const [selectedAccount, setSelectedAccount] = useState<CreatorAccount>(() => {
    return accounts[0] || MOCK_ACCOUNTS[0];
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem('loomix_scheduled_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading saved posts');
    }
    return INITIAL_SCHEDULED_POSTS;
  });

  // Cross-component communication state
  const [videoTopic, setVideoTopic] = useState<string>('');
  const [captionTopic, setCaptionTopic] = useState<string>('');

  // Create post modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<{
    title?: string;
    caption?: string;
    tags?: string[];
    thumbnail?: string;
  }>({});

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('loomix_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('loomix_scheduled_posts', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleUpdateAccount = (updated: CreatorAccount) => {
    const existingIndex = accounts.findIndex((a) => a.id === updated.id);
    if (existingIndex >= 0) {
      const copy = [...accounts];
      copy[existingIndex] = updated;
      setAccounts(copy);
    } else {
      setAccounts([updated, ...accounts]);
    }
    setSelectedAccount(updated);
    showToast(`Loaded account analysis for ${updated.handle}`);
  };

  const handleSelectPillarForVideo = (pillarName: string, format: string) => {
    setVideoTopic(`${pillarName} (${format})`);
    setActiveTab('video');
    showToast(`Loaded "${pillarName}" into Realistic Video Studio`);
  };

  const handleOpenVideoStudioWithPost = (title: string) => {
    setVideoTopic(`Remix: ${title}`);
    setActiveTab('video');
    showToast(`Loaded "${title}" into Video Studio`);
  };

  const handleSendVideoToScheduler = (script: VlogVideoScript) => {
    setModalInitialData({
      title: script.title,
      caption: `${script.hook.spokenAudio}\n\nKey takeaways from today's vlog:\n1. ${script.scenes[1]?.onScreenText || 'Focus window'}\n2. ${script.scenes[2]?.onScreenText || 'Deep work'}\n\nDrop a comment if you're trying this routine tomorrow! ☕`,
      tags: ['#vlogaesthetic', '#creatorlife', '#filmmaking', '#productivity'],
      thumbnail: script.scenes[0]?.imagePreview || IMAGES.tokyoVlog,
    });
    setIsCreateModalOpen(true);
  };

  const handleSendCaptionsToScheduler = (captionText: string, tags: string[]) => {
    setModalInitialData({
      title: 'Scheduled Creator Post',
      caption: captionText,
      tags: tags,
      thumbnail: IMAGES.tokyoVlog,
    });
    setIsCreateModalOpen(true);
  };

  const handleSelectSlotToSchedule = (day: string, hour: number) => {
    setModalInitialData({
      title: `Peak Engagement Vlog (${day} at ${hour}:00)`,
      caption: `Publishing during the verified ${day} audience peak window. Focus on high-retention first 3 seconds.\n\nSave this framework for later! 🔖`,
      tags: ['#viralvideo', '#contentgrowth', '#creatorstudio'],
      thumbnail: IMAGES.deskSetup,
    });
    setIsCreateModalOpen(true);
  };

  const handleAddPost = (newPost: ScheduledPost) => {
    setScheduledPosts([newPost, ...scheduledPosts]);
    setIsCreateModalOpen(false);
    setActiveTab('scheduler');
    showToast('Post scheduled & added to automation queue!');
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter((p) => p.id !== id));
    showToast('Post removed from schedule.');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Contract (Single brand mark, 5 nav links, primary action) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={(acc) => {
          setSelectedAccount(acc);
          showToast(`Switched active account to ${acc.handle}`);
        }}
        onOpenNewPostModal={() => {
          setModalInitialData({});
          setIsCreateModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyzer' && (
          <AccountAnalyzer
            account={selectedAccount}
            onUpdateAccount={handleUpdateAccount}
            onSelectPillarForVideo={handleSelectPillarForVideo}
            onOpenVideoStudioWithPost={handleOpenVideoStudioWithPost}
          />
        )}

        {activeTab === 'video' && (
          <VideoStudio
            account={selectedAccount}
            onSendToScheduler={handleSendVideoToScheduler}
            onSendToCaptions={(topic) => {
              setCaptionTopic(topic);
              setActiveTab('captions');
              showToast('Topic transferred to Caption Studio');
            }}
            initialTopic={videoTopic}
          />
        )}

        {activeTab === 'times' && (
          <OptimalTimesView
            account={selectedAccount}
            onSelectSlotToSchedule={handleSelectSlotToSchedule}
          />
        )}

        {activeTab === 'captions' && (
          <CaptionStudio
            account={selectedAccount}
            onSendToScheduler={handleSendCaptionsToScheduler}
            initialTopic={captionTopic}
          />
        )}

        {activeTab === 'scheduler' && (
          <PostScheduler
            scheduledPosts={scheduledPosts}
            account={selectedAccount}
            onAddPost={handleAddPost}
            onDeletePost={handleDeletePost}
            onOpenCreateModal={() => {
              setModalInitialData({});
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Create / Schedule Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal
          account={selectedAccount}
          initialTitle={modalInitialData.title}
          initialCaption={modalInitialData.caption}
          initialTags={modalInitialData.tags}
          initialThumbnail={modalInitialData.thumbnail}
          onSave={handleAddPost}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Sleek Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-xs font-medium rounded-xl shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Footer (Compliant with Anti-Slop discipline: no telemetry engines or fake status bars) */}
      <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="font-semibold text-neutral-300">Loomix Studio</span>
            <span aria-hidden="true">·</span>
            <span>AI Social Intelligence, Realistic Video Director & Scheduler</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Powered by Gemini 3.8</span>
            <span aria-hidden="true">·</span>
            <span>2026 Loomix Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
