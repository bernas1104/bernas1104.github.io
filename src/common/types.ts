export type Brand<T, B> = T & { readonly __brand: B };

export type Position = { readonly x: number; readonly y: number };

export type Size = { readonly width: number; readonly height: number };

export type IconName = 'about' | 'cv' | 'projects' | 'contact' | 'terminal' | 'github' | 'linkedin'
  | 'email' | 'download' | 'close' | 'maximize' | 'minimize' | 'restore' | 'folder' | 'file'
  | 'trash' | 'settings';
