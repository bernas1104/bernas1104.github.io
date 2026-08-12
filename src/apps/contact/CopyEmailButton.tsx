import { useEffect, useRef, useState } from 'react';

type CopyEmailButtonProps = {
  email: string;
};

function fallbackCopy(text: string) {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    input.remove();
  }
}

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        didCopy = true;
      } else {
        didCopy = fallbackCopy(email);
      }
    } catch {
      didCopy = fallbackCopy(email);
    }

    if (!didCopy) return;

    setCopied(true);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={() => void handleCopy()}>
      {copied ? 'Copied!' : 'Copy email'}
    </button>
  );
}
