# AGENTS.md

## Purpose

This repository is maintained with help from automated agents (Codex). This document defines non-negotiable constraints, maintenance policy, and the expected workflow so changes remain incremental, reviewable, and safe.

This repository provides the **file-backed datasource implementations** for the Rantamuta/Ranvier MUD engine, including JSON/YAML single-file, directory, and area-manifest loaders.

## Agent role and stance

Agents working in this repository must act as **senior maintainers**.

- Prioritize **decision quality** over speed.
- Prefer explicit tradeoffs and documented uncertainty over confident but fragile changes.
- Treat this repo as a compatibility boundary: small changes can have large downstream effects for consumers.
- When in doubt, stabilize and document rather than “improve”.

## High-level goals

- Keep the datasources usable on modern Node LTS.
- Support a **pure maintenance 1.0 release** after a long dormancy.
- Preserve existing read/write, parse, and error semantics.
- Prefer small, reversible changes over rewrites.

## Non-goals

- No architectural redesign of datasource behavior.
- No new datasource types or storage formats.
- No API surface changes (exports, class names, config keys) unless explicitly requested.
- No “cleanup” refactors for style or aesthetics.
- No new features beyond maintenance and compatibility fixes.

## Runtime compatibility policy

- Target runtime: **Node 22 LTS**.
- CI should run on **Node 22** during transition.
- CommonJS remains the default module system.

## Public surface and compatibility guarantees

The following are **compatibility contracts**:

- Public exports and require paths (e.g., `YamlDataSource`, `JsonDirectoryDataSource`).
- Config keys and path token rules (`path`, `[BUNDLE]`, `[AREA]`) and their resolution behavior.
- File format parsing and serialization behavior for JSON/YAML.
- Missing-file and error semantics (throw vs empty) as currently implemented.
- Synchronous I/O behavior and update semantics (full-file rewrite, per-file overwrite).

Do not change these unless explicitly authorized and tested.

## Package manager and install policy

- Use **npm**.
- CI must use `npm ci`.
- The lockfile is already at **lockfile v3** and must not be regenerated unless explicitly authorized.
- Do not change package manager or introduce alternates.

## What counts as a behavior change (compatibility-impacting)

Treat any externally observable change as a behavior change, including:

- exports or class names
- config keys, defaults, or path token resolution
- JSON/YAML parsing or serialization output
- error types or messages that callers might rely on
- missing-file handling (throw vs empty)
- sync/async behavior changes in read/update paths

Assume compatibility matters unless explicitly instructed otherwise.

## Local CI parity policy

If this repository has CI, it must maintain a **local equivalent of CI** so changes are reproducible without relying on external systems.

- `npm test` **must always pass**.
- `npm run ci:local` **must exist** and **must always pass** if CI is present
- GitHub Actions CI is the final gate, but agents must not claim CI is green unless they can directly observe it.

### CI change rule

If a PR or task changes GitHub Actions workflows or CI expectations:

- the same PR must update `ci:local` (and any underlying scripts) to mirror the change where possible
- if a CI step cannot be mirrored locally, the PR must explicitly document it as CI-only and explain why

### CI parity contract

`ci:local` must be a step-for-step mirror of `.github/workflows/ci.yml` when CI exists.

- Each CI step must appear in `ci:local` in the same order and be functionally equivalent.
- If a CI step cannot be reproduced locally, the `ci:local` script must include an inline comment that names the CI step verbatim, explains why it is skipped, and notes any local substitute.

In the `ci:local` runner, annotate each step with `// CI: <step name>`. For skipped steps use `// CI: <step name> (SKIPPED)` and include a short reason on the next line.

### `ci:local` expectations

- agents must ensure `npm run ci:local` passes locally before stopping the current task.
- `ci:local` must be a faithful representation of `.github/workflows/ci.yml`

## Required safety rails before risky changes

Before upgrading dependencies or changing runtime behavior:

- CI workflows must be syntactically valid and consistent with repo scripts.
- Deterministic installs via `npm ci` must be preserved.
- Ensure at least minimal coverage for:
- read paths for single-file and directory datasources
- update paths for single-file and directory datasources
- path token resolution (`[BUNDLE]`, `[AREA]`)

Prefer a minimal smoke test over broad refactors.

## Modernization posture

This repository is in **maintenance mode**.

Default bias:

- document > test > guard > refactor
- configuration and tooling over code changes
- clarity and compatibility over elegance

Avoid:

- performance work without evidence
- speculative refactors
- “while we are here” improvements

## Commit discipline

- One logical change per commit.
- No drive-by refactors or formatting-only commits.
- Dependency, CI, or tooling changes must be isolated to their own commits.
- Each commit should be easy to revert independently.

## Pull request / change log expectations

Every PR must include:

- What changed and why
- How it was validated (local commands, CI, smoke test)
- Risks and rollback plan if applicable

User-visible changes, dependency removals, or security-motivated actions should be summarized clearly.

## Completion / stop rule

Stop work immediately when:

- all explicitly requested tasks or checklist items are complete
- `npm test` and `npm run ci:local` pass locally
- no new correctness issues are discovered in a final pass

Do not continue with “nice-to-have” improvements beyond the stated scope.

## Escalation rule for uncertainty

If behavior is unclear:

- Add a test that captures current behavior first, or
- Document the uncertainty explicitly in the PR description.
- Do **not** guess and move on.
