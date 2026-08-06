import type { Cv } from '@/data/types.ts';
import { contact } from '@/data/contact.ts';
import { about } from '@/data/about.ts';

// PLACEHOLDER
export const cv: Cv = {
  about,
  contact,
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
        endDate: 'Jan 2020' as Cv['education'][number]['period']['endDate'],
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
