import { describe, expect, it } from 'vitest';
import {
  BOOT_MIN_DURATION_MS,
  BOOT_PLAYED_SESSION_KEY,
} from '@/features/boot/config.ts';

describe('boot config', () => {
  it('sets the minimum boot duration to 2500ms', () => {
    expect(BOOT_MIN_DURATION_MS).toBe(2500);
  });

  it('sets the session persistence key', () => {
    expect(BOOT_PLAYED_SESSION_KEY).toBe('bernasos:bootPlayed');
  });
});
