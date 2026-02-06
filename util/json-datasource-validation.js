'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const JsonDataSource = require('../JsonDataSource');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'json-datasource-'));
const source = new JsonDataSource({}, tempRoot);

const run = async () => {
  try {
    const missingResult = await source.fetchAll({ path: 'missing.json' });
    if (
      missingResult === null ||
      typeof missingResult !== 'object' ||
      Array.isArray(missingResult) ||
      Object.keys(missingResult).length !== 0
    ) {
      throw new Error(`Expected missing file to return empty object, got: ${JSON.stringify(missingResult)}`);
    }

    const invalidPath = path.join(tempRoot, 'invalid.json');
    fs.writeFileSync(invalidPath, '{ invalid json');

    let invalidThrown = false;
    try {
      await source.fetchAll({ path: 'invalid.json' });
    } catch (error) {
      invalidThrown = true;
      console.log(`Invalid JSON threw as expected: ${error.message}`);
    }

    if (!invalidThrown) {
      throw new Error('Expected invalid JSON to throw.');
    }

    console.log('JsonDataSource validation completed successfully.');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
