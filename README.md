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

Vercel CI runs the entire browser suite as one `@org/shop-e2e#e2e` task on
Ubuntu. It installs Chromium and its system dependencies inside that task,
then Playwright starts and stops the local API and shop servers. The 100 tests
remain sequential with their existing pacing (roughly 45 minutes for a full
uncached run).
