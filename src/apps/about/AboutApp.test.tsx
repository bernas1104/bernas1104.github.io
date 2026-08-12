import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { about } from '@/data/about.ts';
import AboutApp from '@/apps/about/AboutApp.tsx';

describe('AboutApp', () => {
  it('renders the tree-view with name, role, and summary from the data file', () => {
    const { getByText } = render(<AboutApp />);
    expect(getByText(about.name)).toBeInTheDocument();
    expect(getByText(about.role)).toBeInTheDocument();
    expect(getByText(about.summary)).toBeInTheDocument();
  });

  it('does not hardcode bio text (all visible copy matches src/data/about.ts)', () => {
    const { container, queryByText } = render(<AboutApp />);
    expect(container.textContent).toBe(about.name + about.role + about.summary);
    expect(queryByText('Your Name')).not.toBeInTheDocument();
    expect(queryByText('Your Role')).not.toBeInTheDocument();
  });

  it('renders the avatar with an alt derived from the name and stable dimensions', () => {
    const { getByAltText } = render(<AboutApp />);
    const avatar = getByAltText(about.name + ' photo');
    expect(avatar).toHaveAttribute('src', about.avatar);
    expect(avatar).toHaveAttribute('width', '100');
    expect(avatar).toHaveAttribute('height', 'auto');
  });

  it('renders the app chrome', () => {
    const { container } = render(<AboutApp />);
    expect(container.querySelector('.about-app-container')).toBeInTheDocument();
    expect(container.querySelector('.tree-view')).toBeInTheDocument();
  });
});
