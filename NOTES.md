## JsonDataSource missing-file handling

`JsonDataSource.fetchAll` now treats a missing JSON file as an empty result instead of throwing a stack trace. This is a bug fix so missing data behaves like “not found,” while invalid JSON still throws to surface real data corruption. 
