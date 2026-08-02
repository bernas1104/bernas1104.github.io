import fs from 'node:fs';
import path from 'node:path';

const EXTENSION_RE =
  /\.(ts|tsx|js|jsx|mjs|cjs|json|css|png|jpe?g|gif|webp|avif|svg|ico|wasm)$/;

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function resolveWithExtension(abs) {
  const candidates = [
    `${abs}.ts`,
    `${abs}.tsx`,
    `${abs}.js`,
    `${abs}.jsx`,
    path.join(abs, 'index.ts'),
    path.join(abs, 'index.tsx'),
  ];
  return candidates.find((c) => fs.existsSync(c)) ?? null;
}

function isInside(root, abs) {
  const rel = path.relative(root, abs);
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

function toAlias(srcRoot, abs) {
  const rel = path.relative(srcRoot, abs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return abs;
  return `@/${toPosix(rel)}`;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require the @/ alias and explicit file extensions for src imports',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingAlias: 'Relative imports within src/ must use the "@/" alias.',
      missingExtension: 'Import "{{ specifier }}" is missing a file extension.',
    },
  },
  create(context) {
    const srcRoot = path.resolve(context.cwd, 'src');
    const fileDir = path.dirname(context.filename);

    function checkSource(node) {
      const specifier = node.source.value;
      if (typeof specifier !== 'string') return;

      const isRelative =
        specifier.startsWith('./') || specifier.startsWith('../');
      const isAlias = specifier.startsWith('@/');
      if (!isRelative && !isAlias) return;

      const abs = isAlias
        ? path.resolve(srcRoot, specifier.slice('@/'.length))
        : path.resolve(fileDir, specifier);

      const insideSrc = isInside(srcRoot, abs);
      const hasExtension = EXTENSION_RE.test(specifier);

      if (isRelative && insideSrc) {
        context.report({
          node,
          messageId: 'missingAlias',
          fix: (fixer) =>
            fixer.replaceText(
              node.source,
              JSON.stringify(
                toAlias(srcRoot, resolveWithExtension(abs) ?? abs),
              ),
            ),
        });
        return;
      }

      if (!hasExtension) {
        context.report({
          node,
          messageId: 'missingExtension',
          data: { specifier },
          fix: (fixer) => {
            const fixed = resolveWithExtension(abs);
            if (!fixed) return null;
            return fixer.replaceText(
              node.source,
              JSON.stringify(toAlias(srcRoot, fixed)),
            );
          },
        });
      }
    }

    return {
      ImportDeclaration: (node) => checkSource(node),
      ExportNamedDeclaration: (node) => node.source && checkSource(node),
      ExportAllDeclaration: (node) => node.source && checkSource(node),
    };
  },
};
