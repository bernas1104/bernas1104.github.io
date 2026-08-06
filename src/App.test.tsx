import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App.tsx';
import { usePrefersReducedMotion } from '@/features/boot/usePrefersReducedMotion.ts';
import { BOOT_MIN_DURATION_MS } from '@/features/boot/config.ts';

vi.mock('@/features/boot/usePrefersReducedMotion.ts', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

const mockedUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
    mockedUsePrefersReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the boot screen on first load', () => {
    render(<App />);

    expect(
      screen.getByRole('status', { name: 'BernasOS loading' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS idle screen' }),
    ).not.toBeInTheDocument();
  });

  it('does not render the Vite counter', () => {
    render(<App />);

    expect(
      screen.queryByRole('button', { name: /count is/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /reset/i }),
    ).not.toBeInTheDocument();
  });

  it('auto-dismisses to the idle screen after BOOT_MIN_DURATION_MS', () => {
    render(<App />);

    act(() => {
      vi.advanceTimersByTime(BOOT_MIN_DURATION_MS - 1);
    });
    expect(
      screen.getByRole('status', { name: 'BernasOS loading' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(
      screen.getByRole('status', { name: 'BernasOS idle screen' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS loading' }),
    ).not.toBeInTheDocument();
  });

  it('skips to the idle screen when the boot screen is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('status', { name: 'BernasOS loading' }));

    expect(
      screen.getByRole('status', { name: 'BernasOS idle screen' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS loading' }),
    ).not.toBeInTheDocument();
  });

  it('dismisses immediately when the user prefers reduced motion', () => {
    mockedUsePrefersReducedMotion.mockReturnValue(true);
    render(<App />);

    expect(
      screen.getByRole('status', { name: 'BernasOS idle screen' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS loading' }),
    ).not.toBeInTheDocument();
  });
});
