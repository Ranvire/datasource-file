'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const yaml = require('js-yaml');

const JsonDataSource = require('../JsonDataSource');
const JsonDirectoryDataSource = require('../JsonDirectoryDataSource');
const YamlDataSource = require('../YamlDataSource');
const YamlDirectoryDataSource = require('../YamlDirectoryDataSource');
const YamlAreaDataSource = require('../YamlAreaDataSource');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'datasource-file-'));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function writeYaml(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, yaml.dump(data));
}

function makeLargeObject(entryCount) {
  const data = {};
  for (let i = 0; i < entryCount; i += 1) {
    data[`id${i}`] = {
      value: 'x'.repeat(100),
    };
  }
  return data;
}

test('JsonDataSource reads and updates JSON files', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  writeJson(path.join(root, 'entities.json'), { a: { name: 'alpha' } });

  const source = new JsonDataSource({}, root);
  const data = await source.fetchAll({ path: 'entities.json' });
  assert.deepStrictEqual(data, { a: { name: 'alpha' } });

  await source.update({ path: 'entities.json' }, 'b', { name: 'beta' });
  const updated = JSON.parse(fs.readFileSync(path.join(root, 'entities.json'), 'utf8'));
  assert.deepStrictEqual(updated, { a: { name: 'alpha' }, b: { name: 'beta' } });
});

test('JsonDataSource throws when the file is missing', (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const source = new JsonDataSource({}, root);
  assert.throws(
    () => source.fetchAll({ path: 'missing.json' }),
    /Cannot find module/,
  );
});

test('YamlDataSource reads and updates YAML files', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  writeYaml(path.join(root, 'entities.yml'), { a: { name: 'alpha' } });

  const source = new YamlDataSource({}, root);
  const data = await source.fetchAll({ path: 'entities.yml' });
  assert.deepStrictEqual(data, { a: { name: 'alpha' } });

  await source.update({ path: 'entities.yml' }, 'b', { name: 'beta' });
  const updated = yaml.load(fs.readFileSync(path.join(root, 'entities.yml'), 'utf8'));
  assert.deepStrictEqual(updated, { a: { name: 'alpha' }, b: { name: 'beta' } });
});

test('YamlDataSource rejects when the file is missing', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const source = new YamlDataSource({}, root);
  await assert.rejects(
    () => source.fetchAll({ path: 'missing.yml' }),
    (err) => err && err.code === 'ENOENT'
  );
});

test('JsonDirectoryDataSource reads and updates JSON directory entries', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const dirPath = path.join(root, 'jsondir');
  writeJson(path.join(dirPath, 'a.json'), { name: 'alpha' });
  writeJson(path.join(dirPath, 'b.json'), { name: 'beta' });

  const source = new JsonDirectoryDataSource({}, root);
  const data = await source.fetchAll({ path: 'jsondir' });
  assert.deepStrictEqual(data, {
    a: { name: 'alpha' },
    b: { name: 'beta' },
  });

  await source.update({ path: 'jsondir' }, 'c', { name: 'charlie' });
  const updated = JSON.parse(fs.readFileSync(path.join(dirPath, 'c.json'), 'utf8'));
  assert.deepStrictEqual(updated, { name: 'charlie' });
});

test('JsonDirectoryDataSource throws when directory is missing', (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const source = new JsonDirectoryDataSource({}, root);
  assert.throws(
    () => source.fetch({ path: 'missing' }, 'a'),
    /Invalid path/,
  );
});

test('YamlDirectoryDataSource reads and updates YAML directory entries', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const dirPath = path.join(root, 'yamldir');
  writeYaml(path.join(dirPath, 'a.yml'), { name: 'alpha' });
  writeYaml(path.join(dirPath, 'b.yml'), { name: 'beta' });

  const source = new YamlDirectoryDataSource({}, root);
  const data = await source.fetchAll({ path: 'yamldir' });
  assert.deepStrictEqual(data, {
    a: { name: 'alpha' },
    b: { name: 'beta' },
  });

  await source.update({ path: 'yamldir' }, 'c', { name: 'charlie' });
  const updated = yaml.load(fs.readFileSync(path.join(dirPath, 'c.yml'), 'utf8'));
  assert.deepStrictEqual(updated, { name: 'charlie' });
});

