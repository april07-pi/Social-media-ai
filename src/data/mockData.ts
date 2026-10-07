import { CreatorAccount, ScheduledPost, VlogVideoScript } from '../types';

// Real generated image paths
export const IMAGES = {
  tokyoVlog: '/src/assets/images/vlog_tokyo_morning_1791213730652.jpg',
  deskSetup: '/src/assets/images/vlog_desk_setup_1791213742898.jpg',
  outdoorGolden: '/src/assets/images/vlog_outdoor_golden_1791213755167.jpg',
  creatorAvatar: '/src/assets/images/creator_avatar_1791213766178.jpg',
};

// Generate 7 days x 24 hours engagement heatmap
const generateRealisticHeatmap = () => {
  const days = 7;
  const hours = 24;
  const grid: number[][] = [];

  for (let d = 0; d < days; d++) {
    const row: number[] = [];
    for (let h = 0; h < hours; h++) {
      let base = 15 + Math.floor(Math.sin((h / 24) * Math.PI) * 40);
      
      // Peak hours on weekdays (lunch 11-13, evening 18-21)
      if (d >= 1 && d <= 4) {
        if (h >= 11 && h <= 13) base += 35;
        if (h >= 18 && h <= 21) base += 40;
      }
      // Weekend peak (Sunday afternoon 14-20)
      if (d === 6) {
        if (h >= 13 && h <= 20) base += 45;
      }
      // Friday & Saturday evening
      if (d === 4 || d === 5) {
        if (h >= 19 && h <= 22) base += 30;
      }

      // Add slight organic variance
      const val = Math.min(100, Math.max(10, base + Math.floor(Math.sin(d + h) * 12)));
      row.push(val);
    }
    grid.push(row);
  }
  return grid;
};

export const MOCK_ACCOUNTS: CreatorAccount[] = [
  {
    id: 'acc-1',
    handle: '@alexcreates',
    displayName: 'Alex Rivers',
    avatarUrl: IMAGES.creatorAvatar,
    platform: 'instagram',
    niche: 'Tech & Modern Lifestyle',
    followers: 48200,
    following: 412,
    totalPosts: 184,
    avgEngagementRate: 5.4,
    avgWatchTimeSec: 28.4,
    avgVideoViews: 32600,
    saveToShareRatio: '2.4:1',
    bio: 'Documenting honest creative workflows, minimalist desk setups & building in public. 🎬 Tokyo & SF.',
    audienceDemographics: {
      topLocations: [
        { name: 'United States', percentage: 44 },
        { name: 'United Kingdom', percentage: 18 },
        { name: 'Germany', percentage: 12 },
        { name: 'Japan', percentage: 9 },
      ],
      topAgeGroup: '22 - 34 years (68%)',
      genderRatio: '58% M / 42% F',
    },
    heatmapData: generateRealisticHeatmap(),
    recentPosts: [
      {
        id: 'post-101',
        title: 'Morning Routine: What 5 AM Actually Feels Like in Tokyo',
        type: 'video_vlog',
        publishedAt: '2026-10-02T11:30:00Z',
        views: 84200,
        likes: 6420,
        comments: 482,
        saves: 2140,
        shares: 980,
        retentionPercent: 78.4,
        thumbnail: IMAGES.tokyoVlog,
      },
      {
        id: 'post-102',
        title: 'Minimalist Desk Setup: Everything I Stripped Away',
        type: 'video_vlog',
        publishedAt: '2026-09-28T18:45:00Z',
        views: 112000,
        likes: 9830,
        comments: 720,
        saves: 4890,
        shares: 1640,
        retentionPercent: 84.1,
        thumbnail: IMAGES.deskSetup,
      },
      {
        id: 'post-103',
        title: 'Why I Walk 10,000 Steps Without Headphones Every Day',
        type: 'video_vlog',
        publishedAt: '2026-09-24T12:15:00Z',
        views: 63400,
        likes: 4910,
        comments: 310,
        saves: 1840,
        shares: 720,
        retentionPercent: 71.2,
        thumbnail: IMAGES.outdoorGolden,
      },
    ],
  },
  {
    id: 'acc-2',
    handle: '@alexrivers_tok',
    displayName: 'Alex Rivers',
    avatarUrl: IMAGES.creatorAvatar,
    platform: 'tiktok',
    niche: 'Creator Workflows & Tech Hacks',
    followers: 86400,
    following: 198,
    totalPosts: 242,
    avgEngagementRate: 6.8,
    avgWatchTimeSec: 22.1,
    avgVideoViews: 74500,
    saveToShareRatio: '3.1:1',
    bio: 'Fast-paced edits, real creator studio breakdowns & gear that actually matters.',
    audienceDemographics: {
      topLocations: [
        { name: 'United States', percentage: 52 },
        { name: 'Canada', percentage: 16 },
        { name: 'Australia', percentage: 11 },
        { name: 'UK', percentage: 10 },
      ],
      topAgeGroup: '18 - 28 years (72%)',
      genderRatio: '52% M / 48% F',
    },
    heatmapData: generateRealisticHeatmap(),
    recentPosts: [
      {
        id: 'post-201',
        title: '3 Apps That Will Save You 10 Hours of Video Editing',
        type: 'reel',
        publishedAt: '2026-10-01T19:30:00Z',
        views: 194000,
        likes: 18400,
        comments: 940,
        saves: 11200,
        shares: 3400,
        retentionPercent: 88.6,
        thumbnail: IMAGES.deskSetup,
      },
    ],
  },
  {
    id: 'acc-3',
    handle: '@AlexRiversStudio',
    displayName: 'Alex Rivers Studio',
    avatarUrl: IMAGES.creatorAvatar,
    platform: 'youtube',
    niche: 'Cinematic Filmmaking & Lifestyle',
    followers: 124000,
    following: 82,
    totalPosts: 94,
    avgEngagementRate: 4.9,
    avgWatchTimeSec: 210.0,
    avgVideoViews: 68000,
    saveToShareRatio: '1.8:1',
    bio: 'Deep-dive documentary vlogs, cinematic travel essays and sustainable creative life.',
    audienceDemographics: {
      topLocations: [
        { name: 'United States', percentage: 48 },
        { name: 'Germany', percentage: 14 },
        { name: 'Japan', percentage: 12 },
        { name: 'Canada', percentage: 9 },
      ],
      topAgeGroup: '25 - 40 years (64%)',
      genderRatio: '62% M / 38% F',
    },
    heatmapData: generateRealisticHeatmap(),
    recentPosts: [
      {
        id: 'post-301',
        title: '24 Hours in Tokyo: A Solo Creator Vlog',
        type: 'video_vlog',
        publishedAt: '2026-09-21T15:00:00Z',
        views: 242000,
        likes: 19200,
        comments: 1420,
        saves: 8400,
        shares: 3200,
        retentionPercent: 62.4,
        thumbnail: IMAGES.tokyoVlog,
      },
    ],
  },
];

