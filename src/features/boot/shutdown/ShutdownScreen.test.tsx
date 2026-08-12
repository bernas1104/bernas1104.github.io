import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShutdownScreen } from '@/features/boot/shutdown/ShutdownScreen.tsx';

describe('ShutdownScreen', () => {
  it('renders a status region labelled as shutdown complete', () => {
    render(<ShutdownScreen />);
    expect(
      screen.getByRole('status', { name: 'BernasOS shutdown complete' }),
    ).toBeInTheDocument();
  });

  it('renders the Win98 safe-to-turn-off copy', () => {
    render(<ShutdownScreen />);
    expect(
      screen.getByText("It's now safe to turn off your computer."),
    ).toBeInTheDocument();
  });
});
