export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  INSTAGRAM_BUSINESS_LUNCH: 'instagram-business-lunch',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube'
};

export const PLATFORM_LABELS = {
  [PLATFORMS.INSTAGRAM]: 'Roland Frasier Instagram + Stories',
  [PLATFORMS.INSTAGRAM_BUSINESS_LUNCH]: 'Business Lunch Instagram (co-post to Roland Frasier)',
  [PLATFORMS.LINKEDIN]: 'LinkedIn',
  [PLATFORMS.YOUTUBE]: 'YouTube Shorts'
};

export const TASK_TAGS = [
  'studio work',
  'presentation',
  'content creation',
  'editing',
  'planning',
  'meeting',
  'research',
  'admin',
  'podcast',
  'newsletter'
];

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked'
};

export const NEWSLETTER_TYPES = {
  CRAZY_EXPERIMENTS: 'crazy-experiments',
  ROLANDS_RIFF: 'rolands-riff'
};

export const NEWSLETTER_SCHEDULE = {
  [NEWSLETTER_TYPES.CRAZY_EXPERIMENTS]: {
    name: 'Crazy Experiments',
    frequency: 'bi-weekly',
    dayOfWeek: 5, // Friday
    weekInterval: 2
  },
  [NEWSLETTER_TYPES.ROLANDS_RIFF]: {
    name: "Roland's Riff",
    frequency: 'weekly',
    dayOfWeek: 5, // Friday
    weekInterval: 1
  }
};

export const SPRINT_WEEKS = {
  CONTENT_THEME: 1,
  CTA_CONTENT: 2
};

export const PODCAST_INFO = {
  name: 'Business Lunch Podcast',
  episodesPerWeek: 2,
  platforms: ['Captivate', 'YouTube', 'Instagram'],
  requiresClips: true
};