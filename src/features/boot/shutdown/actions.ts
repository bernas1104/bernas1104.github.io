export type ShutdownAction =
  { type: 'BEGIN_SHUTDOWN' } | { type: 'FINISH_SHUTDOWN' };

export function beginShutdown(): ShutdownAction {
  return { type: 'BEGIN_SHUTDOWN' };
}

export function finishShutdown(): ShutdownAction {
  return { type: 'FINISH_SHUTDOWN' };
}
