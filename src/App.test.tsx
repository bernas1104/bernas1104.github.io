import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App.tsx';
import {
  BOOT_MIN_DURATION_MS,
  usePrefersReducedMotion,
} from '@/features/boot/index.ts';

vi.mock('@/features/boot/index.ts', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/boot/index.ts')>();
  return {
    ...actual,
    usePrefersReducedMotion: vi.fn(),
  };
});

vi.mock('@/features/desktop/components/Desktop.tsx', () => ({
  Desktop: () => <div role="status" aria-label="BernasOS desktop" />,
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
      screen.queryByRole('status', { name: 'BernasOS desktop' }),
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

  it('auto-dismisses to the desktop after BOOT_MIN_DURATION_MS', () => {
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
      screen.getByRole('status', { name: 'BernasOS desktop' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS loading' }),
    ).not.toBeInTheDocument();
  });

  it('skips to the desktop when the boot screen is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('status', { name: 'BernasOS loading' }));

    expect(
      screen.getByRole('status', { name: 'BernasOS desktop' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS loading' }),
    ).not.toBeInTheDocument();
  });

  it('dismisses immediately when the user prefers reduced motion', () => {
    mockedUsePrefersReducedMotion.mockReturnValue(true);
    render(<App />);

    expect(
      screen.getByRole('status', { name: 'BernasOS desktop' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'BernasOS loading' }),
    ).not.toBeInTheDocument();
  });
});
