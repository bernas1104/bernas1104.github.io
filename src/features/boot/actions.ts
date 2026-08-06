export type BootAction = { type: 'SKIP' } | { type: 'TIMEOUT' };

export function skipBoot(): BootAction {
  return { type: 'SKIP' };
}

export function timeoutBoot(): BootAction {
  return { type: 'TIMEOUT' };
}
