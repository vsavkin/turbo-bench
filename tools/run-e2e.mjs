import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwright = require.resolve('@playwright/test/cli');

function run(args) {
  const result = spawnSync(process.execPath, [playwright, ...args], {
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Install in the Ubuntu task itself: browsers and OS packages installed in the
// separate bootstrap container would not all survive into this task's image.
if (process.env.CI && process.platform === 'linux') {
  run(['install', '--with-deps', 'chromium']);
}

// Each invocation uses one worker; CI shard arguments select its test subset.
// Playwright's webServer configuration owns server startup and teardown.
run(['test', ...process.argv.slice(2)]);
