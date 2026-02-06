'use strict';

const fs = require('fs');

const FileDataSource = require('./FileDataSource');

/**
 * Data source when you have all entities in a single json file
 *
 * Config:
 *   path: string: relative path to .json file from project root
 */
class JsonDataSource extends FileDataSource {

  hasData(config = {}) {
    const filepath = this.resolvePath(config);
    return Promise.resolve(fs.existsSync(filepath));
  }

  fetchAll(config = {}) {
    const filepath = this.resolvePath(config);

    if (!fs.existsSync(filepath)) {
      return Promise.resolve({});
    }

    const contents = fs.readFileSync(fs.realpathSync(filepath)).toString('utf8');
    const normalizedContents = contents.replace(/^\uFEFF/, '');

    return Promise.resolve(JSON.parse(normalizedContents));
  }


  async fetch(config = {}, id) {
    const data = await this.fetchAll(config);

    if (!data.hasOwnProperty(id)) {
      throw new ReferenceError(`Record with id [${id}] not found.`);
    }

    return data[id];
  }

  replace(config = {}, data) {
    const filepath = this.resolvePath(config);

    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, JSON.stringify(data, null, 2), err => {
        if (err) {
          return reject(err);
        }

        resolve();
      })
    })
  }

  async update(config = {}, id, data) {
    const currentData = await this.fetchAll(config);


    if (Array.isArray(currentData)) {
      throw new TypeError('Yaml data stored as array, cannot update by id');
    }

    currentData[id] = data;

    return this.replace(config, currentData);
  }
}

module.exports = JsonDataSource;
