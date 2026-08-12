export type ShutdownStatus = 'idle' | 'shuttingDown' | 'off';

export type ShutdownState = { readonly status: ShutdownStatus };
