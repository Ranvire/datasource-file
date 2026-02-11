# Rantamuta datasource-file

File-backed datasources for the Rantamuta MUD engine (a fork of RanvierMUD), providing JSON and YAML loaders for single-file, per-entity directory, and area-manifest storage layouts. Includes path token resolution for `[BUNDLE]` and `[AREA]`, and is designed to be used as a drop-in datasource module without altering Rantamuta’s public API surface.

Supported Node.js: 22 LTS.

## DataSources

* **YamlDataSource**: For use with all entities stored in one .yml file
  * Base Config: none
  * Entity Config: `{ path: string: path to .yml file from project root }`
* **YamlDirectoryDataSource**: For use with a directory containing a .yml file for each entity
  * Base Config: none
  * Config: `{ path: string: path to directory containing .yml files from project root }`
* **YamlAreaDataSource**: For use with areas stored in yml (with a manifest.yml file)
  * Base Config: none
  * Config: `{ path: string: path to directory containing area folders }`
* **JsonDataSource**: For use with all entities stored in one .json file
  * Base Config: none
  * Entity Config: `{ path: string: path to .json file from project root }`
* **JsonDirectoryDataSource**: For use with a directory containing a .json file for each entity
  * Base Config: none
  * Entity Config: `{ path: string: path to .yml file from project root }`
  * Config: `{ path: string: absolute path to directory containing .json files}`

### Registration in ranvier.json

```js
{
  // ...
  "dataSources": {
    "Yaml": { "require": "ranvier-datasource-file.YamlDataSource" },
    "YamlArea": { "require": "ranvier-datasource-file.YamlAreaDataSource" },
    "YamlDirectory": { "require": "ranvier-datasource-file.YamlDirectoryDataSource" },
    "Json": { "require": "ranvier-datasource-file.JsonDataSource" },
    "JsonDirectory": { "require": "ranvier-datasource-file.JsonDirectoryDataSource" },
  },

  "entitySources": {
    "areas": {
      "source": "YamlArea",
      "config": {
        /* the [BUNDLE] and [AREA] tokens will be replaced with the value passed to
        entityLoader.setBundle and setArea respectively */
        "path": "bundles/[BUNDLE]/areas"
      }
    },
    "items": {
      "source": "Yaml",
      "config": {
        "path": "bundles/[BUNDLE]/areas/[AREA]/items.yml"
      }
    },

    "accounts": {
      "source": "JsonDirectory",
      "config": {
        "path": "data/accounts"
      }
    }
  }
}
```

## Rantamuta 1.0 Maintenance Checklist

The Rantamuta 1.0 release is intended to be a **pure maintenance upgrade** for `ranvier-datasource-file`: modernize runtime/tooling and tighten documentation and safeguards without redesigning the datasource architecture or changing the public API surface.

### Runtime & Tooling

* [x] Declare supported Node.js versions in `package.json` (`engines`) and document them in the README.
* [x] Maintain a lockfile for deterministic installs (`package-lock.json` exists).
* [x] Add standard npm scripts (e.g., `test`) even if initially minimal.
* [x] Add CI (GitHub Actions) to run tests/lint on push/PR.
* [x] Remove any language in documents, config files or code implying that this is an npm package (e.g. `npm pack`)

### Packaging & Exports

* [x] Keep CommonJS entrypoint (`main: index.js`) aligned with the actual module format.
* [ ] Confirm README examples use the current config keys (align `entitySources` vs `entityLoaders` if needed by this repo’s docs).

### Dependencies

* [ ] Review `js-yaml` version for security/deprecation and upgrade within semver-safe bounds if possible.
* [ ] Add `npm audit` (or equivalent) to CI and record results as artifacts.
* [ ] Document dependency update policy (e.g., maintenance-only, security-first).

### Quality Gates

* [ ] Add a minimal test runner and baseline unit tests for each datasource (read, update, missing-file behavior).
* [ ] Add linting (ESLint or similar) with a minimal ruleset.
* [ ] Add formatting (Prettier or similar) and autoformat scripts.

### Documentation

* [ ] Expand README to document synchronous I/O behavior and error semantics for each datasource.
* [ ] Document `FileDataSource.resolvePath` token rules (`[BUNDLE]`/`[AREA]`) and error messages.
* [ ] Add a short “compatibility” section (Node version, CJS usage, how to import).

### Minimal Improvements Checklist

### DX & Maintainability

* [ ] Add small helper utilities for repeated path validation and error formatting across datasources.
* [ ] Reduce duplication between YAML/JSON directory datasources (shared base or helper functions).
* [ ] Add JSDoc annotations for method inputs/outputs on each datasource class.
* [ ] Add example config snippets in README for each datasource type.

### Performance Footguns

* [ ] Document that `update` rewrites full files (single-file datasources) and per-file overwrite behavior (directory datasources).
* [ ] Note that read paths are synchronous and may block the event loop under heavy use.
* [ ] Add small tests to lock in read/update behavior for large files and nested directories.

YAML and JSON DataSources for the Ranvier game engine

## Deferred tasks

This is a set of proposed tasks that may or may not be completed in future.

* Make `hasData` checks consistent and awaited in `fetchAll` to avoid false positives in path validation.
* Normalize missing-file behavior between YAML and JSON datasources (either both throw or both return empty).
* Include resolved paths in thrown errors consistently across datasources.
* Handle `fs.readdir` errors explicitly in directory datasources (reject the promise with the error).
* Consider BOM handling for YAML to match JSON’s BOM-stripping behavior.
