
export enum ContentType {
  SOCIAL_MEDIA = 'Social Media Post',
  EMAIL = 'Email Campaign',
  AD_COPY = 'Ad Copy',
  BLOG_OUTLINE = 'Blog Outline'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  WITTY = 'Witty',
  PERSUASIVE = 'Persuasive',
  FRIENDLY = 'Friendly',
  URGENT = 'Urgent'
}

export interface MarketingContent {
  id: string;
  type: ContentType;
  topic: string;
  tone: Tone;
  content: string;
  imageUrl?: string;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'free' | 'premium';
}

export interface AppState {
  user: User | null;
  history: MarketingContent[];
}
