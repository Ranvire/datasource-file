# Changelog

This changelog records user-visible, compatibility, and maintenance changes for this repo and is governed by docs/CHANGELOG_POLICY.md.

## Unreleased

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
