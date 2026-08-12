import type { Contact } from '@/data/types.ts';

export const contact: Contact = {
  email: 'bernardoc1104@gmail.com',
  location: 'Brasília, Brazil',
  socials: [
    {
      label: 'GitHub',
      url: 'https://github.com/bernas1104' as Contact['socials'][number]['url'],
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/bernardoc1104/' as Contact['socials'][number]['url'],
      icon: 'linkedin',
    },
  ],
};
