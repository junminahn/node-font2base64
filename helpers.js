'use strict';

const fs = require('fs');
const path = require('path');

const isString = value => typeof value === 'string';

const isFunction = value => typeof value === 'function';

const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

const isArray = Array.isArray;

const isNil = value => value === undefined || value === null;

const castArray = value => {
  if (isNil(value)) return [];
  return isArray(value) ? value : [value];
};

const each = (value, fn, startOffset = 0, endOffset = 0) => {
  for (let x = startOffset; x < value.length - endOffset; x++) {
    if (fn(value[x], x, value) === false) break;
  }
};

const eachArray = (array, fn, startOffset = 0, endOffset = 0) => {
  array = castArray(array);

  for (let x = startOffset; x < array.length - endOffset; x++) {
    if (fn(array[x], x, array) === false) break;
  }
};

const eachAsync = async (array, fn, startOffset = 0, endOffset = 0) => {
  for (let x = startOffset; x < value.length - endOffset; x++) {
    const ret = await fn(array[x], x, array);
    if (ret === false) break;
  }
};

const promiseMap = (array, asyncFn) => {
  array = castArray(array);

  const promises = [];
  for (var i = 0; i < array.length; ++i) {
    promises.push(asyncFn(array[i]));
  }
  return Promise.all(promises);
};

const promisify = fn => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  };
};

const readFileAsync = promisify(fs.readFile);

const writeFileAsync = promisify(fs.writeFile);

const statAsync = promisify(fs.stat);

const readdirAsync = promisify(fs.readdir);

const readAllFilesAsync = async (fileOrPath, allowedExts) => {
  const files = [];
  await promiseMap(fileOrPath, async fp => {
    try {
      const stat = await statAsync(fp);
      if (stat.isDirectory()) {
        const subs = await readdirAsync(fp);
        const subPaths = subs.map(s => path.join(fp, s));
        const subFiles = await readAllFilesAsync(subPaths, allowedExts);
        files.push(...subFiles);
      } else {
        if (allowedExts && allowedExts.includes(path.extname(fp))) files.push(fp);
      }
    } catch (e) {} // thing not exists
  });

  return files;
};

const readAllFilesSync = (fileOrPath, allowedExts) => {
  const files = [];
  eachArray(fileOrPath, fp => {
    try {
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) {
        const subs = fs.readdirSync(fp);
        const subPaths = subs.map(s => path.join(fp, s));
        const subFiles = readAllFilesSync(subPaths, allowedExts);
        files.push(...subFiles);
      } else {
        if (allowedExts && allowedExts.includes(path.extname(fp))) files.push(fp);
      }
    } catch (e) {} // thing not exists
  });

  return files;
};

module.exports = exports = {
  isString,
  isFunction,
  isNil,
  isPlainObject,
  isArray,
  castArray,
  each,
  eachArray,
  eachAsync,
  promiseMap,
  readFileAsync,
  writeFileAsync,
  statAsync,
  readAllFilesAsync,
  readAllFilesSync,
};
