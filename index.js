/*!
 * node-font2base64
 * Copyright(c) 2020 Junmin Ahn
 * MIT Licensed
 */

'use strict';

const fs = require('fs');
const path = require('path');
const FileType = require('file-type');
const css = require('css');

let sync;
try {
  sync = require('promise-synchronizer');
} catch (er) {
  sync = null;
}

const {
  isArray,
  each,
  eachArray,
  promiseMap,
  readFileAsync,
  writeFileAsync,
  readAllFilesAsync,
  readAllFilesSync,
} = require('./helpers');

const MAX_PATH_LENGTH = 200;

const fontMap = {
  '.svg': {
    mediaType: 'image/svg+xml',
    format: 'svg',
  },
  '.ttf': {
    mediaType: 'font/truetype',
    format: 'truetype',
  },
  '.otf': {
    mediaType: 'font/opentype',
    format: 'opentype',
  },
  '.eot': {
    mediaType: 'application/vnd.ms-fontobject',
    format: 'embedded-opentype',
  },
  '.sfnt': {
    mediaType: 'application/font-sfnt',
    format: 'sfnt',
  },
  '.woff2': {
    mediaType: 'application/font-woff2',
    format: 'woff2',
  },
  '.woff': {
    mediaType: 'application/font-woff',
    format: 'woff',
  },
};

const _fontTypes = Object.keys(fontMap);
const _styleTypes = ['.css', '.scss', '.less'];

const _buffToBase64 = buff => buff.toString('base64');

const _readBuffer = async buff => {
  const base64 = _buffToBase64(buff);
  const data = await FileType.fromBuffer(buff);
  data.base64 = base64;
  return data;
};

const _readBufferSync = buff => {
  const base64 = _buffToBase64(buff);
  let data;
  if (sync) {
    data = sync(FileType.fromBuffer(buff));
  } else {
    data = {};
  }
  data.base64 = base64;
  return data;
};

/**
 * A data URI consists of data:[<media type>][;base64],<data>
 * https://en.wikipedia.org/wiki/Data_URI_scheme
 *
 * # Font formats
 * svg   = svn:mime-type=image/svg+xml
 * ttf   = svn:mime-type=application/x-font-ttf
 * otf   = svn:mime-type=application/x-font-opentype
 * woff  = svn:mime-type=application/font-woff
 * woff2 = svn:mime-type=application/font-woff2
 * eot   = svn:mime-type=application/vnd.ms-fontobject
 * sfnt  = svn:mime-type=application/font-sfnt
 */
const _toDataUrl = (mediaType, base64) => `data:${mediaType};charset=utf-8;base64,${base64}`;
const _toDataSrc = (dataUrl, format) => `url(${dataUrl}) format('${format}')`;

const _getMeta = (fpath, ext) => {
  const naive = path.parse(fpath).ext;

  // https://www.npmjs.com/package/file-type#supported-file-types
  if (naive === '.svg') return fontMap[naive];
  const type = (ext && `.${ext}`) || naive;
  return fontMap[type];
};

const toDataUrl = (fpath, { ext, mime, base64 }) => {
  const meta = _getMeta(fpath, ext);
  const mediaType = meta.mediaType;
  return _toDataUrl(mediaType, base64);
};

const toDataSrc = (fpath, { ext, mime, base64 }) => {
  const meta = _getMeta(fpath, ext);
  if (!meta) return null;

  const mediaType = meta.mediaType;
  const format = meta.format;

  const dataUrl = _toDataUrl(mediaType, base64);
  return _toDataSrc(dataUrl, format);
};

const _encodeToDataUrl = async fpath => {
  const buff = await readFileAsync(fpath);
  const data = await _readBuffer(buff);
  return toDataUrl(fpath, data);
};

const _encodeToDataUrlSync = fpath => {
  const buff = fs.readFileSync(fpath);
  const data = _readBufferSync(buff);
  return toDataUrl(fpath, data);
};

const _encodeToDataSrc = async fpath => {
  const buff = await readFileAsync(fpath);
  const data = await _readBuffer(buff);
  return toDataSrc(fpath, data);
};

const _encodeToDataSrcSync = fpath => {
  const buff = fs.readFileSync(fpath);
  const data = _readBufferSync(buff);
  return toDataSrc(fpath, data);
};

const encodeToDataUrl = async fpath => {
  if (isArray(fpath)) return Promise.all(fpath.map(_encodeToDataUrl));
  return _encodeToDataUrl(fpath);
};

const encodeToDataUrlSync = fpath => {
  if (isArray(fpath)) return fpath.map(_encodeToDataUrlSync);
  return _encodeToDataUrlSync(fpath);
};

const encodeToDataSrc = fpath => {
  if (isArray(fpath)) return Promise.all(fpath.map(_encodeToDataSrcSync));
  return _encodeToDataSrc(fpath);
};

const encodeToDataSrcSync = fpath => {
  if (isArray(fpath)) return fpath.map(_encodeToDataSrcSync);
  return _encodeToDataSrcSync(fpath);
};

