# Cache inputs

All task configuration lives in `turbo.json`. File globs are relative to the
package unless prefixed with `$TURBO_ROOT$`.

| Task      | File inputs                                                                                                           | Dependency inputs                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Build     | Package files excluding specs, test setup, test tsconfig, Vitest config, and lint config; root TypeScript base config | Dependency builds and production source files             |
| Typecheck | Package files and root TypeScript base config                                                                         | All package files from direct and transitive dependencies |
| Lint      | Package files, root ESLint config, shared lint rules                                                                  | Dependency package files                                  |
| Test      | Package files, root TypeScript configs, shared test pacing helpers                                                    | Dependency production sources and test/storybook configs  |
| E2E       | Package files and root TypeScript configs                                                                             | Shop/API builds and dependency production sources         |

The checked-in `cache-version.json` file is
a global input: increment its `version` to invalidate all task caches locally
and in CI. `CI` and unit-test pacing variables affect
unit tests. `CI`, browser-test pacing variables, and `BASE_URL` affect browser
tests. Server tasks receive `HOST` and `PORT` and are not cached.

## Generated type information

Typecheck outputs include declarations and declaration maps in `dist` and
`out-tsc`, plus TypeScript incremental build metadata. They are restored on
cache hits. JavaScript files produced by application or library builds remain
owned by the build task.

Typecheck hashes include each package's files and all files in its transitive
workspace dependency closure through the recursive `dependency-inputs` task.
Gitignored files, including generated outputs, are excluded. Unrelated packages
are not included. Typechecks still wait for prerequisite typechecks (and required
builds), so their cached declarations are available before execution.

No task hashes generated dependency outputs. All hashes can be computed before
prerequisite tasks run. Tests use dependency production sources and configuration
inputs instead of generated JavaScript.

The `production-inputs`, `dependency-inputs`, and `test-config-inputs` tasks have
no package scripts. They propagate selected source/configuration hashes through
packages without executing extra commands.

## Limits

This configuration approximates the reference benchmark's resolved targets.
Turborepo additionally hashes package manifests, applicable lockfile data,
commands, and task configuration. Root TypeScript config files are hashed as
whole files rather than selecting individual JSON properties. The shared
TypeScript inputs are a superset of the language-specific inputs inferred for
each individual reference project.

Changes to any tracked file in an upstream package can invalidate a consumer's
typecheck, even when its public declarations would remain unchanged. This is a
conservative source-based workaround for output-dependent caching in CI.

## Cache storage

Local artifacts are stored in `.turbo/cache`. Vercel CI manages remote caching
automatically for the tasks tagged `ci` in `turbo.json`.

Browser tests run as five CI tasks, `e2e-1` through `e2e-5`, on separate Ubuntu
workers. Each runs a disjoint Playwright shard with one worker and writes to its
own `test-output/playwright/shard-N` cache output. The full `e2e` target remains
available locally and is not tagged for CI. Per-test pacing is unchanged.
