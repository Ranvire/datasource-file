'use strict';

const fs = require('fs');

function requireDirectory(dirPath, sourceName) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Invalid path [${dirPath}] specified for ${sourceName}`);
  }
}

module.exports = {
  requireDirectory,
};
