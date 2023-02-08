import { readFile, writeFile, stat, statSync, readdirSync, readdir, Stats } from 'fs';
import { join, extname } from 'path';

export const isString = (value: any) => typeof value === 'string';

export const isFunction = (value: any) => typeof value === 'function';

export const isPlainObject = (obj: any) => Object.prototype.toString.call(obj) === '[object Object]';

export const isArray = Array.isArray;

export const isNil = (value: any) => value === undefined || value === null;

export const castArray = (value: any) => {
  if (isNil(value)) return [];
  return isArray(value) ? value : [value];
};

export const each = <T>(
  items: T[],
  fn: (item: T, index: number, items: T[]) => void | undefined | boolean,
  startOffset = 0,
  endOffset = 0,
) => {
  for (let x = startOffset; x < items.length - endOffset; x++) {
    if (fn(items[x], x, items) === false) break;
  }
};

export const eachArray = <T>(
  items: T[] | T | null | undefined,
  fn: (item: T, index: number, items: T[]) => void | undefined | boolean,
  startOffset = 0,
  endOffset = 0,
) => {
  items = castArray(items);
  each<T>(items, fn, startOffset, endOffset);
};

export const eachAsync = async <T>(
  items: T[],
  fn: (item: T, index: number, items: T[]) => Promise<undefined | boolean>,
  startOffset = 0,
  endOffset = 0,
) => {
  for (let x = startOffset; x < items.length - endOffset; x++) {
    const ret = await fn(items[x], x, items);
    if (ret === false) break;
  }
};

export const promiseMap = <T>(
  items: T[] | T | null | undefined,
  fn: (item: T, index: number, items: T[]) => Promise<any>,
) => {
  items = castArray(items);

  const promises = [];
  for (let x = 0; x < items.length; x++) {
    promises.push(fn(items[x], x, items));
  }
  return Promise.all(promises);
};

export const promisify =
  <T>(fn: Function) =>
  (...args: any[]) =>
    new Promise((resolve, reject) => {
      fn(...args, (err: Error, data: any) => {
        if (err) return reject(err);
        return resolve(data);
      });
    }) as Promise<T>;

export const readFileAsync = promisify<string | Buffer>(readFile);

export const writeFileAsync = promisify<void>(writeFile);

export const statAsync = promisify<Stats>(stat);

export const readdirAsync = promisify<string[] | Buffer[]>(readdir);

export const readAllFilesAsync = async (fileOrPath: string | string[], allowedExts: string[] = []) => {
  const files: string[] = [];
  await promiseMap(fileOrPath, async (fp) => {
    try {
      const stat = await statAsync(fp);
      if (stat.isDirectory()) {
        const subs = (await readdirAsync(fp)) as string[];
        const subPaths = subs.map((s) => join(fp, s));
        const subFiles = await readAllFilesAsync(subPaths, allowedExts);
        files.push(...subFiles);
      } else {
        if (allowedExts.includes(extname(fp))) files.push(fp);
      }
    } catch (e) {} // thing not exists
  });

  return files;
};

export const readAllFilesSync = (fileOrPath: string | string[], allowedExts: string[] = []) => {
  const files: string[] = [];
  eachArray(fileOrPath, (fp) => {
    try {
      const stat = statSync(fp);
      if (stat.isDirectory()) {
        const subs = readdirSync(fp);
        const subPaths = subs.map((s) => join(fp, s));
        const subFiles = readAllFilesSync(subPaths, allowedExts);
        files.push(...subFiles);
      } else {
        if (allowedExts.includes(extname(fp))) files.push(fp);
      }
    } catch (e) {} // thing not exists
  });

  return files;
};