test('YamlDirectoryDataSource throws when directory is missing', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const source = new YamlDirectoryDataSource({}, root);
  await assert.rejects(
    () => source.fetch({ path: 'missing' }, 'a'),
    /Invalid path/,
  );
});

test('YamlAreaDataSource reads and updates area manifests', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const dirPath = path.join(root, 'areas');
  writeYaml(path.join(dirPath, 'area-one', 'manifest.yml'), { title: 'Area One' });
  writeYaml(path.join(dirPath, 'area-two', 'manifest.yml'), { title: 'Area Two' });

  const source = new YamlAreaDataSource({}, root);
  const data = await source.fetchAll({ path: 'areas' });
  assert.deepStrictEqual(data, {
    'area-one': { title: 'Area One' },
    'area-two': { title: 'Area Two' },
  });

  await source.update({ path: 'areas' }, 'area-one', { title: 'Area One Updated' });
  const updated = yaml.load(
    fs.readFileSync(path.join(dirPath, 'area-one', 'manifest.yml'), 'utf8')
  );
  assert.deepStrictEqual(updated, { title: 'Area One Updated' });
});

test('YamlAreaDataSource throws when directory is missing', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const source = new YamlAreaDataSource({}, root);
  await assert.rejects(
    () => source.fetch({ path: 'missing' }, 'area-one'),
    /Invalid path/,
  );
});

test('JsonDataSource handles large files on read/update', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const largeData = makeLargeObject(500);
  writeJson(path.join(root, 'large.json'), largeData);

  const source = new JsonDataSource({}, root);
  const data = await source.fetchAll({ path: 'large.json' });
  assert.strictEqual(Object.keys(data).length, 500);

  await source.update({ path: 'large.json' }, 'id500', { value: 'added' });
  const updated = await source.fetchAll({ path: 'large.json' });
  assert.strictEqual(Object.keys(updated).length, 501);
  assert.deepStrictEqual(updated.id500, { value: 'added' });
});

test('YamlDataSource handles large files on read/update', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const largeData = makeLargeObject(300);
  writeYaml(path.join(root, 'large.yml'), largeData);

  const source = new YamlDataSource({}, root);
  const data = await source.fetchAll({ path: 'large.yml' });
  assert.strictEqual(Object.keys(data).length, 300);

  await source.update({ path: 'large.yml' }, 'id300', { value: 'added' });
  const updated = await source.fetchAll({ path: 'large.yml' });
  assert.strictEqual(Object.keys(updated).length, 301);
  assert.deepStrictEqual(updated.id300, { value: 'added' });
});

test('JsonDirectoryDataSource ignores nested directories', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const dirPath = path.join(root, 'jsondir');
  writeJson(path.join(dirPath, 'a.json'), { name: 'alpha' });
  writeJson(path.join(dirPath, 'nested', 'b.json'), { name: 'beta' });

  const source = new JsonDirectoryDataSource({}, root);
  const data = await source.fetchAll({ path: 'jsondir' });
  assert.deepStrictEqual(data, { a: { name: 'alpha' } });
});

test('YamlDirectoryDataSource ignores nested directories', async (t) => {
  const root = makeTempDir();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const dirPath = path.join(root, 'yamldir');
  writeYaml(path.join(dirPath, 'a.yml'), { name: 'alpha' });
  writeYaml(path.join(dirPath, 'nested', 'b.yml'), { name: 'beta' });

  const source = new YamlDirectoryDataSource({}, root);
  const data = await source.fetchAll({ path: 'yamldir' });
  assert.deepStrictEqual(data, { a: { name: 'alpha' } });
});
