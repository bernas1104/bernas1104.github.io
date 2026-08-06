import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IdleScreen } from '@/features/shell/IdleScreen.tsx';

describe('IdleScreen', () => {
  it('renders a status region with an accessible name', () => {
    const { getByRole } = render(<IdleScreen />);
    expect(
      getByRole('status', { name: 'BernasOS idle screen' }),
    ).toBeInTheDocument();
  });

  it('renders the under-construction placeholder text', () => {
    const { getByText } = render(<IdleScreen />);
    expect(getByText('BernasOS is under construction.')).toBeInTheDocument();
  });

  it('renders the idle screen chrome', () => {
    const { container } = render(<IdleScreen />);
    expect(container.querySelector('.idle-screen')).toBeInTheDocument();
  });
});
