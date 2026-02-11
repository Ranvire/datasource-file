'use strict';

const fs = require('fs');

const FileDataSource = require('./FileDataSource');
const JsonDataSource = require('./JsonDataSource');
const { fetchAllFromDirectory, fetchFromDirectory, updateInDirectory } = require('./util/directory-datasource');
const { requireDirectory } = require('./util/datasource-path');


/**
 * Data source when you have a directory of json files and each entity is stored in
 * its own json file, e.g.,
 *
 *   foo/
 *     a.json
 *     b.json
 *     c.json
 *
 * Config:
 *   path: string: relative path to directory containing .json files from project root
 *
 * @extends DataSource
 */
class JsonDirectoryDataSource extends FileDataSource {

  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @returns {Promise<boolean>}
   */
  hasData(config = {}) {
    const filepath = this.resolvePath(config);
    return Promise.resolve(fs.existsSync(filepath));
  }

  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @returns {Promise<object>}
   */
  fetchAll(config = {}) {
    const dirPath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${dirPath}] specified for JsonDirectoryDataSource`);
    }

    return fetchAllFromDirectory({
      dirPath,
      extension: '.json',
      fetch: (id) => this.fetch(config, id),
      useRealpath: true,
    });
  }

  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @param {string} id
   * @returns {Promise<object>}
   */
  fetch(config = {}, id) {
    const dirPath = this.resolvePath(config);
    requireDirectory(dirPath, 'JsonDirectoryDataSource');

    return fetchFromDirectory({
      dirPath,
      id,
      extension: '.json',
      SourceClass: JsonDataSource,
    });
  }

  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @param {string} id
   * @param {*} data
   * @returns {Promise<void>}
   */
  async update(config = {}, id, data) {
    const dirPath = this.resolvePath(config);
    requireDirectory(dirPath, 'JsonDirectoryDataSource');
    return await updateInDirectory({
      dirPath,
      id,
      data,
      extension: '.json',
      SourceClass: JsonDataSource,
    });
  }
}

module.exports = JsonDirectoryDataSource;
