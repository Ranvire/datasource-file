'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const FileDataSource = require('./FileDataSource');
const YamlDataSource = require('./YamlDataSource');
const { requireDirectory } = require('./util/datasource-path');

/**
 * Data source for areas stored in yml. Looks for a directory structure like:
 *
 *   path/
 *     area-one/
 *       manifest.yml
 *     area-two/
 *       manifest.yml
 *
 * Config:
 *   path: string: relative path to directory containing area folders
 *
 */
class YamlAreaDataSource extends FileDataSource {
  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @returns {boolean}
   */
  hasData(config = {}) {
    const dirPath = this.resolvePath(config);
    return fs.existsSync(dirPath);
  }

  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @returns {Promise<object>}
   */
  async fetchAll(config = {}) {
    const dirPath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${dirPath}] specified for YamlAreaDataSource`);
    }

    return new Promise((resolve, reject) => {
      const data = {};

      fs.readdir(fs.realpathSync(dirPath), { withFileTypes: true }, async (err, files) => {
        for (const file of files) {
          if (!file.isDirectory()) {
            continue;
          }

          const manifestPath = [dirPath, file.name, 'manifest.yml'].join('/');
          if (!fs.existsSync(manifestPath)) {
            continue;
          }

          data[file.name] = await this.fetch(config, file.name);
        }

        resolve(data);
      });
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
  async fetch(config = {}, id) {
    const dirPath = this.resolvePath(config);
    requireDirectory(dirPath, 'YamlAreaDataSource');

    const source = new YamlDataSource({}, dirPath);

    return source.fetchAll({ path: `${id}/manifest.yml` });
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
    requireDirectory(dirPath, 'YamlAreaDataSource');

    const source = new YamlDataSource({}, dirPath);

    return await source.replace({ path: `${id}/manifest.yml` }, data);
  }
}

module.exports = YamlAreaDataSource;
