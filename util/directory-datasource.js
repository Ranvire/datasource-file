'use strict';

const fs = require('fs');
const path = require('path');

function fetchAllFromDirectory({ dirPath, extension, fetch, useRealpath }) {
  return new Promise((resolve, reject) => {
    const data = {};
    const scanPath = useRealpath ? fs.realpathSync(dirPath) : dirPath;

    fs.readdir(scanPath, async (err, files) => {
      for (const file of files) {
        if (path.extname(file) !== extension) {
          continue;
        }

        const id = path.basename(file, extension);
        data[id] = await fetch(id);
      }

      resolve(data);
    });
  });
}

function fetchFromDirectory({ dirPath, id, extension, SourceClass }) {
  const source = new SourceClass({}, dirPath);
  return source.fetchAll({ path: `${id}${extension}` });
}

async function updateInDirectory({ dirPath, id, data, extension, SourceClass }) {
  const source = new SourceClass({}, dirPath);
  return await source.replace({ path: `${id}${extension}` }, data);
}

module.exports = {
  fetchAllFromDirectory,
  fetchFromDirectory,
  updateInDirectory,
};
