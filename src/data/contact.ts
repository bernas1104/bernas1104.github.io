import type { Contact } from '@/data/types.ts';

// PLACEHOLDER
export const contact: Contact = {
  email: 'you@example.com',
  location: 'Your City, Country',
  socials: [
    {
      label: 'GitHub',
      url: 'https://github.com/' as Contact['socials'][number]['url'],
      icon: 'github',
    },
  ],
};
