## JsonDataSource missing-file handling

The previously proposed change to treat a missing JSON file as an empty result has been deferred for the 1.0 release. `JsonDataSource.fetchAll` continues to throw when the file is missing to avoid a behavior change. See `CHANGELOG.md` for the recorded decision.
