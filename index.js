/*!
 * node-font2base64
 * Copyright(c) 2020 Junmin Ahn
 * MIT Licensed
 */

'use strict';

const fs = require('fs');
const path = require('path');
const css = require('css');

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

const toDataUrl = (fpath, base64) => {
  const { ext } = path.parse(fpath);
  const mediaType = fontMap[ext].mediaType;
  return _toDataUrl(mediaType, base64);
};

const toDataSrc = (fpath, base64) => {
  const { ext } = path.parse(fpath);
  const fontMeta = fontMap[ext];
  if (!fontMeta) return null;

  const mediaType = fontMap[ext].mediaType;
  const format = fontMap[ext].format;

  const dataUrl = _toDataUrl(mediaType, base64);
  return _toDataSrc(dataUrl, format);
};

const _encodeToDataUrl = async fpath => {
  const buff = await readFileAsync(fpath);
  const base64 = _buffToBase64(buff);
  return toDataUrl(fpath, base64);
};

const _encodeToDataUrlSync = fpath => {
  const buff = fs.readFileSync(fpath);
  const base64 = _buffToBase64(buff);
  return toDataUrl(fpath, base64);
};

const _encodeToDataSrc = async fpath => {
  const buff = await readFileAsync(fpath);
  const base64 = _buffToBase64(buff);
  return toDataSrc(fpath, base64);
};

const _encodeToDataSrcSync = fpath => {
  const buff = fs.readFileSync(fpath);
  const base64 = _buffToBase64(buff);
  return toDataSrc(fpath, base64);
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

const _updateCssAst = (content, validator, dataUrlMap, keys) => {
  const ast = css.parse(content);

  let modified = false;

  each(ast.stylesheet.rules, rule => {
    if (rule.type === 'font-face') {
      each(rule.declarations, dec => {
        if (dec.property === 'src') {
          const urls = dec.value.split(',');

          const nUrls = urls.map(url => {
            const fontpath = _extractSrcUrl(url);
            let nUrl = url;

            each(keys, key => {
              if (validator(fontpath, key)) {
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

  return {
    ast,
    modified,
  };
};

const _defaultValidator = (url, basename) => path.basename(url) === basename;

const injectBase64 = async (
  fpath,
  cpath,
  { validator = _defaultValidator, fontTypes = _fontTypes, cssTypes = _styleTypes } = {}
) => {
  const dataUrlMap = {};

  try {
    await promiseMap(await readAllFilesAsync(fpath, fontTypes), async fp => {
      const dataSrc = await _encodeToDataSrc(fp);
      dataUrlMap[path.basename(fp)] = dataSrc;
    });

    const keys = Object.keys(dataUrlMap);

    await promiseMap(await readAllFilesAsync(cpath, cssTypes), async cp => {
      const content = await readFileAsync(cp, 'utf8');
      const { ast, modified } = _updateCssAst(content, validator, dataUrlMap, keys);

      if (modified) {
        const newContent = css.stringify(ast);
        return writeFileAsync(cp, newContent, 'utf8');
      }
    });
  } catch (e) {
    return e;
  }

  return true;
};

const injectBase64Sync = (
  fpath,
  cpath,
  { validator = _defaultValidator, fontTypes = _fontTypes, cssTypes = _styleTypes } = {}
) => {
  const dataUrlMap = {};

  try {
    eachArray(readAllFilesSync(fpath, fontTypes), fp => {
      dataUrlMap[path.basename(fp)] = _encodeToDataSrcSync(fp);
    });

    const keys = Object.keys(dataUrlMap);

    eachArray(readAllFilesSync(cpath, cssTypes), cp => {
      const content = fs.readFileSync(cp, 'utf8');

      const { ast, modified } = _updateCssAst(content, validator, dataUrlMap, keys);

      if (modified) {
        const newContent = css.stringify(ast);
        fs.writeFileSync(cp, newContent, 'utf8');
      }
    });
  } catch (e) {
    return e;
  }

  return true;
};

module.exports = exports = {
  encodeToDataUrl,
  encodeToDataSrc,
  encodeToDataUrlSync,
  encodeToDataSrcSync,
  injectBase64,
  injectBase64Sync,
};
