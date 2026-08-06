import type { Cv } from '@/data/types.ts';

// PLACEHOLDER
export const cv: Cv = {
  about: {
    name: 'Your Name',
    role: 'Your Role',
    summary: 'A short summary about you.',
  },
  contact: {
    email: 'you@example.com',
    location: 'Your City, Country',
    socials: [
      {
        label: 'GitHub',
        url: 'https://github.com/' as Cv['contact']['socials'][number]['url'],
        icon: 'github',
      },
    ],
  },
  experience: [
    {
      title: 'Your Title',
      organization: 'Your Company',
      period: {
        startDate:
          'Jan 2020' as Cv['experience'][number]['period']['startDate'],
      },
      description: 'A short description of the role.',
      bullets: ['A placeholder bullet point.'],
    },
  ],
  education: [
    {
      title: 'Your Degree',
      organization: 'Your University',
      period: {
        startDate: 'Jan 2016' as Cv['education'][number]['period']['startDate'],
        endDate: 'Jan 2020' as Cv['education'][number]['period']['startDate'],
      },
    },
  ],
  skills: [
    {
      category: 'Languages',
      skills: [{ name: 'Your Language', level: 'intermediate' }],
    },
  ],
};
