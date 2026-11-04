# Working in this repository

- Use Node.js 24 and npm. Install dependencies with `npm ci`.
- Run workspace tasks through Turborepo: `npm exec turbo run <task>`.
- Main tasks are `build`, `typecheck`, `lint`, `test`, and `e2e`.
- Select a package with `--filter`, for example:
  `npm exec turbo run test -- --filter=@org/shop-feature-cart-list`.
- Use `npm run dev` to start the shop and API together.
- Keep package scripts explicit and task dependencies and cache outputs in `turbo.json`.
- Preserve benchmark pacing defaults in `tools/test-delay` and the browser test pacing helper.
- CI uses concurrency 4 for build, typecheck, lint, and unit tests, and concurrency 1 for browser tests.
- Use `npm run format:check` to check formatting.
- Check `--help` or official documentation before using unfamiliar CLI flags.
