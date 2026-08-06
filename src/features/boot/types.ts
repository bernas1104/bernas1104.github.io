export type BootStatus = 'booting' | 'dismissed';

export type BootState = {
  readonly status: BootStatus;
};

export type BootEnvironment = {
  readonly isDevelopment: boolean;
  readonly isTest: boolean;
};

export type BootSequenceConfig = {
  readonly minDurationMs: number;
  readonly environment: BootEnvironment;
};
