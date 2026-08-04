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

  it('updates at the next minute boundary when mounted at a nonzero second', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 15));

    const { getByLabelText } = render(<Clock />);
    const before = getByLabelText('Current time').textContent;

    act(() => {
      vi.advanceTimersByTime(44_999);
    });
    expect(getByLabelText('Current time').textContent).toBe(before);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(getByLabelText('Current time').textContent).toMatch(/^10:31$/);
  });

  it('schedules a boundary timeout on mount and one interval after it fires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    render(<Clock />);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60_000);
    expect(setIntervalSpy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60_000);
  });

  it('clears the boundary timeout and interval on unmount (no timer leak)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 30, 0));
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = render(<Clock />);
    const timeoutCall = setTimeoutSpy.mock.calls.findIndex(
      ([, delay]) => delay === 60_000,
    );
    const timeoutHandle = setTimeoutSpy.mock.results[timeoutCall]?.value;
    expect(timeoutHandle).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    const intervalHandle = setIntervalSpy.mock.results[0]?.value;
    expect(intervalHandle).toBeDefined();

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutHandle);
    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalHandle);
  });
});
