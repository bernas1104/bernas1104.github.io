import type { Project } from '@/data/types.ts';

// PLACEHOLDER
export const projects: Project[] = [
  {
    id: 'placeholder-project',
    name: 'Placeholder Project',
    description: 'A placeholder project description.',
    tags: ['placeholder'],
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/' as Project['links'][number]['url'],
      },
    ],
  },
];
