import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BootScreen } from '@/features/boot/index.ts';

function renderBootScreen(prefersReducedMotion = false) {
  const onSkip = vi.fn();
  const utils = render(
    <BootScreen onSkip={onSkip} prefersReducedMotion={prefersReducedMotion} />,
  );
  return { ...utils, onSkip };
}

describe('BootScreen', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a status region with an accessible name', () => {
    const { getByRole } = renderBootScreen();
    expect(
      getByRole('status', { name: 'BernasOS loading' }),
    ).toBeInTheDocument();
  });

  it('renders the wordmark, clouds, and spinner blocks', () => {
    const { getByText, container } = renderBootScreen();
    expect(getByText('BernasOS')).toBeInTheDocument();
    expect(container.querySelectorAll('.boot-cloud')).toHaveLength(3);
    expect(container.querySelectorAll('.boot-spinner-block')).toHaveLength(4);
  });

  it('calls onSkip when the screen is clicked', () => {
    const { getByRole, onSkip } = renderBootScreen();
    fireEvent.click(getByRole('status', { name: 'BernasOS loading' }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('calls onSkip when Enter is pressed', () => {
    const { onSkip } = renderBootScreen();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('calls onSkip when Space is pressed', () => {
    const { onSkip } = renderBootScreen();
    fireEvent.keyDown(window, { key: ' ' });
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('does not call onSkip for other keys', () => {
    const { onSkip } = renderBootScreen();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onSkip).not.toHaveBeenCalled();
  });

  it('attaches and removes its window listeners on mount and unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderBootScreen();

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('dismisses immediately when the user prefers reduced motion', () => {
    const { onSkip } = renderBootScreen(true);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on mount when reduced motion is not preferred', () => {
    const { onSkip } = renderBootScreen(false);
    expect(onSkip).not.toHaveBeenCalled();
  });
});
