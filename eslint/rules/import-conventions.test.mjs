import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import importConventions from './import-conventions.mjs';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2023,
    sourceType: 'module',
  },
});

ruleTester.run('import-conventions', importConventions, {
  valid: [
    {
      name: 'package imports are ignored',
      filename: 'src/main.tsx',
      code: `import { useState } from 'react';`,
    },
    {
      name: 'alias import with extension passes',
      filename: 'src/main.tsx',
      code: `import App from '@/App.tsx';`,
    },
    {
      name: 'type-only alias import with extension passes',
      filename: 'src/features/desktop/types.ts',
      code: `import type { Position } from '@/common/types.ts';`,
    },
    {
      name: 'export from alias barrel passes',
      filename: 'src/features/desktop/windowManager/index.ts',
      code: `export { WindowManagerProvider } from '@/features/desktop/windowManager/WindowManagerProvider.tsx';`,
    },
  ],
  invalid: [
    {
      name: 'relative import inside src is flagged and fixed to alias',
      filename: 'src/features/desktop/components/Desktop.tsx',
      code: `import type { AppId } from '../types';`,
      output: `import type { AppId } from '@/features/desktop/types.ts';`,
      errors: [{ messageId: 'missingAlias' }],
    },
    {
      name: 'alias import without extension is flagged and fixed',
      filename: 'src/common/types.test.ts',
      code: `import type { Position } from '@/common/types';`,
      output: `import type { Position } from '@/common/types.ts';`,
      errors: [{ messageId: 'missingExtension' }],
    },
    {
      name: 'export from relative barrel is flagged and fixed to alias',
      filename: 'src/features/desktop/windowManager/index.ts',
      code: `export { initialWindowsState } from './reducer.ts';`,
      output: `export { initialWindowsState } from '@/features/desktop/windowManager/reducer.ts';`,
      errors: [{ messageId: 'missingAlias' }],
    },
    {
      name: 'extensionless relative import outside src keeps a relative specifier',
      filename: 'src/main.tsx',
      code: `import { value } from '../fixtures/shared/value';`,
      output: `import { value } from '../fixtures/shared/value.ts';`,
      errors: [{ messageId: 'missingExtension' }],
    },
  ],
});
