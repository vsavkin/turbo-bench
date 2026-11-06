# Turborepo benchmark

An npm workspace with 510 packages for benchmarking on Vercel CI.

Use Node.js 24 and `npm ci`. Run `npm run build`, `npm run typecheck`,
`npm run lint`, `npm test`, or `npm run e2e`. Run one package with
`npm exec turbo run test -- --filter=@org/shop-feature-cart-list`.
`npm run dev` starts the shop and API together.

Unit specs retain 5 CPU seconds plus 7.3 seconds of waiting across 10 rounds.
Browser tests retain 25 seconds of waiting plus 2 CPU seconds across 10 rounds,
with one worker and no file parallelism. Machine speed and scheduler overhead
still affect elapsed times. CI uses concurrency 4, or 1 for e2e.

For quick correctness checks, set `UNIT_TEST_CPU_SECONDS=0 UNIT_TEST_SLEEP_MS=0`
and `E2E_TEST_DURATION_MS=0 E2E_TEST_CPU_SECONDS=0`. Defaults remain unchanged.
Pacing variables participate in their test task hashes. Use `--force`
for uncached timing measurements. Caches are local unless Turborepo remote cache
credentials are configured; CI does not require a remote-cache account.

Install Chromium with `npm exec playwright install -- chromium` before e2e.
`npm run validate` preserves the two-minute simulated validation workload.

See [cache inputs and dependency output hashing](docs/caching.md) for the complete configuration.

Vercel CI runs the browser suite as five targets, `e2e-1` through `e2e-5`,
using Playwright sharding. Each runs 20 tests sequentially on its own Ubuntu
worker, installs Chromium and its system dependencies, and starts/stops its own
API and shop servers. Existing per-test pacing is unchanged; each shard needs
roughly 9 minutes plus setup, below the observed 15-minute task deadline.

`npm run e2e` still runs the complete suite locally. Run one shard with
`npm exec turbo run e2e-1 -- --filter=@org/shop-e2e`.
