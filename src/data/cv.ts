import type { Cv, MonthYear } from '@/data/types.ts';
import { contact } from '@/data/contact.ts';
import { about } from '@/data/about.ts';

const my = (value: string): MonthYear => value as MonthYear;

export const cv: Cv = {
  about,
  contact,
  experience: [
    {
      title: 'Mid-level Software Developer II',
      organization: 'Ambev Tech',
      period: {
        startDate: my('Aug 2022'),
      },
      location: 'Brasília, Brazil',
      description:
        "Fullstack developer with a backend focus in Ambev Tech's logistics tower, supporting delivery tracking and third-party freight operations through APIs and microservices.",
      bullets: [
        'Built and maintained partner integrations for delivery tracking software in a microservices environment.',
        'Supported an ecosystem of more than 10 APIs built with ASP.NET Core, PostgreSQL, MongoDB and Azure Service Bus.',
        'Joined the freight-offering squad in April 2023, working on the migration of a legacy API toward a microservices architecture.',
        'Delivered fullstack changes across new APIs, the legacy codebase and React-based frontend applications.',
        'Worked across .NET Framework, .NET Core, SQL Server, Entity Framework, MongoDB and Azure Service Bus.',
      ],
    },
    {
      title: 'Mid-level .NET Developer',
      organization: 'Wiz Soluções',
      period: {
        startDate: my('Oct 2020'),
        endDate: my('Jun 2022'),
      },
      location: 'Brasília, Brazil',
      description:
        "Fullstack developer with a backend focus on Wiz's credit pipelines and Smart Insurance platform, applying Test-Driven Development across the stack.",
      bullets: [
        "Built and maintained fullstack features for Wiz's credit pipelines until February 2022 and for the Smart Insurance platform thereafter.",
        'Delivered backend services with ASP.NET and SQL Server, and frontend applications with Angular.',
        'Applied Test-Driven Development to improve the maintainability and reliability of the codebases.',
        'Used Azure DevOps for delivery workflows and team collaboration.',
      ],
    },
    {
      title: 'Junior Front-End Developer',
      organization: 'Correio Braziliense',
      period: {
        startDate: my('Sep 2020'),
        endDate: my('Oct 2020'),
      },
      location: 'Brasília, Brazil',
      description:
        'Front-end development contract at the Correio Braziliense newspaper.',
      bullets: [
        'Contributed to front-end development tasks for the newspaper.',
      ],
    },
    {
      title: 'Software Development Intern',
      organization: 'Universidade de Brasília',
      period: {
        startDate: my('Jun 2020'),
        endDate: my('Dec 2020'),
      },
      location: 'Brasília, Brazil',
      description:
        "Built a complete system for tracking internships in the university's teaching-degree (licenciatura) courses.",
      bullets: [
        'Developed the internship-tracking system across both backend and frontend layers.',
        'Delivered the project end-to-end as part of the university internship program.',
      ],
    },
    {
      title: 'Web Development Intern',
      organization: 'Correio Braziliense',
      period: {
        startDate: my('Jan 2020'),
        endDate: my('Jun 2020'),
      },
      location: 'Brasília, Brazil',
      description:
        'Web development internship at the Correio Braziliense newspaper.',
      bullets: [
        'Contributed to web development tasks for the newspaper newsroom.',
      ],
    },
    {
      title: 'Design and Web Support Intern',
      organization: 'Maiê Lab School',
      period: {
        startDate: my('Aug 2016'),
        endDate: my('Dec 2016'),
      },
      location: 'Brasília, Brazil',
      description:
        'Graphic design internship producing promotional materials and supporting the company website.',
      bullets: [
        'Designed promotional materials including images, GIFs, banners and email marketing campaigns.',
        'Provided support for the company website.',
      ],
    },
  ],
  education: [
    {
      title: 'Postgraduate Specialization in Distributed Software Architecture',
      organization: 'Pontifícia Universidade Católica de Minas Gerais',
      period: {
        startDate: my('Sep 2021'),
        endDate: my('Nov 2022'),
      },
    },
    {
      title: "Bachelor's Degree in Computer Science",
      organization: 'Universidade de Brasília',
      period: {
        startDate: my('2014'),
        endDate: my('2020'),
      },
    },
    {
      title: 'Graphic Design and Web Design',
      organization: 'Centro Universitário de Brasília',
      period: {
        startDate: my('2014'),
        endDate: my('2015'),
      },
    },
  ],
  skills: [
    {
      category: 'Languages',
      skills: [
        { name: 'C#', level: 'expert' },
        { name: 'TypeScript', level: 'advanced' },
        { name: 'JavaScript', level: 'advanced' },
        { name: 'SQL', level: 'advanced' },
      ],
    },
    {
      category: 'Backend & .NET',
      skills: [
        { name: 'ASP.NET Core', level: 'expert' },
        { name: '.NET Framework', level: 'advanced' },
        { name: 'Entity Framework Core', level: 'advanced' },
        { name: 'Node.js', level: 'intermediate' },
      ],
    },
    {
      category: 'Databases',
      skills: [
        { name: 'SQL Server', level: 'advanced' },
        { name: 'PostgreSQL', level: 'advanced' },
        { name: 'MongoDB', level: 'advanced' },
      ],
    },
    {
      category: 'Cloud & DevOps',
      skills: [
        { name: 'Azure Service Bus', level: 'advanced' },
        { name: 'Azure DevOps', level: 'advanced' },
        { name: 'Git', level: 'advanced' },
      ],
    },
    {
      category: 'Architecture & Practices',
      skills: [
        { name: 'Microservices', level: 'advanced' },
        { name: 'Domain-Driven Design', level: 'advanced' },
        { name: 'Distributed Systems', level: 'advanced' },
        { name: 'Test-Driven Development', level: 'advanced' },
      ],
    },
    {
      category: 'Frontend',
      skills: [
        { name: 'React', level: 'advanced' },
        { name: 'Angular', level: 'beginner' },
        { name: 'HTML & CSS', level: 'advanced' },
        { name: 'React Native', level: 'beginner' },
      ],
    },
    {
      category: 'Spoken Languages',
      skills: [
        { name: 'Portuguese', level: 'expert' },
        { name: 'English', level: 'advanced' },
        { name: 'Spanish', level: 'intermediate' },
      ],
    },
  ],
};
