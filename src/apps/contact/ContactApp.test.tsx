import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { contact } from '@/data/contact.ts';
import ContactApp from '@/apps/contact/ContactApp.tsx';

describe('ContactApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders email, location, and every social from contact data', () => {
    const { getByRole, getByText } = render(<ContactApp />);

    expect(getByRole('link', { name: contact.email })).toHaveAttribute(
      'href',
      `mailto:${contact.email}`,
    );
    expect(getByText(contact.location as string)).toBeInTheDocument();

    for (const social of contact.socials) {
      const link = getByRole('link', {
        name: `${social.label} (opens in new tab)`,
      });
      expect(link).toHaveAttribute('href', social.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.querySelector('svg')).toBeInTheDocument();
    }
  });

  it('copies the email and shows a confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const { getByRole } = render(<ContactApp />);

    fireEvent.click(getByRole('button', { name: 'Copy email' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(contact.email));
    expect(getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('falls back to execCommand when clipboard permission is denied', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;
    const { getByRole } = render(<ContactApp />);

    expect(() =>
      fireEvent.click(getByRole('button', { name: 'Copy email' })),
    ).not.toThrow();
    await waitFor(() =>
      expect(getByRole('button', { name: 'Copied!' })).toBeInTheDocument(),
    );
    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});
