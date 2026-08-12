import type { ShutdownState } from '@/features/boot/shutdown/types.ts';
import type { ShutdownAction } from '@/features/boot/shutdown/actions.ts';

export const initialShutdownState: ShutdownState = { status: 'idle' };

export function shutdownReducer(
  state: ShutdownState,
  action: ShutdownAction,
): ShutdownState {
  switch (action.type) {
    case 'BEGIN_SHUTDOWN':
      if (state.status !== 'idle') return state;
      return { status: 'shuttingDown' };
    case 'FINISH_SHUTDOWN':
      if (state.status !== 'shuttingDown') return state;
      return { status: 'off' };
    default:
      action satisfies never;
      return state;
  }
}
