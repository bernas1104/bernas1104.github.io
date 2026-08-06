export type {
  BootState,
  BootEnvironment,
  BootSequenceConfig,
  BootStatus,
} from '@/features/boot/types.ts';
export type { BootAction } from '@/features/boot/actions.ts';
export { skipBoot, timeoutBoot } from '@/features/boot/actions.ts';
export {
  bootReducer,
  initialBootState,
  createInitialBootState,
} from '@/features/boot/reducer.ts';
export {
  BOOT_MIN_DURATION_MS,
  BOOT_PLAYED_SESSION_KEY,
} from '@/features/boot/config.ts';
export {
  useBootSequence,
  shouldPlayBootSequence,
  type BootSequenceHandlers,
} from '@/features/boot/useBootSequence.ts';
export { usePrefersReducedMotion } from '@/features/boot/usePrefersReducedMotion.ts';
export {
  BootScreen,
  type BootScreenProps,
} from '@/features/boot/BootScreen.tsx';
