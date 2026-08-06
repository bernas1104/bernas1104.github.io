import type { BootState } from '@/features/boot/types.ts';
import type { BootAction } from '@/features/boot/actions.ts';

export const initialBootState: BootState = {
  status: 'booting',
};

export function bootReducer(state: BootState, action: BootAction): BootState {
  switch (action.type) {
    case 'SKIP':
    case 'TIMEOUT':
      if (state.status === 'dismissed') return state;
      return { ...state, status: 'dismissed' };
    default:
      action satisfies never;
      return state;
  }
}

export function createInitialBootState(shouldPlay: () => boolean): BootState {
  return {
    status: shouldPlay() ? 'booting' : 'dismissed',
  };
}
