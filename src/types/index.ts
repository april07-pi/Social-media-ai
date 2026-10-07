export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'linkedin';

export interface CreatorAccount {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  platform: Platform;
  niche: string;
  followers: number;
  following: number;
  totalPosts: number;
  avgEngagementRate: number;
  avgWatchTimeSec: number;
  avgVideoViews: number;
  saveToShareRatio: string;
  bio: string;
  audienceDemographics: {
    topLocations: { name: string; percentage: number }[];
    topAgeGroup: string;
    genderRatio: string;
  };
  heatmapData: number[][]; // 7 days x 24 hours (0-100 engagement intensity)
  recentPosts: AccountPost[];
}

export interface AccountPost {
  id: string;
  title: string;
  type: 'video_vlog' | 'reel' | 'short' | 'carousel' | 'photo';
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  retentionPercent: number;
  thumbnail: string;
}

export interface VideoScene {
  id: string;
  timestamp: string;
  durationSec: number;
  sceneType: 'hook' | 'talking_head' | 'b_roll' | 'screen_capture' | 'transition' | 'outro';
  framing: string;
  cameraMovement: string;
  visualDescription: string;
  scriptVoiceover: string;
  onScreenText: string;
  soundDesignAndMusic: string;
  pacingNote: string;
  imagePreview?: string;
}

export interface VlogVideoScript {
  id: string;
  title: string;
  concept: string;
  style: string;
  targetPlatform: Platform;
  duration: string;
  estimatedDuration?: string;
  tone: string;
  aspectRatio: '9:16' | '16:9';
  hookScore: number;
  hook: {
    text: string;
    visualCue: string;
    spokenAudio: string;
  };
  soundtrackRecommendation: string;
  colorGradingNotes: string;
  scenes: VideoScene[];
  createdAt: string;
}

export interface CaptionOption {
  id: string;
  styleName: string;
  headline: string;
  body: string;
  callToAction: string;
  characterCount: number;
  toneScore: string;
}

export interface HashtagIntelligence {
  highReach: string[];
  nicheTargeted: string[];
  ultraSpecific: string[];
  recommendationNote: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  platform: Platform;
  type: 'video_vlog' | 'reel' | 'short' | 'post';
  scheduledTime: string; // ISO date string
  status: 'scheduled' | 'publishing' | 'published' | 'draft';
  caption: string;
  hashtags: string[];
  videoThumbnail?: string;
  scriptSnippet?: string;
  optimalTimeMatch: boolean;
  engagementPotential: number; // e.g. 96
}

export interface RealTimeProfileData {
  verifiedFollowers?: number;
  verifiedBio?: string;
  verifiedDisplayName?: string;
  verifiedCategory?: string;
  recentVideoHighlights?: { title: string; views?: string }[];
  searchGroundingSources?: { title: string; url: string }[];
  lastRealTimeSearchAt?: string;
}

export interface AccountAuditResult {
  accountOverview: string;
  creatorStrengths: string[];
  contentGaps: string[];
  realTimeData?: RealTimeProfileData;
  viralPillars: {
    pillarName: string;
    format: string;
    targetLength: string;
    expectedLift: string;
  }[];
  optimalPostingIntelligence: {
    primaryWindow: string;
    secondaryWindow: string;
    recommendedFrequency: string;
    audiencePeakTimezone: string;
  };
}
