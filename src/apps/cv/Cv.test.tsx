import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cv } from '@/data/cv.ts';
import Cv from '@/apps/cv/Cv.tsx';

describe('Cv', () => {
  it('renders the five CV sections', () => {
    const { getByRole } = render(<Cv />);

    expect(getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Education' })).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
  });

  it('renders about content from the CV data source', () => {
    const { getByText } = render(<Cv />);

    expect(getByText(cv.about.name)).toBeInTheDocument();
    expect(getByText(cv.about.role)).toBeInTheDocument();
    expect(
      getByText((_, element) => element?.textContent === cv.about.summary),
    ).toBeInTheDocument();
  });

  it('renders contact links from the CV data source', () => {
    const { getByRole } = render(<Cv />);

    expect(getByRole('link', { name: cv.contact.email })).toHaveAttribute(
      'href',
      `mailto:${cv.contact.email}`,
    );

    for (const social of cv.contact.socials) {
      expect(getByRole('link', { name: social.url })).toHaveAttribute(
        'href',
        social.url,
      );
    }
  });

  it('renders experience, education, and skills from the CV data source', () => {
    const { getAllByText, getByText } = render(<Cv />);

    for (const entry of cv.experience) {
      expect(getByText(entry.title)).toBeInTheDocument();
      expect(getByText(entry.description)).toBeInTheDocument();
      for (const bullet of entry.bullets) {
        expect(getByText(bullet)).toBeInTheDocument();
      }
    }

    for (const entry of cv.education) {
      expect(getByText(entry.title)).toBeInTheDocument();
      expect(getAllByText(entry.organization)).not.toHaveLength(0);
    }

    for (const group of cv.skills) {
      expect(getByText(group.category)).toBeInTheDocument();
      for (const skill of group.skills) {
        expect(getAllByText(skill.name, { exact: false })).not.toHaveLength(0);
      }
    }
  });
});
