'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

const FileDataSource = require('./FileDataSource');
const YamlDataSource = require('./YamlDataSource');
const { fetchAllFromDirectory, fetchFromDirectory, updateInDirectory } = require('./util/directory-datasource');
const { requireDirectory } = require('./util/datasource-path');

/**
 * Data source when you have a directory of yaml files and each entity is stored in
 * its own yaml file, e.g.,
 *
 *   foo/
 *     a.yml
 *     b.yml
 *     c.yml
 *
 * Config:
 *   path: string: relative path to directory containing .yml files from project root
 *
 */
class YamlDirectoryDataSource extends FileDataSource {

  hasData(config = {}) {
    const filepath = this.resolvePath(config);
    return Promise.resolve(fs.existsSync(filepath));
  }

  async fetchAll(config = {}) {
    const dirPath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlDirectoryDataSource`);
    }

    return fetchAllFromDirectory({
      dirPath,
      extension: '.yml',
      fetch: (id) => this.fetch(config, id),
      useRealpath: false,
    });
  }

  async fetch(config = {}, id) {
    const dirPath = this.resolvePath(config);
    requireDirectory(dirPath, 'YamlDirectoryDataSource');

    return fetchFromDirectory({
      dirPath,
      id,
      extension: '.yml',
      SourceClass: YamlDataSource,
    });
  }

  async update(config = {}, id, data) {
    const dirPath = this.resolvePath(config);
    requireDirectory(dirPath, 'YamlDirectoryDataSource');

    return await updateInDirectory({
      dirPath,
      id,
      data,
      extension: '.yml',
      SourceClass: YamlDataSource,
    });
  }
}

module.exports = YamlDirectoryDataSource;
