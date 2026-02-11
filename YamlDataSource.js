'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

const FileDataSource = require('./FileDataSource');

/**
 * Data source when you have all entities in a single yaml file
 *
 * Config:
 *   path: string: relative path to .yml file from project root
 */
class YamlDataSource extends FileDataSource {

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
    const filepath = this.resolvePath(config);

    if (!this.hasData(config)) {
      throw new Error(`Invalid path [${filepath}] for YamlDataSource`);
    }


    return new Promise((resolve, reject) => {
      const contents = fs.readFileSync(fs.realpathSync(filepath)).toString('utf8');

      resolve(yaml.load(contents));
    });
  }


  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @param {string} id
   * @returns {Promise<*>}
   */
  async fetch(config = {}, id) {
    const data = await this.fetchAll(config);

    if (!data.hasOwnProperty(id)) {
      throw new ReferenceError(`Record with id [${id}] not found.`);
    }

    return data[id];
  }

  /**
   * @param {object} config
   * @param {string} config.path
   * @param {string} [config.bundle]
   * @param {string} [config.area]
   * @param {*} data
   * @returns {Promise<void>}
   */
  replace(config = {}, data) {
    const filepath = this.resolvePath(config);
    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, yaml.dump(data), err => {
        if (err) {
          return reject(err);
        }

        resolve();
      })
    })
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
    const currentData = await this.fetchAll(config);

    if (Array.isArray(currentData)) {
      throw new TypeError('Yaml data stored as array, cannot update by id');
    }

    currentData[id] = data;

    return this.replace(config, currentData);
  }
}

module.exports = YamlDataSource;
