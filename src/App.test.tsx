import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from '@/App.tsx';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /count is/i })).toBeInTheDocument();
  });

  it('increments the count when the Count button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /count is/i });
    expect(button).toHaveTextContent('Count is 0');

    await user.click(button);
    expect(button).toHaveTextContent('Count is 1');

    await user.click(button);
    expect(button).toHaveTextContent('Count is 2');
  });

  it('resets count to zero when Reset is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /count is/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    await user.click(button);
    await user.click(button);
    expect(button).toHaveTextContent('Count is 2');

    await user.click(resetButton);
    expect(button).toHaveTextContent('Count is 0');
  });
});
