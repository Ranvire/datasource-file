# Changelog Policy (Maintenance Releases)

This repository is a maintenance and stewardship fork focused on the datasource-file package. The changelog exists to document:

- user-visible changes,
- dependency and security actions,
- runtime/CI changes, and
- deliberate drifts or modernizations relative to the original RanvierMUD behavior or dependencies.

The policy below is intentionally lightweight. It should be followed by maintainers, downstream game repos, and automated agents working on these datasources.

## Canonical locations

- **Policy:** `docs/CHANGELOG_POLICY.md` (this document).
- **Entries:** `CHANGELOG.md` at the repo root.

## When to add an entry

Add or update a changelog entry when a change is:

- user-visible (behavior changes, error handling, logging, diagnostics),
- dependency or security related (upgrades, removals, vulnerability responses),
- runtime/CI related (Node version support, build tooling, CI matrices),
- compatibility-impacting (even if intended to be backward compatible),
- a deliberate drift or modernization from prior datasource-file behavior or dependencies.
- a change to datasource exports or require paths.
- a change to config keys or path token resolution (`[BUNDLE]`, `[AREA]`).
- a change to JSON/YAML parsing or serialization behavior.
- a change to missing-file or error semantics (throw vs empty, error messages).

## Required entry fields (per release or grouped change set)

Each changelog entry must include:

- **Summary:** short description of what changed.
- **Why:** motivation or rationale (especially for drifts/modernizations).
- **Impact:** who is affected and how (compatibility or operational impact).
- **Migration/Action:** required steps for downstream users, or “None.”
- **References:** relevant issues/PRs or commit identifiers if applicable.
- **Timestamp:** the *current* UTC date and time in the format YYYY.MM.DD hh:mm

## Drift/modernization documentation

When documenting drift or modernization, be explicit about:

- the original datasource behavior or dependency,
- the current behavior or replacement,
- why the change was made,
- any operational or compatibility implications.

## Format (recommended)

### Entry titles

Use specific change titles for entry headings (e.g., `Node.js 22 LTS`, `Node:test`) rather than broad category labels like “Tooling” or “Runtime / Compatibility.”

Use a simple, consistent structure in `CHANGELOG.md`:

```md
## Unreleased

### Change Title
- Summary:
  - ...
- Why:
  - ...
- Impact:
  - ...
- Migration/Action:
  - ...
- References:
  - ...
- Timestamp: 
  - ...
```

If a category has no changes, omit it. Keep entries short and scannable.

Ordering: insert the latest change immediately under `## Unreleased`, keeping entries in reverse chronological order (newest to oldest).
