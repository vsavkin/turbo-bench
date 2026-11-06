# Cache inputs

All task configuration lives in `turbo.json`. File globs are relative to the
package unless prefixed with `$TURBO_ROOT$`.

| Task      | File inputs                                                                                                              | Dependency inputs                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Build     | Package files excluding specs, test setup, test tsconfig, Vitest config, and lint config; root TypeScript base config    | Dependency builds and production source files                                               |
| Typecheck | Package manifest, TypeScript configs, source and test files, Vite/Vitest/Playwright configs; root TypeScript base config | Declaration files and TypeScript build metadata from direct and transitive typechecks       |
| Lint      | Package files, root ESLint config, shared lint rules                                                                     | Dependency package files                                                                    |
| Test      | Package files, root TypeScript configs, shared test pacing helpers                                                       | Dependency production sources, test/storybook configs, and generated JavaScript from builds |
| E2E       | Package files and root TypeScript configs                                                                                | Shop/API builds and dependency production sources                                           |

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

Structured `dependencyOutputs` inputs hash declarations and `.tsbuildinfo`
files after the producer tasks complete. Declaration maps are cached but do
not contribute to consumers' output-based type inputs.

The `typecheck-inputs` task has no package script. It fingerprints its own
package's completed typecheck outputs and recursively includes dependencies'
`typecheck-inputs` hashes. Consumers depend on these fingerprints as well as
direct typechecks, so a transitive declaration or build-metadata change reaches
every consumer, even when an intermediate package's declarations stay the same.

The `production-inputs`, `dependency-inputs`, and `test-config-inputs` tasks are
also graph-only tasks. They propagate selected source/configuration hashes
through packages that have no build script, without executing extra commands.

## Limits

This configuration approximates the reference benchmark's resolved targets.
Turborepo additionally hashes package manifests, applicable lockfile data,
commands, and task configuration. Root TypeScript config files are hashed as
whole files rather than selecting individual JSON properties. The shared
TypeScript inputs are a superset of the language-specific inputs inferred for
each individual reference project.

Incremental build metadata contains source fingerprints, so some implementation
or spec edits can invalidate consumers even if public declarations stay the same.
Adding output-based inputs does not guarantee declaration-only invalidation.

## Cache storage

Local artifacts are stored in `.turbo/cache`. Vercel CI manages remote caching
automatically for the tasks tagged `ci` in `turbo.json`.

Browser tests run in one `@org/shop-e2e#e2e` task on Ubuntu. The task installs its
own Chromium dependencies, starts the local servers, and runs all specs with a
single worker. Its default pacing is unchanged.