const _extractSrcUrl = value => {
  const rx = /url\('?(.+?)(\??#.+?)?'?\)/g;
  const arr = rx.exec(value);
  if (!arr) return value;
  return arr[1];
};

const _updateCssAst = (content, validator, dataUrlMap, fullpathMatch, cssRoot) => {
  const keys = Object.keys(dataUrlMap);
  const ast = css.parse(content);

  let modified = false;

  each(ast.stylesheet.rules, rule => {
    if (rule.type === 'font-face') {
      each(rule.declarations, dec => {
        if (dec.property === 'src') {
          const urls = dec.value.split(',');

          const nUrls = urls.map(url => {
            let nUrl = url;

            const urlpath = _extractSrcUrl(url);
            if (urlpath.length > MAX_PATH_LENGTH) return nUrl;

            const fullmatch = fullpathMatch && cssRoot;

            const tpathToCompare = (fullmatch && path.resolve(cssRoot, urlpath)) || path.basename(urlpath);

            each(keys, key => {
              const kpathToCompare = (fullmatch && path.resolve(key)) || path.basename(key);

              if (validator(tpathToCompare, kpathToCompare, urlpath, key)) {
                nUrl = dataUrlMap[key];
                modified = true;
                return false;
              }
            });
            return nUrl;
          });
          dec.value = nUrls.join(',\n');
        }
      });
    }
  });

  const result = { modified };

  if (modified) {
    const newContent = css.stringify(ast);
    result.content = newContent;
  } else {
    result.content = content;
  }

  return result;
};

const _defaultValidator = (path1, path2) => path1 === path2;

const _generateDataUrlMap = async (fpath, fontTypes) => {
  const dataUrlMap = {};

  try {
    await promiseMap(await readAllFilesAsync(fpath, fontTypes), async fp => {
      dataUrlMap[fp] = await _encodeToDataSrc(fp);
    });
  } catch (e) {
    console.error(e);
  }

  return dataUrlMap;
};

const _generateDataUrlMapSync = (fpath, fontTypes) => {
  const dataUrlMap = {};

  eachArray(readAllFilesSync(fpath, fontTypes), fp => {
    dataUrlMap[fp] = _encodeToDataSrcSync(fp);
  });

  return dataUrlMap;
};

const injectBase64 = async (
  fpath,
  cpath,
  {
    validator = _defaultValidator,
    fontTypes = _fontTypes,
    cssTypes = _styleTypes,
    resave = true,
    fullpathMatch = false,
  } = {}
) => {
  const dataUrlMap = await _generateDataUrlMap(fpath, fontTypes);
  const results = [];

  try {
    await promiseMap(await readAllFilesAsync(cpath, cssTypes), async cp => {
      const content = await readFileAsync(cp, 'utf8');

      const result = _updateCssAst(content, validator, dataUrlMap, fullpathMatch, path.parse(cp).dir);

      if (result.modified && resave) {
        await writeFileAsync(cp, result.content, 'utf8');
      }

      result.filepath = cp;
      results.push(result);
    });
  } catch (err) {
    console.error(err);
  }

  return resave ? true : results;
};

const injectBase64Sync = (
  fpath,
  cpath,
  {
    validator = _defaultValidator,
    fontTypes = _fontTypes,
    cssTypes = _styleTypes,
    resave = true,
    fullpathMatch = false,
  } = {}
) => {
  const dataUrlMap = _generateDataUrlMapSync(fpath, fontTypes);
  const results = [];

  try {
    eachArray(readAllFilesSync(cpath, cssTypes), cp => {
      const content = fs.readFileSync(cp, 'utf8');

      const result = _updateCssAst(content, validator, dataUrlMap, fullpathMatch, path.parse(cp).dir);

      if (result.modified && resave) {
        fs.writeFileSync(cp, result.content, 'utf8');
      }

      result.filepath = cp;
      results.push(result);
    });
  } catch (err) {
    console.error(err);
  }

  return resave ? true : results;
};

injectBase64.fromContent = async (
  fpath,
  content,
  { validator = _defaultValidator, fontTypes = _fontTypes, fullpathMatch = false, root } = {}
) => {
  const dataUrlMap = await _generateDataUrlMap(fpath, fontTypes);
  return _updateCssAst(content, validator, dataUrlMap, fullpathMatch, root);
};

injectBase64Sync.fromContent = (
  fpath,
  content,
  { validator = _defaultValidator, fontTypes = _fontTypes, fullpathMatch = false, root } = {}
) => {
  const dataUrlMap = _generateDataUrlMapSync(fpath, fontTypes);
  return _updateCssAst(content, validator, dataUrlMap, fullpathMatch, root);
};

injectBase64.fromBuffer = async (fpath, buffer, options) => {
  const content = buffer.toString('utf8');
  return injectBase64.fromContent(fpath, content, options);
};

injectBase64Sync.fromBuffer = (fpath, buffer, options) => {
  const content = buffer.toString('utf8');
  return injectBase64Sync.fromContent(fpath, content, options);
};

module.exports = exports = {
  encodeToDataUrl,
  encodeToDataSrc,
  encodeToDataUrlSync,
  encodeToDataSrcSync,
  injectBase64,
  injectBase64Sync,
};
