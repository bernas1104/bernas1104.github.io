import type { Brand, IconName } from '@/common/types.ts';

export type Url = Brand<string, 'Url'>;

export type MonthYear = Brand<string, 'MonthYear'>;

export type About = {
  name: string;
  role: string;
  summary: string;
  avatar?: Url;
};

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Skill = {
  name: string;
  level?: Level;
};

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

export type Period = {
  startDate: MonthYear;
  endDate?: MonthYear;
};

export type TimelineEntry = {
  title: string;
  organization: string;
  period: Period;
};

export type ExperienceEntry = TimelineEntry & {
  description: string;
  bullets: string[];
  location?: string;
};

export type EducationEntry = TimelineEntry;

export type Link = {
  label: string;
  url: Url;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  links: Link[];
  thumbnail?: Url;
  highlights?: string[];
};

export type SocialLink = {
  label: string;
  url: Url;
  icon: IconName;
};

export type Contact = {
  email: string;
  socials: SocialLink[];
  location?: string;
};

export type Cv = {
  about: About;
  contact: Contact;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
};
