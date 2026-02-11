# Changelog

This changelog records user-visible, compatibility, and maintenance changes for this repo and is governed by docs/CHANGELOG_POLICY.md.

## Unreleased

### JsonDataSource missing-file behavior (deferred)

- Summary:
  - Keep `JsonDataSource.fetchAll` throwing on missing files; defer the empty-object behavior change.
- Why:
  - Avoid a behavior change in the 1.0 stabilization release.
- Impact:
  - No runtime behavior change relative to current behavior; missing files still throw.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 13:18

### CI parity adjustments

- Summary:
  - Mirror CI checkout/setup-node steps in `ci:local` and install dev dependencies with `npm ci --include=dev`.
- Why:
  - Keep local CI parity with GitHub Actions and enforce Node 22 expectations.
- Impact:
  - CI/local tooling only; no runtime behavior changes.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 12:58

### Package name (no rename)

- Summary:
  - Keep the package name `ranvier-datasource-file` for the 1.0 release.
- Why:
  - Avoid a breaking rename and preserve compatibility for downstream consumers.
- Impact:
  - No runtime behavior changes; naming remains stable.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 12:52

### Prettier formatting

- Summary:
  - Add Prettier with `format` and `format:check` scripts.
- Why:
  - Provide a consistent autoformatting tool for maintenance work.
- Impact:
  - Tooling only; no runtime behavior changes.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 11:47

### ESLint linting

- Summary:
  - Add ESLint with a minimal ruleset and enable `npm run lint`.
- Why:
  - Establish a baseline linting gate for maintenance work.
- Impact:
  - Tooling only; no runtime behavior changes.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 11:44

### npm audit CI artifacts

- Summary:
  - Add an `npm audit` step to CI and upload the JSON report as an artifact.
- Why:
  - Record security scan results during CI runs.
- Impact:
  - CI only; may fail builds on high-severity vulnerabilities.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 11:37

### js-yaml 3.14.2

- Summary:
  - Upgrade `js-yaml` to 3.14.2.
- Why:
  - Address the prototype pollution advisory fixed in 3.14.2.
- Impact:
  - Dependency update only; no runtime behavior changes expected.
- Migration/Action:
  - None.
- References:
  - GHSA-p8p7-x288-28g6.
- Timestamp:
  - 2026.02.11 11:35

### GitHub Actions CI

- Summary:
  - Add GitHub Actions CI to run `npm ci`, `npm test`, and `npm run lint` on push and pull request.
- Why:
  - Ensure automated verification for modernization changes.
- Impact:
  - No runtime behavior changes; adds CI checks for contributors.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 11:32

### Node.js 22 LTS

- Summary:
  - Declare Node.js 22 LTS support in `package.json` and README.
- Why:
  - Make the supported runtime explicit for modernization and tooling.
- Impact:
  - No runtime behavior changes; npm may warn on unsupported Node versions.
- Migration/Action:
  - Use Node.js 22 LTS.
- References:
  - None.
- Timestamp:
  - 2026.02.11 10:37

### Node:test

- Summary:
  - Adopt `node:test` as the test runner for this repo.
- Why:
  - Zero dependencies, fastest to adopt, ideal for a pure maintenance posture, and works well on Node 22.
- Impact:
  - No runtime behavior changes; affects test tooling only.
- Migration/Action:
  - None.
- References:
  - None.
- Timestamp:
  - 2026.02.11 10:29
