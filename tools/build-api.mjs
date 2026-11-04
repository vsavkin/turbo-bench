import { build } from 'esbuild';
import { cp, mkdir } from 'node:fs/promises';
await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/main.js',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  tsconfig: 'tsconfig.app.json',
});
await mkdir('dist/assets', { recursive: true });
await cp('src/assets', 'dist/assets', { recursive: true }).catch((e) => {
  if (e.code !== 'ENOENT') throw e;
});