export const INITIAL_VLOG_SCRIPT: VlogVideoScript = {
  id: 'vlog-tokyo-dawn',
  title: 'Realistic Morning Vlog: The Quiet Hours in Shibuya',
  concept: 'A grounded, authentic first-person morning vlog breaking down how to establish high focus before the city wakes up.',
  style: 'Cinematic POV Vlog + Talking Head',
  targetPlatform: 'instagram',
  duration: '45s',
  tone: 'Authentic & Reflective',
  aspectRatio: '9:16',
  hookScore: 96,
  hook: {
    text: 'Stop forcing 5 AM wakeups. Here is what actually unlocked my productivity.',
    visualCue: 'Handheld POV shot grabbing iced matcha by a rainy Tokyo window, camera snaps to creator face with soft natural daylight',
    spokenAudio: 'I spent years thinking waking up before everyone else was the secret. It was not. Here is what changed everything.',
  },
  soundtrackRecommendation: 'Subdued ambient lofi beat (82 BPM) with warm upright bass and subtle rain Foley',
  colorGradingNotes: 'Cinematic natural Fuji/Portra aesthetic: muted greens, warm morning highlights, 4.5:1 text contrast',
  createdAt: '2026-10-05T08:00:00Z',
  scenes: [
    {
      id: 'sc-1',
      timestamp: '0:00 - 0:04',
      durationSec: 4,
      sceneType: 'hook',
      framing: 'Handheld POV 28mm Wide',
      cameraMovement: 'Smooth push-in with gentle organic handheld breathing',
      visualDescription: 'Natural eye-level perspective looking out over misty Shibuya crossing, holding a morning matcha latte, camera pivots smoothly to creator walking into room.',
      scriptVoiceover: 'I used to think 5 AM wakeups were the secret to high focus. They are not. Here is the single habit that actually worked.',
      onScreenText: 'The 5 AM myth ☕',
      soundDesignAndMusic: 'Subtle atmospheric city rain + gentle reverse cymbal swell into first kick drum',
      pacingNote: 'Cut immediately on the spoken word "worked" (0:03.8) to hold scroll attention',
      imagePreview: IMAGES.tokyoVlog,
    },
    {
      id: 'sc-2',
      timestamp: '0:04 - 0:16',
      durationSec: 12,
      sceneType: 'talking_head',
      framing: 'Medium Close-up 35mm at Desk',
      cameraMovement: 'Slow subtle handheld tracking as creator sits and adjusts microphone',
      visualDescription: 'Creator sits at a clean wooden desk with warm lamp glow, looking directly into camera with conversational, unpretentious posture.',
      scriptVoiceover: 'Instead of fighting sleep biology, I instituted a 90-minute Zero-Input Window. No email, no notifications, no algorithmic feeds until the first hard task is done.',
      onScreenText: 'Rule 1: The 90-Min Zero-Input Window',
      soundDesignAndMusic: 'Lofi rhythm settles smoothly at 45% volume behind dialogue',
      pacingNote: 'Insert quick 1.2s B-roll cut of phone flipped face down on desk at 0:08',
      imagePreview: IMAGES.deskSetup,
    },
    {
      id: 'sc-3',
      timestamp: '0:16 - 0:30',
      durationSec: 14,
      sceneType: 'b_roll',
      framing: 'Top-Down Macro & Over-the-Shoulder',
      cameraMovement: 'Cinematic slow slider pan across mechanical keyboard and notebook',
      visualDescription: 'Detailed close-up of fountain pen writing the 1 essential milestone of the day, followed by screen capture of clean timeline software.',
      scriptVoiceover: 'When you protect your baseline energy before the world demands your attention, your cognitive stamina doubles. It feels like getting an extra 4 hours every single day.',
      onScreenText: 'Protect your energy baseline ✍️',
      soundDesignAndMusic: 'Tactile keyboard clatter and pen-on-paper Foley layered softly into mix',
      pacingNote: '2 rhythmic jump cuts timed precisely to the beat of the soundtrack',
      imagePreview: IMAGES.deskSetup,
    },
    {
      id: 'sc-4',
      timestamp: '0:30 - 0:45',
      durationSec: 15,
      sceneType: 'outro',
      framing: 'Golden Hour Silhouette / Walking POV',
      cameraMovement: 'Gentle tracking shot walking outdoors along scenic viewpoint',
      visualDescription: 'Creator walking outdoors in warm golden sunlight, looking back over shoulder with genuine smile, holding camera naturally.',
      scriptVoiceover: 'Try testing this for just 3 mornings. Bookmark this reel so you have the framework ready when you wake up tomorrow.',
      onScreenText: 'Save this for tomorrow morning ↗',
      soundDesignAndMusic: 'Music swells to full presence, trailing off with warm acoustic decay',
      pacingNote: 'Leave 1.5 seconds of ambient walking visual after last word for effortless loop replay',
      imagePreview: IMAGES.outdoorGolden,
    },
  ],
};

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'sched-1',
    title: 'The 90-Minute Zero Input Morning Vlog',
    platform: 'instagram',
    type: 'video_vlog',
    scheduledTime: '2026-10-06T15:30:00Z', // Tomorrow at optimal window (11:30 AM EST)
    status: 'scheduled',
    caption: `I spent years forcing 5 AM wakeups thinking it would fix my focus. It didn't.\n\nHere is the real secret: protect your first 90 minutes from any algorithmic input. No feeds, no inbox, no Slack.\n\nDrop a comment if you're trying this tomorrow morning! ☕`,
    hashtags: ['#vloglife', '#creatorworkflow', '#mindfulliving', '#productivityhacks', '#tokyocreator'],
    videoThumbnail: IMAGES.tokyoVlog,
    scriptSnippet: 'Stop forcing 5 AM wakeups. Here is what actually unlocked my productivity.',
    optimalTimeMatch: true,
    engagementPotential: 96,
  },
  {
    id: 'sched-2',
    title: 'Minimalist Desk Setup: Complete 2026 Tour',
    platform: 'tiktok',
    type: 'reel',
    scheduledTime: '2026-10-07T22:45:00Z', // Thursday peak (6:45 PM EST)
    status: 'scheduled',
    caption: `Everything I stripped away from my creator workspace to 2x my output. Clean lines, zero visual clutter, pure focus.\n\nWhich piece would you add to your setup?`,
    hashtags: ['#desksetup', '#creativestudio', '#minimalistworkspace', '#techsetup', '#filmmaking'],
    videoThumbnail: IMAGES.deskSetup,
    scriptSnippet: 'The 3-piece workstation that completely eliminated creative friction.',
    optimalTimeMatch: true,
    engagementPotential: 94,
  },
  {
    id: 'sched-3',
    title: 'Why I Walk 10k Steps Without Headphones',
    platform: 'youtube',
    type: 'short',
    scheduledTime: '2026-10-09T18:00:00Z', // Saturday afternoon peak
    status: 'scheduled',
    caption: `Silence is the ultimate competitive advantage in an attention economy. Here is what happens when you let your subconscious process problems in peace.`,
    hashtags: ['#mindset', '#solopreneur', '#creativeprocess', '#walkingmeditation'],
    videoThumbnail: IMAGES.outdoorGolden,
    scriptSnippet: 'Your best ideas never happen when you are consuming information.',
    optimalTimeMatch: false,
    engagementPotential: 88,
  },
];
