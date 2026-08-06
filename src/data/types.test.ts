import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type { IconName } from '@/common/types.ts';
import type {
  Url,
  MonthYear,
  About,
  Level,
  Skill,
  SkillGroup,
  Period,
  TimelineEntry,
  ExperienceEntry,
  EducationEntry,
  Link,
  Project,
  SocialLink,
  Contact,
  Cv,
} from '@/data/types.ts';

describe('Url', () => {
  it('branded type retains base type properties', () => {
    expectTypeOf<Url>().toMatchTypeOf<string>();
    expectTypeOf<string>().not.toExtend<Url>();
  });
});

describe('MonthYear', () => {
  it('branded type retains base type properties', () => {
    expectTypeOf<MonthYear>().toMatchTypeOf<string>();
    expectTypeOf<string>().not.toExtend<MonthYear>();
  });
});

describe('About', () => {
  it('has the expected properties', () => {
    expectTypeOf<About>().toHaveProperty('name').toEqualTypeOf<string>();
    expectTypeOf<About>().toHaveProperty('role').toEqualTypeOf<string>();
    expectTypeOf<About>().toHaveProperty('summary').toEqualTypeOf<string>();
    expectTypeOf<About>()
      .toHaveProperty('avatar')
      .toEqualTypeOf<Url | undefined>();
  });
});

describe('Level', () => {
  it('is a union of expected string literals', () => {
    expectTypeOf<Level>().toEqualTypeOf<
      'beginner' | 'intermediate' | 'advanced' | 'expert'
    >();
  });
});

describe('Skill', () => {
  it('has the expected properties', () => {
    expectTypeOf<Skill>().toHaveProperty('name').toEqualTypeOf<string>();
    expectTypeOf<Skill>()
      .toHaveProperty('level')
      .toEqualTypeOf<Level | undefined>();
  });
});

describe('SkillGroup', () => {
  it('has the expected properties', () => {
    expectTypeOf<SkillGroup>()
      .toHaveProperty('category')
      .toEqualTypeOf<string>();
    expectTypeOf<SkillGroup>()
      .toHaveProperty('skills')
      .toEqualTypeOf<Skill[]>();
  });
});

describe('Period', () => {
  it('has the expected properties', () => {
    expectTypeOf<Period>()
      .toHaveProperty('startDate')
      .toEqualTypeOf<MonthYear>();
    expectTypeOf<Period>()
      .toHaveProperty('endDate')
      .toEqualTypeOf<MonthYear | undefined>();
  });
});

describe('TimelineEntry', () => {
  it('has the expected properties', () => {
    expectTypeOf<TimelineEntry>()
      .toHaveProperty('title')
      .toEqualTypeOf<string>();
    expectTypeOf<TimelineEntry>()
      .toHaveProperty('organization')
      .toEqualTypeOf<string>();
    expectTypeOf<TimelineEntry>()
      .toHaveProperty('period')
      .toEqualTypeOf<Period>();
  });
});

describe('ExperienceEntry', () => {
  it('extends TimelineEntry', () => {
    expectTypeOf<ExperienceEntry>().toMatchTypeOf<TimelineEntry>();
    expectTypeOf<TimelineEntry>().not.toExtend<ExperienceEntry>();
  });

  it('has the expected additional properties', () => {
    expectTypeOf<ExperienceEntry>()
      .toHaveProperty('description')
      .toEqualTypeOf<string>();
    expectTypeOf<ExperienceEntry>()
      .toHaveProperty('bullets')
      .toEqualTypeOf<string[]>();
  });
});

describe('EducationEntry', () => {
  it('is exactly TimelineEntry', () => {
    expectTypeOf<EducationEntry>().toEqualTypeOf<TimelineEntry>();
  });
});

describe('Link', () => {
  it('has the expected properties', () => {
    expectTypeOf<Link>().toHaveProperty('label').toEqualTypeOf<string>();
    expectTypeOf<Link>().toHaveProperty('url').toEqualTypeOf<Url>();
  });
});

describe('Project', () => {
  it('has the expected properties', () => {
    expectTypeOf<Project>().toHaveProperty('id').toEqualTypeOf<string>();
    expectTypeOf<Project>().toHaveProperty('name').toEqualTypeOf<string>();
    expectTypeOf<Project>()
      .toHaveProperty('description')
      .toEqualTypeOf<string>();
    expectTypeOf<Project>().toHaveProperty('tags').toEqualTypeOf<string[]>();
    expectTypeOf<Project>().toHaveProperty('links').toEqualTypeOf<Link[]>();
    expectTypeOf<Project>()
      .toHaveProperty('thumbnail')
      .toEqualTypeOf<Url | undefined>();
    expectTypeOf<Project>()
      .toHaveProperty('highlights')
      .toEqualTypeOf<string[] | undefined>();
  });
});

describe('SocialLink', () => {
  it('has the expected properties', () => {
    expectTypeOf<SocialLink>().toHaveProperty('label').toEqualTypeOf<string>();
    expectTypeOf<SocialLink>().toHaveProperty('url').toEqualTypeOf<Url>();
    expectTypeOf<SocialLink>().toHaveProperty('icon').toEqualTypeOf<IconName>();
  });
});

describe('Contact', () => {
  it('has the expected properties', () => {
    expectTypeOf<Contact>().toHaveProperty('email').toEqualTypeOf<string>();
    expectTypeOf<Contact>()
      .toHaveProperty('socials')
      .toEqualTypeOf<SocialLink[]>();
    expectTypeOf<Contact>()
      .toHaveProperty('location')
      .toEqualTypeOf<string | undefined>();
  });
});

describe('Cv', () => {
  it('has the expected properties', () => {
    expectTypeOf<Cv>().toHaveProperty('about').toEqualTypeOf<About>();
    expectTypeOf<Cv>().toHaveProperty('contact').toEqualTypeOf<Contact>();
    expectTypeOf<Cv>()
      .toHaveProperty('experience')
      .toEqualTypeOf<ExperienceEntry[]>();
    expectTypeOf<Cv>()
      .toHaveProperty('education')
      .toEqualTypeOf<EducationEntry[]>();
    expectTypeOf<Cv>().toHaveProperty('skills').toEqualTypeOf<SkillGroup[]>();
  });
});
