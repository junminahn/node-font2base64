# node-font2base64

[![NPM version](https://img.shields.io/npm/v/node-font2base64.svg)](https://www.npmjs.com/package/node-font2base64)
[![Dependency Status](https://david-dm.org/junminahn/node-font2base64.svg)](https://david-dm.org/junminahn/node-font2base64)
[![License](https://img.shields.io/npm/l/junminahn/node-font2base64.svg)](/LICENSE) 

Convert font to base64 url or src, and to inject src into style files

## Installation
```sh
$ npm install node-font2base64
```

## API
### .encodeToDataUrl (fontpath)
* Convert font file(s) to font-media base64 data url asynchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataUrl = await font2base64.encodeToDataUrl('fonts/myfont-regular.ttf')
// => data:font/truetype;charset=utf-8;base64,<base64>
```

### .encodeToDataUrlSync (fontpath)
* Convert font file(s) to font-media base64 data url synchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {string} | {Array{string}}
```js
const dataUrl = font2base64.encodeToDataUrlSync('fonts/myfont-regular.woff')
// => data:application/font-woff;charset=utf-8;base64,<base64>
```

### .encodeToDataSrc (fontpath)
* Convert font file(s) to font-media base64 data src asynchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataSrc = await font2base64.encodeToDataSrc('fonts/myfont-regular.ttf')
// => url(data:font/truetype;charset=utf-8;base64,<base64>) format('truetype')
```

### .encodeToDataSrcSync (fontpath)
* Convert font file(s) to font-media base64 data src synchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {string} | {Array{string}}
```js
const dataSrc = font2base64.encodeToDataSrcSync('fonts/myfont-regular.woff')
// => url(data:application/font-woff;charset=utf-8;base64,<base64>) format('woff')
```

### .injectBase64 (fontpath, stylepath[, options])
* Replace font url(s) in style file(s) with font-media base64 data src asynchronously
* `fontpath`: {string} | {Array{string}}
* `stylepath`: {string} | {Array{string}}
* `options`: {Object}
    * `validator`: {Function}: (font_url_in_style_file, font_basename) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `cssTypes`: {Array{string}}
        * allowed style ext names
        * default to ['.css', '.scss', '.less']
* Returns: {Promise} containing {true | Error}
```js
const result = await font2base64.injectBase64('./fonts', './styles')
// => true
```

### .injectBase64Sync (fontpath, stylepath[, options])
* Replace font url(s) in style file(s) with font-media base64 data src synchronously
* `fontpath`: {string} | {Array{string}}
* `stylepath`: {string} | {Array{string}}
* `options`: {Object}
    * `validator`: {Function}: (font_url_in_style_file, font_basename) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `cssTypes`: {Array{string}}
        * allowed style ext names
        * default to ['.css', '.scss', '.less']
* Returns: {true | Error}
```js
const result = font2base64.injectBase64Sync('./fonts', './styles')
// => true
```

### [MIT Licensed](LICENSE)