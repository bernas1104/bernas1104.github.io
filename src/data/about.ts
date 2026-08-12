import type { About, Url } from '@/data/types.ts';
import avatar from '@/assets/avatar.jpeg';

export const about: About = {
  name: 'Bernardo Costa Nascimento',
  role: 'Fullstack Engineer',
  summary:
    "I'm a backend-focused fullstack developer currently working in Ambev Tech's logistics tower, where I build and maintain a microservices ecosystem of 10+ APIs powered by ASP.NET Core, MongoDB and Azure Service Bus. I hold a BSc in Computer Science from Universidade de Brasília and a postgraduate degree in Distributed Software Architecture — and I'm also a graphic designer by training, which keeps me invested in how the code I write feels for the people who use it.\n\nMy goal is to write the best code I can: fast, but above all maintainable. That drives me to constantly study best practices, patterns and new technologies — things like Domain-Driven Design, Test-Driven Development and microservices architecture — across a stack centered on C#/.NET, JavaScript and TypeScript, with side experience in Node.js and React.",
  avatar: avatar as Url,
};
