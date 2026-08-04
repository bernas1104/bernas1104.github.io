import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Clock } from '@/features/desktop/components/Clock.tsx';

describe('Clock', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the clock container, separator, and clock elements', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));

    const { container } = render(<Clock />);

    expect(container.querySelector('.clock-container')).toBeInTheDocument();
    expect(container.querySelector('.vertical-separator')).toBeInTheDocument();
    expect(container.querySelector('.clock')).toBeInTheDocument();
  });

  it('renders the current time with an aria-label of "Current time"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));

    const { getByLabelText } = render(<Clock />);

    expect(getByLabelText('Current time')).toBeInTheDocument();
  });

  it('formats the time as HH:MM using a 24-hour clock', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));

    const { getByLabelText } = render(<Clock />);

    expect(getByLabelText('Current time').textContent).toMatch(/^\d{2}:\d{2}$/);
  });

  it('does not update the displayed time before 60 seconds elapse', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));

    const { getByLabelText } = render(<Clock />);
    const before = getByLabelText('Current time').textContent;

    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 45));
    vi.advanceTimersByTime(45_000);

    expect(getByLabelText('Current time').textContent).toBe(before);
  });

  it('updates the displayed time when the 60-second interval fires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));

    const { getByLabelText } = render(<Clock />);
    const before = getByLabelText('Current time').textContent;

    vi.setSystemTime(new Date(2026, 0, 1, 10, 31, 0));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    const after = getByLabelText('Current time').textContent;
    expect(after).not.toBe(before);
    expect(after).toMatch(/^\d{2}:\d{2}$/);
  });

  it('schedules exactly one interval on mount', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    render(<Clock />);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60_000);
  });

  it('clears the interval on unmount (no timer leak)', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = render(<Clock />);
    const handle = setIntervalSpy.mock.results[0]?.value;
    expect(handle).toBeDefined();

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledWith(handle);
  });
});
